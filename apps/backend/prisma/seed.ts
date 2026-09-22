/**
 * Tavonza AI — demo seed.
 *os
 * Builds one complete tenant so the branch + customer flow can be demonstrated
 * end to end: a fully set-up branch with every table AVAILABLE and no open
 * session (so the live QR → OTP → order → accept → prepare → serve → pay →
 * close flow runs from zero), plus ~2 weeks of completed history so dashboards,
 * reports and the audit log are not empty.
 *
 * ── Destructive ────────────────────────────────────────────────────────────
 * This wipes every collection. It refuses to run unless forced — either
 * `pnpm seed -- --force` or SEED_FORCE=yes. Without a force flag it only
 * reports what it would delete.
 *
 *   pnpm seed                 # dry run
 *   pnpm seed -- --force      # wipe and seed
 *   SEED_FORCE=yes pnpm seed  # same, via the environment
 *
 * ── Demo credentials ───────────────────────────────────────────────────────
 *   Super admin   euhan.dev@gmail.com        123456
 *   Org admin     owner@tavonza.demo         Demo1234!
 *   all staff     <role>@tavonza.demo        Demo1234!
 *   all customers <name>@tavonza.demo        Demo1234!
 *
 * The super admin's email/password intentionally match SuperAdminInitService's
 * defaults so the account is the same one the app bootstraps.
 */
import { randomUUID } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import {
  DiscountType,
  GlobalRole,
  InventoryUnit,
  OrderAcceptanceMode,
  OrderChannel,
  OrderItemStatus,
  OrderRejectionReason,
  OrderStatus,
  OtpPurpose,
  PaymentMethod,
  PaymentScope,
  PaymentStatus,
  PermissionAction,
  PrismaClient,
  ReservationStatus,
  Shape,
  ShiftSlotStatus,
  StaffRole,
  StationType,
  TableOperationalFlag,
  TableServiceStatus,
  TableSessionStatus,
  GuestSessionStatus,
  UserStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// ── Environment ─────────────────────────────────────────────────────────────
// `prisma db seed` loads .env itself; the raw `ts-node prisma/seed.ts` path
// does not, so load it manually when DATABASE_URL is missing.
if (!process.env.DATABASE_URL) {
  const envPath = join(__dirname, '..', '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  }
}

const prisma = new PrismaClient();

// `--force` via argv is shell-independent; SEED_FORCE also works for CI.
const FORCE = process.argv.includes('--force') || process.env.SEED_FORCE === 'yes';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

const STAFF_PASSWORD = 'Demo1234!';
const SUPER_ADMIN_PASSWORD = '123456';
const ORG_PASSWORD = 'Demo1234!';

/** Where the customer-facing app lives — used for the printed QR links. */
const CUSTOMER_APP_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ── Small helpers ───────────────────────────────────────────────────────────

/** A stable timestamp `days` ago at a given hour, so runs are reproducible-ish. */
function daysAgo(days: number, hour = 19, minute = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3_600_000);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Per-branch daily sequence, e.g. "DT-20260922-003". */
function orderNumber(branchCode: string, date: Date, sequence: number): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `${branchCode}-${stamp}-${String(sequence).padStart(3, '0')}`;
}

// ── Menu definitions ────────────────────────────────────────────────────────
// `station` is what becomes OrderItem.stationType. Note: MenuItem itself has no
// stationType column, so this mapping is the seed's own (and would need to be
// owned somewhere in the app layer too).

type SeedModifier = { name: string; priceDelta: number };

type SeedModifierGroup = {
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  modifiers: SeedModifier[];
};

type SeedItem = {
  name: string;
  description: string;
  basePrice: number;
  station: StationType;
  isVegetarian?: boolean;
  spiceLevel?: number;
  modifierGroups?: SeedModifierGroup[];
};

type SeedCategory = { name: string; description: string; items: SeedItem[] };

const SIZE_GROUP: SeedModifierGroup = {
  name: 'Size',
  isRequired: true,
  minSelect: 1,
  maxSelect: 1,
  modifiers: [
    { name: 'Regular', priceDelta: 0 },
    { name: 'Large', priceDelta: 1.5 },
  ],
};

const ADD_ONS_GROUP: SeedModifierGroup = {
  name: 'Add-ons',
  isRequired: false,
  minSelect: 0,
  maxSelect: 3,
  modifiers: [
    { name: 'Extra Cheese', priceDelta: 1.0 },
    { name: 'Crispy Bacon', priceDelta: 2.0 },
    { name: 'Avocado', priceDelta: 1.5 },
    { name: 'Fried Egg', priceDelta: 1.25 },
  ],
};

const SPICE_GROUP: SeedModifierGroup = {
  name: 'Spice Level',
  isRequired: true,
  minSelect: 1,
  maxSelect: 1,
  modifiers: [
    { name: 'Mild', priceDelta: 0 },
    { name: 'Medium', priceDelta: 0 },
    { name: 'Hot', priceDelta: 0 },
    { name: 'Extra Hot', priceDelta: 0 },
  ],
};

const MENU: SeedCategory[] = [
  {
    name: 'Starters',
    description: 'Small plates to share while you decide.',
    items: [
      {
        name: 'Crispy Calamari',
        description: 'Lightly battered squid, lemon aioli, pickled chilli.',
        basePrice: 12.5,
        station: StationType.KITCHEN,
      },
      {
        name: 'Truffle Arancini',
        description: 'Three risotto balls, truffle oil, parmesan dust.',
        basePrice: 10.0,
        station: StationType.KITCHEN,
        isVegetarian: true,
      },
      {
        name: 'Charred Padrón Peppers',
        description: 'Sea salt, smoked paprika, olive oil.',
        basePrice: 8.0,
        station: StationType.KITCHEN,
        isVegetarian: true,
        spiceLevel: 1,
      },
      {
        name: 'Garlic Flatbread',
        description: 'Wood-fired, roasted garlic butter, rosemary.',
        basePrice: 7.5,
        station: StationType.KITCHEN,
        isVegetarian: true,
      },
    ],
  },
  {
    name: 'Mains',
    description: 'Wood-fired and slow-cooked plates.',
    items: [
      {
        name: 'Saffron & Sage Burger',
        description: 'Dry-aged beef, sage aioli, brioche, house pickles.',
        basePrice: 18.5,
        station: StationType.KITCHEN,
        modifierGroups: [ADD_ONS_GROUP],
      },
      {
        name: 'Butter Chicken',
        description: 'Tandoori chicken, tomato fenugreek cream, basmati.',
        basePrice: 19.0,
        station: StationType.KITCHEN,
        spiceLevel: 2,
        modifierGroups: [SPICE_GROUP],
      },
      {
        name: 'Wild Mushroom Risotto',
        description: 'Carnaroli rice, porcini, aged pecorino.',
        basePrice: 17.0,
        station: StationType.KITCHEN,
        isVegetarian: true,
      },
      {
        name: 'Grilled Sea Bass',
        description: 'Whole fillet, fennel salad, salsa verde.',
        basePrice: 24.0,
        station: StationType.KITCHEN,
      },
      {
        name: 'Margherita Pizza',
        description: 'San Marzano, fior di latte, fresh basil.',
        basePrice: 14.0,
        station: StationType.KITCHEN,
        isVegetarian: true,
        modifierGroups: [ADD_ONS_GROUP],
      },
      {
        name: 'Lamb Kofta Skewers',
        description: 'Spiced lamb, chargrilled, mint yoghurt, sumac onions.',
        basePrice: 21.0,
        station: StationType.KITCHEN,
        spiceLevel: 2,
      },
    ],
  },
  {
    name: 'Desserts',
    description: 'Something sweet to finish.',
    items: [
      {
        name: 'Dark Chocolate Fondant',
        description: 'Molten centre, vanilla bean ice cream.',
        basePrice: 9.5,
        station: StationType.KITCHEN,
        isVegetarian: true,
      },
      {
        name: 'Salted Caramel Cheesecake',
        description: 'Baked vanilla cheesecake, salted caramel, brittle.',
        basePrice: 8.5,
        station: StationType.KITCHEN,
        isVegetarian: true,
      },
      {
        name: 'Mango Sorbet',
        description: 'Alphonso mango, lime zest.',
        basePrice: 6.5,
        station: StationType.KITCHEN,
        isVegetarian: true,
      },
    ],
  },
  {
    name: 'Soft Drinks',
    description: 'Chilled, unlimited refills on request.',
    items: [
      {
        name: 'Still Water',
        description: '750ml glass bottle.',
        basePrice: 3.5,
        station: StationType.BAR,
        isVegetarian: true,
      },
      {
        name: 'Sparkling Water',
        description: '750ml glass bottle.',
        basePrice: 4.0,
        station: StationType.BAR,
        isVegetarian: true,
      },
      {
        name: 'Fresh Mint Lemonade',
        description: 'Pressed lemon, mint, soda.',
        basePrice: 5.0,
        station: StationType.BAR,
        isVegetarian: true,
        modifierGroups: [SIZE_GROUP],
      },
      {
        name: 'Cola',
        description: '330ml can.',
        basePrice: 3.5,
        station: StationType.BAR,
        isVegetarian: true,
      },
      {
        name: 'Masala Chai',
        description: 'Spiced black tea, steamed milk.',
        basePrice: 4.5,
        station: StationType.BAR,
        isVegetarian: true,
        modifierGroups: [SIZE_GROUP],
      },
    ],
  },
  {
    name: 'Cocktails',
    description: 'Mixed to order at the bar.',
    items: [
      {
        name: 'Saffron Negroni',
        description: 'House saffron gin, campari, sweet vermouth.',
        basePrice: 14.0,
        station: StationType.BAR,
      },
      {
        name: 'Passionfruit Spritz',
        description: 'Prosecco, passionfruit, soda, mint.',
        basePrice: 13.0,
        station: StationType.BAR,
      },
      {
        name: 'Old Fashioned',
        description: 'Bourbon, bitters, orange oils.',
        basePrice: 15.0,
        station: StationType.BAR,
      },
      {
        name: 'Virgin Mojito',
        description: 'Lime, mint, cane sugar, soda — no alcohol.',
        basePrice: 8.0,
        station: StationType.BAR,
        isVegetarian: true,
      },
    ],
  },
  {
    name: 'Beer & Wine',
    description: 'By the glass or bottle.',
    items: [
      {
        name: 'House Lager',
        description: 'Pint, crisp and cold.',
        basePrice: 7.0,
        station: StationType.BAR,
      },
      {
        name: 'Craft IPA',
        description: '330ml bottle, heavily hopped.',
        basePrice: 9.0,
        station: StationType.BAR,
      },
      {
        name: 'House Red Wine',
        description: '175ml glass, shiraz blend.',
        basePrice: 11.0,
        station: StationType.BAR,
      },
      {
        name: 'House White Wine',
        description: '175ml glass, sauvignon blanc.',
        basePrice: 11.0,
        station: StationType.BAR,
      },
    ],
  },
];

// ── Wipe ────────────────────────────────────────────────────────────────────

/** Every collection, children before parents. Mongo has no FKs, but this keeps
 *  the order meaningful and makes a partial failure easier to reason about. */
const WIPE_ORDER = [
  'paymentAllocation',
  'payment',
  'orderItemStatusChangeLog',
  'orderStatusChangeLog',
  'orderReview',
  'orderItem',
  'order',
  'waiterTableAssignment',
  'reservation',
  'tableAuthOtp',
  'guestSession',
  'tableSession',
  'table',
  'modifier',
  'modifierGroup',
  'menuItem',
  'menuCategory',
  'discount',
  'inventoryItem',
  'inventoryCategory',
  'supplier',
  'workShift',
  'staffAssignment',
  'branchSetting',
  'branchOperatingHour',
  'branchHoliday',
  'staff',
  'owner',
  'admin',
  'customer',
  'auditLog',
  'branch',
  'restaurant',
  'organization',
  'user',
  'passwordResetOtp',
] as const;

async function wipe() {
  for (const model of WIPE_ORDER) {
    const delegate = (prisma as unknown as Record<string, { deleteMany: (a: object) => Promise<{ count: number }> }>)[model];
    const { count } = await delegate.deleteMany({});
    if (count > 0) console.log(`  wiped ${model.padEnd(30)} ${count}`);
  }
}

async function reportOnly() {
  console.log('\n⚠️  No --force flag — nothing was deleted.\n');
  console.log('   This is what WOULD be removed:');
  for (const model of WIPE_ORDER) {
    const delegate = (prisma as unknown as Record<string, { count: (a?: object) => Promise<number> }>)[model];
    const count = await delegate.count({});
    if (count > 0) console.log(`     ${model.padEnd(30)} ${count}`);
  }
  console.log('\n   Re-run with:  pnpm seed -- --force\n');
}

// ── Account helpers ─────────────────────────────────────────────────────────

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, await bcrypt.genSalt(SALT_ROUNDS));
}

type StaffSpec = {
  email: string;
  name: string;
  contactNo: string;
  role: StaffRole;
  /** Branch assignment keys from the `branches` map. */
  branches: string[];
  permissions: PermissionAction[];
  /** Only set for branch managers — who created their assignment. */
  reportsTo?: string;
};

async function createUser(input: {
  email: string;
  name: string;
  contactNo: string;
  role: GlobalRole;
  password: string;
  avatar?: string;
}) {
  return prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      contactNo: input.contactNo,
      password: await hash(input.password),
      role: input.role,
      status: UserStatus.ACTIVE,
      avatar: input.avatar,
    },
  });
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!FORCE) {
    await reportOnly();
    return;
  }

  console.log('\n🌱  Seeding Tavonza demo data — wiping first.\n');
  await wipe();

  const now = new Date();

  // ══════════════════════════════════════════════════════════════════════════
  // 1. PLATFORM — super admin
  // ══════════════════════════════════════════════════════════════════════════
  const superAdmin = await createUser({
    email: 'euhan.dev@gmail.com',
    name: 'Super Admin',
    contactNo: '+10000000001',
    role: GlobalRole.SUPER_ADMIN,
    password: SUPER_ADMIN_PASSWORD,
  });
  console.log(`✅ super admin          ${superAdmin.email}`);

  // ══════════════════════════════════════════════════════════════════════════
  // 2. ORGANIZATION + OWNER ADMIN
  // ══════════════════════════════════════════════════════════════════════════
  const owner = await createUser({
    email: 'owner@tavonza.demo',
    name: 'Amara Okafor',
    contactNo: '+10000000002',
    role: GlobalRole.ADMIN,
    password: ORG_PASSWORD,
  });

  await prisma.admin.create({
    data: { userId: owner.id, intro: 'Group owner — Tavonza Demo Group.' },
  });

  const organization = await prisma.organization.create({
    data: {
      name: 'Tavonza Demo Group',
      slug: 'tavonza-demo-group',
      ownerId: owner.id,
    },
  });
  console.log(`✅ organization         ${organization.name}`);

  // ══════════════════════════════════════════════════════════════════════════
  // 3. BRAND (Restaurant) + TWO BRANCHES
  //    Two branches so the Regional Manager role has something to oversee.
  // ══════════════════════════════════════════════════════════════════════════
  const restaurant = await prisma.restaurant.create({
    data: {
      organizationId: organization.id,
      name: 'Saffron & Sage',
      slug: 'saffron-and-sage',
      description: 'Modern European plates with an Indian pantry. Two sites.',
      isActive: true,
    },
  });

  const downtown = await prisma.branch.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Saffron & Sage — Downtown',
      address: {
        line1: '14 Kingsway',
        city: 'Manchester',
        state: 'Greater Manchester',
        postalCode: 'M1 4BT',
        country: 'GB',
        lat: 53.4808,
        lng: -2.2426,
      },
      phone: '+441610000001',
      timezone: 'Europe/London',
      isActive: true,
    },
  });

  const riverside = await prisma.branch.create({
    data: {
      restaurantId: restaurant.id,
      name: 'Saffron & Sage — Riverside',
      address: {
        line1: '8 Riverside Walk',
        city: 'Manchester',
        state: 'Greater Manchester',
        postalCode: 'M3 5AB',
        country: 'GB',
        lat: 53.4794,
        lng: -2.2555,
      },
      phone: '+441610000002',
      timezone: 'Europe/London',
      isActive: true,
    },
  });
  console.log(`✅ brand + 2 branches   ${restaurant.name}`);

  // Branch settings — deliberately different acceptance modes so both
  // workflows can be demonstrated without editing config first.
  const downtownSettings = await prisma.branchSetting.create({
    data: {
      branchId: downtown.id,
      orderAcceptanceMode: OrderAcceptanceMode.WAITER_APPROVAL,
      backupAccepterRoles: [StaffRole.BRANCH_MANAGER, StaffRole.REGIONAL_MANAGER],
      hideUnavailableItems: false,
      allowMultipleGuestSessions: true,
      requireOtpPerGuest: true,
      allowSplitBill: true,
      allowGuestCheckoutWithoutAccount: true,
      currency: 'GBP',
      taxPercent: 20,
      serviceChargePct: 5,
      tipEnabled: true,
      reservationsEnabled: true,
      waitlistEnabled: true,
    },
  });

  const riversideSettings = await prisma.branchSetting.create({
    data: {
      branchId: riverside.id,
      orderAcceptanceMode: OrderAcceptanceMode.AUTO_ACCEPT,
      backupAccepterRoles: [StaffRole.BRANCH_MANAGER],
      hideUnavailableItems: true,
      allowMultipleGuestSessions: true,
      requireOtpPerGuest: false,
      allowSplitBill: true,
      currency: 'GBP',
      taxPercent: 20,
      serviceChargePct: 0,
      tipEnabled: true,
    },
  });

  // Operating hours — Mon–Thu 11–23, Fri/Sat 11–00, Sun 12–22.
  for (const branch of [downtown, riverside]) {
    for (let day = 0; day < 7; day += 1) {
      const isWeekend = day === 5 || day === 6;
      const isSunday = day === 0;
      await prisma.branchOperatingHour.create({
        data: {
          branchId: branch.id,
          dayOfWeek: day,
          openTime: isSunday ? '12:00' : '11:00',
          closeTime: isSunday ? '22:00' : isWeekend ? '00:00' : '23:00',
        },
      });
    }
  }

  await prisma.branchHoliday.create({
    data: {
      branchId: downtown.id,
      date: new Date(now.getFullYear() + 1, 0, 1),
      isClosed: true,
      label: "New Year's Day",
    },
  });
  console.log('✅ operating hours + 1 holiday');

  // ══════════════════════════════════════════════════════════════════════════
  // 4. STAFF
  //    Titles map to StaffRole + permissions[] templates (see the flow doc:
  //    Regional/Assistant Manager are BRANCH_MANAGER with different grants).
  // ══════════════════════════════════════════════════════════════════════════

  const ALL_MANAGER_PERMISSIONS = [
    PermissionAction.MANAGE_MENU,
    PermissionAction.MANAGE_TABLES,
    PermissionAction.MANAGE_STAFF,
    PermissionAction.MANAGE_RESERVATIONS,
    PermissionAction.VIEW_ORDERS,
    PermissionAction.UPDATE_ORDER_STATUS,
    PermissionAction.MANAGE_PAYMENTS,
    PermissionAction.APPLY_DISCOUNTS,
    PermissionAction.VIEW_REPORTS,
    PermissionAction.MANAGE_BRANCH_SETTINGS,
  ];

  // Assistant Manager: same role, reduced template (no settings, no staff creation).
  const ASSISTANT_MANAGER_PERMISSIONS = [
    PermissionAction.MANAGE_TABLES,
    PermissionAction.MANAGE_RESERVATIONS,
    PermissionAction.VIEW_ORDERS,
    PermissionAction.UPDATE_ORDER_STATUS,
    PermissionAction.APPLY_DISCOUNTS,
    PermissionAction.VIEW_REPORTS,
  ];

  const STAFF_SPECS: StaffSpec[] = [
    {
      email: 'regional@tavonza.demo',
      name: 'Nadia Rahman',
      contactNo: '+10000000010',
      role: StaffRole.REGIONAL_MANAGER,
      branches: ['downtown', 'riverside'],
      permissions: ALL_MANAGER_PERMISSIONS,
    },
    {
      email: 'manager@tavonza.demo',
      name: 'Marcus Bell',
      contactNo: '+10000000011',
      role: StaffRole.BRANCH_MANAGER,
      branches: ['downtown'],
      permissions: ASSISTANT_MANAGER_PERMISSIONS,
      reportsTo: 'regional@tavonza.demo',
    },
    {
      email: 'manager2@tavonza.demo',
      name: 'Grace Lin',
      contactNo: '+10000000012',
      role: StaffRole.BRANCH_MANAGER,
      branches: ['riverside'],
      permissions: ASSISTANT_MANAGER_PERMISSIONS,
      reportsTo: 'regional@tavonza.demo',
    },
    {
      email: 'waiter@tavonza.demo',
      name: 'Priya Sharma',
      contactNo: '+10000000013',
      role: StaffRole.WAITER,
      branches: ['downtown'],
      permissions: [PermissionAction.VIEW_ORDERS, PermissionAction.UPDATE_ORDER_STATUS],
    },
    {
      email: 'waiter2@tavonza.demo',
      name: 'Tom Alvarez',
      contactNo: '+10000000014',
      role: StaffRole.WAITER,
      branches: ['downtown'],
      permissions: [PermissionAction.VIEW_ORDERS, PermissionAction.UPDATE_ORDER_STATUS],
    },
    {
      email: 'waiter3@tavonza.demo',
      name: 'Omar Haddad',
      contactNo: '+10000000015',
      role: StaffRole.WAITER,
      branches: ['riverside'],
      permissions: [PermissionAction.VIEW_ORDERS, PermissionAction.UPDATE_ORDER_STATUS],
    },
    {
      email: 'bartender@tavonza.demo',
      name: 'Luis Ferreira',
      contactNo: '+10000000016',
      role: StaffRole.BARTENDER,
      branches: ['downtown'],
      permissions: [PermissionAction.UPDATE_ORDER_STATUS],
    },
    {
      email: 'kitchen@tavonza.demo',
      name: 'Yuki Tanaka',
      contactNo: '+10000000017',
      role: StaffRole.KITCHEN_STAFF,
      branches: ['downtown'],
      permissions: [PermissionAction.UPDATE_ORDER_STATUS],
    },
    {
      email: 'kitchen2@tavonza.demo',
      name: 'Sam Osei',
      contactNo: '+10000000018',
      role: StaffRole.KITCHEN_STAFF,
      branches: ['downtown'],
      permissions: [PermissionAction.UPDATE_ORDER_STATUS],
    },
    {
      email: 'cashier@tavonza.demo',
      name: 'Dana Whitfield',
      contactNo: '+10000000019',
      role: StaffRole.CASHIER,
      branches: ['downtown'],
      permissions: [PermissionAction.MANAGE_PAYMENTS, PermissionAction.VIEW_ORDERS],
    },
    {
      email: 'host@tavonza.demo',
      name: 'Elias Moreau',
      contactNo: '+10000000020',
      role: StaffRole.HOST,
      branches: ['downtown'],
      permissions: [
        PermissionAction.MANAGE_TABLES,
        PermissionAction.MANAGE_RESERVATIONS,
        PermissionAction.VIEW_ORDERS,
      ],
    },
  ];

  const branchByKey: Record<string, { id: string }> = {
    downtown: { id: downtown.id },
    riverside: { id: riverside.id },
  };

  const staffByEmail: Record<string, { userId: string; staffId: string; name: string }> = {};
  const assignmentByEmailBranch: Record<string, { id: string }> = {};

  for (const spec of STAFF_SPECS) {
    const user = await createUser({
      email: spec.email,
      name: spec.name,
      contactNo: spec.contactNo,
      role: GlobalRole.STAFF,
      password: STAFF_PASSWORD,
    });

    const staff = await prisma.staff.create({ data: { userId: user.id } });
    staffByEmail[spec.email] = { userId: user.id, staffId: staff.id, name: spec.name };

    // One StaffAssignment per branch — this is how a Regional Manager covers
    // several branches (one row each), per the flow doc.
    for (const branchKey of spec.branches) {
      const assignment = await prisma.staffAssignment.create({
        data: {
          staffId: staff.id,
          branchId: branchByKey[branchKey].id,
          role: spec.role,
          permissions: spec.permissions,
          isActive: true,
        },
      });
      assignmentByEmailBranch[`${spec.email}:${branchKey}`] = { id: assignment.id };
    }
  }
  console.log(`✅ staff                ${STAFF_SPECS.length} people, ${Object.keys(assignmentByEmailBranch).length} assignments`);

  // ══════════════════════════════════════════════════════════════════════════
  // 5. MENU (brand-level, shared by both branches)
  // ══════════════════════════════════════════════════════════════════════════
  const menuItemsByName: Record<string, { id: string; price: number; station: StationType }> = {};

  for (const [categoryIndex, category] of MENU.entries()) {
    const createdCategory = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: category.name,
        description: category.description,
        displayOrder: categoryIndex,
        isActive: true,
      },
    });

    for (const [itemIndex, item] of category.items.entries()) {
      const createdItem = await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId: createdCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isAvailable: true,
          isVegetarian: item.isVegetarian ?? false,
          spiceLevel: item.spiceLevel,
          displayOrder: itemIndex,
        },
      });

      menuItemsByName[item.name] = {
        id: createdItem.id,
        price: item.basePrice,
        station: item.station,
      };

      for (const group of item.modifierGroups ?? []) {
        const createdGroup = await prisma.modifierGroup.create({
          data: {
            menuItemId: createdItem.id,
            name: group.name,
            isRequired: group.isRequired,
            minSelect: group.minSelect,
            maxSelect: group.maxSelect,
          },
        });

        for (const modifier of group.modifiers) {
          await prisma.modifier.create({
            data: {
              modifierGroupId: createdGroup.id,
              name: modifier.name,
              priceDelta: modifier.priceDelta,
              isAvailable: true,
            },
          });
        }
      }
    }
  }
  const itemCount = Object.keys(menuItemsByName).length;
  console.log(`✅ menu                 ${MENU.length} categories, ${itemCount} items`);

  // ══════════════════════════════════════════════════════════════════════════
  // 6. TABLES + QR CODES
  //    Every table gets a token up front (never null), and every table starts
  //    AVAILABLE with no open session — this is the clean state the live demo
  //    begins from.
  // ══════════════════════════════════════════════════════════════════════════
  const SHAPES = [Shape.SQUARE, Shape.CIRCLE, Shape.RECTANGLE, Shape.HEXAGON];

  const tablesByLabel: Record<string, { id: string; label: string; token: string }> = {};

  async function createTables(branchId: string, prefix: string, count: number, floor: number) {
    const created: { id: string; label: string; token: string }[] = [];
    for (let index = 1; index <= count; index += 1) {
      const label = `${prefix}-${String(index).padStart(2, '0')}`;
      const token = randomUUID();
      const table = await prisma.table.create({
        data: {
          branchId,
          label,
          capacity: index % 5 === 0 ? 6 : index % 3 === 0 ? 4 : 2,
          serviceStatus: TableServiceStatus.AVAILABLE,
          operationalFlag: TableOperationalFlag.NORMAL,
          qrCodeToken: token,
          shape: SHAPES[index % SHAPES.length],
          floor,
        },
      });
      created.push({ id: table.id, label, token });
      tablesByLabel[label] = { id: table.id, label, token };
    }
    return created;
  }

  const downtownTables = await createTables(downtown.id, 'T', 12, 1);
  const riversideTables = await createTables(riverside.id, 'R', 8, 1);
  console.log(`✅ tables               ${downtownTables.length} downtown, ${riversideTables.length} riverside (all AVAILABLE)`);

  // ══════════════════════════════════════════════════════════════════════════
  // 7. WAITER → TABLE ASSIGNMENTS (time-bound, current shift)
  // ══════════════════════════════════════════════════════════════════════════
  const shiftStart = daysAgo(0, 10);
  const shiftEnd = addHours(shiftStart, 24);

  const tableAssignments: Record<string, { id: string }> = {};

  async function assignTables(
    branchId: string,
    waiterEmail: string,
    assignedByEmail: string,
    tables: { id: string; label: string }[],
  ) {
    const waiter = staffByEmail[waiterEmail];
    const assigner = staffByEmail[assignedByEmail];

    for (const table of tables) {
      const assignment = await prisma.waiterTableAssignment.create({
        data: {
          branchId,
          tableId: table.id,
          waiterId: waiter.staffId,
          assignedById: assigner.staffId,
          sessionStart: shiftStart,
          sessionEnd: shiftEnd,
          isActive: true,
        },
      });
      tableAssignments[table.label] = { id: assignment.id };
    }
  }

  await assignTables(downtown.id, 'waiter@tavonza.demo', 'manager@tavonza.demo', downtownTables.slice(0, 6));
  await assignTables(downtown.id, 'waiter2@tavonza.demo', 'manager@tavonza.demo', downtownTables.slice(6));
  await assignTables(riverside.id, 'waiter3@tavonza.demo', 'manager2@tavonza.demo', riversideTables);
  console.log(`✅ waiter assignments   ${Object.keys(tableAssignments).length} tables covered`);

  // ══════════════════════════════════════════════════════════════════════════
  // 8. WORK SHIFTS (today)
  // ══════════════════════════════════════════════════════════════════════════
  const today = daysAgo(0, 0);
  const shiftSpecs: { email: string; branchKey: string; name: string; startHour: number }[] = [
    { email: 'manager@tavonza.demo', branchKey: 'downtown', name: 'Morning Shift', startHour: 9 },
    { email: 'waiter@tavonza.demo', branchKey: 'downtown', name: 'Morning Shift', startHour: 10 },
    { email: 'kitchen@tavonza.demo', branchKey: 'downtown', name: 'Morning Shift', startHour: 10 },
    { email: 'cashier@tavonza.demo', branchKey: 'downtown', name: 'Morning Shift', startHour: 11 },
    { email: 'regional@tavonza.demo', branchKey: 'downtown', name: 'Oversight', startHour: 11 },
  ];

  for (const spec of shiftSpecs) {
    const assignment = assignmentByEmailBranch[`${spec.email}:${spec.branchKey}`];
    const startTime = daysAgo(0, spec.startHour);
    await prisma.workShift.create({
      data: {
        branchId: branchByKey[spec.branchKey].id,
        staffAssignmentId: assignment.id,
        name: spec.name,
        startTime,
        endTime: addHours(startTime, 8),
        durationMin: 480,
        date: today,
        status: ShiftSlotStatus.ACTIVE,
        checkInAt: startTime,
        createdById: staffByEmail['manager@tavonza.demo'].userId,
      },
    });
  }
  console.log(`✅ work shifts          ${shiftSpecs.length} today`);

  // ══════════════════════════════════════════════════════════════════════════
  // 9. SUPPLIERS + INVENTORY (downtown)
  // ══════════════════════════════════════════════════════════════════════════
  const supplier = await prisma.supplier.create({
    data: {
      branchId: downtown.id,
      name: 'Northern Provisions',
      contactName: 'Hannah Poole',
      email: 'orders@northernprovisions.demo',
      phone: '+441610000900',
      address: {
        line1: 'Unit 4, Trafford Park',
        city: 'Manchester',
        postalCode: 'M17 1AB',
        country: 'GB',
      },
      isActive: true,
    },
  });

  const dryStore = await prisma.inventoryCategory.create({
    data: { branchId: downtown.id, name: 'Dry Store', description: 'Ambient goods.' },
  });
  const chiller = await prisma.inventoryCategory.create({
    data: { branchId: downtown.id, name: 'Chiller', description: 'Refrigerated goods.' },
  });

  const inventorySpecs: {
    name: string;
    sku: string;
    unit: InventoryUnit;
    stock: number;
    threshold: number;
    cost: number;
    categoryId: string;
  }[] = [
    { name: 'Basmati Rice', sku: 'DRY-001', unit: InventoryUnit.KG, stock: 40, threshold: 10, cost: 2.4, categoryId: dryStore.id },
    { name: 'Carnaroli Rice', sku: 'DRY-002', unit: InventoryUnit.KG, stock: 18, threshold: 8, cost: 4.1, categoryId: dryStore.id },
    { name: 'Saffron Threads', sku: 'DRY-003', unit: InventoryUnit.GRAM, stock: 60, threshold: 20, cost: 0.9, categoryId: dryStore.id },
    { name: 'Aged Beef Mince', sku: 'CHL-001', unit: InventoryUnit.KG, stock: 12, threshold: 5, cost: 11.5, categoryId: chiller.id },
    { name: 'Fior di Latte', sku: 'CHL-002', unit: InventoryUnit.KG, stock: 6, threshold: 4, cost: 8.2, categoryId: chiller.id },
    { name: 'Sea Bass Fillet', sku: 'CHL-003', unit: InventoryUnit.KG, stock: 3, threshold: 4, cost: 19.0, categoryId: chiller.id },
  ];

  for (const item of inventorySpecs) {
    await prisma.inventoryItem.create({
      data: {
        branchId: downtown.id,
        supplierId: supplier.id,
        categoryId: item.categoryId,
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        currentStock: item.stock,
        lowStockThreshold: item.threshold,
        costPerUnit: item.cost,
        isActive: true,
      },
    });
  }
  console.log(`✅ inventory             1 supplier, 2 categories, ${inventorySpecs.length} items`);

  // ══════════════════════════════════════════════════════════════════════════
  // 10. DISCOUNTS
  // ══════════════════════════════════════════════════════════════════════════
  const welcomeDiscount = await prisma.discount.create({
    data: {
      code: 'WELCOME10',
      type: DiscountType.PERCENTAGE,
      value: 10,
      isActive: true,
      validFrom: daysAgo(30),
      validUntil: addHours(now, 24 * 90),
    },
  });

  await prisma.discount.create({
    data: {
      code: 'HAPPYHOUR',
      type: DiscountType.FIXED_AMOUNT,
      value: 5,
      isActive: true,
      validFrom: daysAgo(30),
      validUntil: addHours(now, 24 * 90),
    },
  });
  console.log('✅ discounts            WELCOME10, HAPPYHOUR');

  // ══════════════════════════════════════════════════════════════════════════
  // 11. CUSTOMERS
  // ══════════════════════════════════════════════════════════════════════════
  const CUSTOMER_SPECS = [
    { email: 'customer@tavonza.demo', name: 'Chloe Bennett', contactNo: '+10000000030', points: 120 },
    { email: 'customer2@tavonza.demo', name: 'Ravi Patel', contactNo: '+10000000031', points: 45 },
    { email: 'customer3@tavonza.demo', name: 'Sofia Rossi', contactNo: '+10000000032', points: 0 },
    { email: 'customer4@tavonza.demo', name: 'Kwame Mensah', contactNo: '+10000000033', points: 260 },
  ];

  const customersByEmail: Record<string, { id: string; userId: string; name: string }> = {};

  for (const spec of CUSTOMER_SPECS) {
    const user = await createUser({
      email: spec.email,
      name: spec.name,
      contactNo: spec.contactNo,
      role: GlobalRole.CUSTOMER,
      password: STAFF_PASSWORD,
    });
    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        loyaltyPoints: spec.points,
        defaultAddress: {
          line1: '22 Deansgate',
          city: 'Manchester',
          postalCode: 'M3 2BW',
          country: 'GB',
        },
      },
    });
    customersByEmail[spec.email] = { id: customer.id, userId: user.id, name: spec.name };
  }
  console.log(`✅ customers            ${CUSTOMER_SPECS.length}`);

  // ══════════════════════════════════════════════════════════════════════════
  // 12. HISTORICAL VISITS
  //     Every one is fully closed: session COMPLETED, guests CLOSED, orders
  //     COMPLETED and PAID, tables returned to AVAILABLE. The live demo state
  //     stays clean while reports and the audit log have real content.
  // ══════════════════════════════════════════════════════════════════════════

  type LineSpec = { item: string; quantity: number };

  /**
   * Which staff member represents each function, per branch — so a Riverside
   * visit is not attributed to Downtown's team in the audit trail.
   *
   * Riverside is only staffed with a manager and a waiter in this demo; its
   * kitchen/bar/cashier actions intentionally reuse Downtown's people rather
   * than inventing people who were never seeded.
   */
  const branchStaff: Record<
    string,
    { waiter: string; kitchen: string; bartender: string; cashier: string; manager: string }
  > = {
    [downtown.id]: {
      waiter: 'waiter@tavonza.demo',
      kitchen: 'kitchen@tavonza.demo',
      bartender: 'bartender@tavonza.demo',
      cashier: 'cashier@tavonza.demo',
      manager: 'manager@tavonza.demo',
    },
    [riverside.id]: {
      waiter: 'waiter3@tavonza.demo',
      kitchen: 'kitchen@tavonza.demo',
      bartender: 'bartender@tavonza.demo',
      cashier: 'cashier@tavonza.demo',
      manager: 'manager2@tavonza.demo',
    },
  };

  /**
   * Builds one closed visit: table session → guest sessions → orders → items →
   * payment → allocations → status logs. Returns the primary order.
   */
  async function seedVisit(input: {
    branchId: string;
    branchCode: string;
    tableLabel: string;
    daysBack: number;
    hour: number;
    sequence: number;
    /** One entry per guest. */
    guests: { customerEmail: string | null; lines: LineSpec[] }[];
    discountCode?: string;
    paymentMethod: PaymentMethod;
    /** Which guest index pays; -1 = whole table paid by guest 0. */
    paidByGuest: number;
    review?: { customerEmail: string; rating: number; comment: string };
  }) {
    const table = tablesByLabel[input.tableLabel];
    const startedAt = daysAgo(input.daysBack, input.hour);
    const settings = input.branchId === downtown.id ? downtownSettings : riversideSettings;
    const staff = branchStaff[input.branchId];

    const tableSession = await prisma.tableSession.create({
      data: {
        tableId: table.id,
        branchId: input.branchId,
        joinCode: `${input.tableLabel.replace('-', '')}${input.daysBack}`,
        partySize: input.guests.length,
        startedAt,
        status: TableSessionStatus.COMPLETED,
        endedAt: addHours(startedAt, 2),
        closedByStaffId: staffByEmail[staff.waiter].staffId,
      },
    });

    // ── Guest sessions ──
    const guestSessions = [];
    for (const [index, guest] of input.guests.entries()) {
      const customer = guest.customerEmail ? customersByEmail[guest.customerEmail] : null;
      const guestSession = await prisma.guestSession.create({
        data: {
          tableSessionId: tableSession.id,
          customerId: customer?.id,
          displayName: customer?.name ?? `Guest ${index + 1}`,
          contact: input.guests[index].customerEmail,
          seatLabel: index === 0 ? 'Head' : `Seat ${index + 1}`,
          otpVerifiedAt: startedAt,
          isHostGuest: index === 0,
          joinedAt: startedAt,
          leftAt: addHours(startedAt, 2),
          status: GuestSessionStatus.CLOSED,
        },
      });
      guestSessions.push(guestSession);
    }

    // ── Orders, one per guest with lines ──
    const createdOrders = [];

    for (const [index, guest] of input.guests.entries()) {
      if (guest.lines.length === 0) continue;

      const placedAt = addHours(startedAt, index * 0.25);
      const items = guest.lines.map((line) => {
        const menuItem = menuItemsByName[line.item];
        return {
          productId: menuItem.id,
          productNameSnapshot: line.item,
          unitPrice: menuItem.price,
          quantity: line.quantity,
          subtotal: round2(menuItem.price * line.quantity),
          stationType: menuItem.station,
        };
      });

      const subtotal = round2(items.reduce((sum, item) => sum + item.subtotal, 0));
      const discountAmount = input.discountCode
        ? round2(subtotal * (welcomeDiscount.value / 100))
        : 0;
      const taxable = subtotal - discountAmount;
      const serviceCharge = round2(taxable * (settings.serviceChargePct / 100));
      const taxAmount = round2((taxable + serviceCharge) * (settings.taxPercent / 100));
      const totalAmount = round2(taxable + serviceCharge + taxAmount);

      const order = await prisma.order.create({
        data: {
          orderNumber: orderNumber(input.branchCode, placedAt, input.sequence + index),
          branchId: input.branchId,
          tableId: table.id,
          customerId: guestSessions[index].customerId,
          tableSessionId: tableSession.id,
          guestSessionId: guestSessions[index].id,
          channel: OrderChannel.QR_SELF_ORDER,
          status: OrderStatus.COMPLETED,
          subtotal,
          discountAmount,
          taxAmount,
          serviceCharge,
          tipAmount: 0,
          totalAmount,
          paymentStatus: PaymentStatus.PAID,
          amountPaid: totalAmount,
          discountId: input.discountCode ? welcomeDiscount.id : null,
          discountCodeSnapshot: input.discountCode ?? null,
          waiterAssignmentId: tableAssignments[input.tableLabel]?.id ?? null,
          acceptanceMode: settings.orderAcceptanceMode,
          acceptedById: staffByEmail[staff.waiter].userId,
          acceptedAt: addHours(placedAt, 0.1),
          createdAt: placedAt,
        },
      });

      // Items move PENDING → PREPARING → READY → SERVED, each with its log row.
      const stationStaff =
        items[0].stationType === StationType.BAR
          ? staffByEmail[staff.bartender]
          : staffByEmail[staff.kitchen];

      for (const item of items) {
        const preparingAt = addHours(placedAt, 0.15);
        const readyAt = addHours(placedAt, 0.4);
        const servedAt = addHours(placedAt, 0.5);

        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productNameSnapshot: item.productNameSnapshot,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
            stationType: item.stationType,
            status: OrderItemStatus.SERVED,
            preparingAt,
            readyAt,
            servedAt,
            createdAt: placedAt,
          },
        });

        const transitions: [OrderItemStatus, OrderItemStatus, Date][] = [
          [OrderItemStatus.PENDING, OrderItemStatus.PREPARING, preparingAt],
          [OrderItemStatus.PREPARING, OrderItemStatus.READY, readyAt],
          [OrderItemStatus.READY, OrderItemStatus.SERVED, servedAt],
        ];
        for (const [previous, next, at] of transitions) {
          await prisma.orderItemStatusChangeLog.create({
            data: {
              orderItemId: orderItem.id,
              previousStatus: previous,
              newStatus: next,
              changedById:
                next === OrderItemStatus.SERVED
                  ? staffByEmail[staff.waiter].userId
                  : stationStaff.userId,
              createdAt: at,
            },
          });
        }
      }

      // Order status log PENDING → CONFIRMED → PREPARING → READY → SERVED → COMPLETED
      const orderTransitions: [OrderStatus, OrderStatus, Date][] = [
        [OrderStatus.PENDING, OrderStatus.CONFIRMED, addHours(placedAt, 0.1)],
        [OrderStatus.CONFIRMED, OrderStatus.PREPARING, addHours(placedAt, 0.15)],
        [OrderStatus.PREPARING, OrderStatus.READY, addHours(placedAt, 0.4)],
        [OrderStatus.READY, OrderStatus.SERVED, addHours(placedAt, 0.5)],
        [OrderStatus.SERVED, OrderStatus.COMPLETED, addHours(placedAt, 1.5)],
      ];
      for (const [previous, next, at] of orderTransitions) {
        await prisma.orderStatusChangeLog.create({
          data: {
            orderId: order.id,
            previousStatus: previous,
            newStatus: next,
            changedById: staffByEmail[staff.waiter].userId,
            createdAt: at,
          },
        });
      }

      createdOrders.push({ order, totalAmount });
    }

    // ── Payment covering everything, split across the orders ──
    const paidAt = addHours(startedAt, 1.6);
    const grandTotal = round2(createdOrders.reduce((sum, entry) => sum + entry.totalAmount, 0));

    const payment = await prisma.payment.create({
      data: {
        orderId: createdOrders.length === 1 ? createdOrders[0].order.id : null,
        tableSessionId: tableSession.id,
        payerGuestSessionId: guestSessions[input.paidByGuest === -1 ? 0 : input.paidByGuest].id,
        paidForGuestIds: guestSessions.map((guest) => guest.id),
        scope:
          createdOrders.length === 1
            ? PaymentScope.ORDER
            : input.paidByGuest === -1
              ? PaymentScope.TABLE_SESSION
              : PaymentScope.GUEST_SESSION,
        amount: grandTotal,
        tipAmount: 0,
        method: input.paymentMethod,
        status: PaymentStatus.PAID,
        transactionRef: input.paymentMethod === PaymentMethod.CASH ? null : `txn_${randomUUID().slice(0, 12)}`,
        paidAt,
        settledById: staffByEmail[staff.cashier].userId,
        collectedById: staffByEmail[staff.waiter].userId,
        createdAt: paidAt,
      },
    });

    // sum(allocations) must equal payment.amount — split pro-rata by order total.
    for (const entry of createdOrders) {
      await prisma.paymentAllocation.create({
        data: {
          paymentId: payment.id,
          orderId: entry.order.id,
          amount: entry.totalAmount,
        },
      });
    }

    // ── Optional review ──
    if (input.review) {
      const reviewer = customersByEmail[input.review.customerEmail];
      await prisma.orderReview.create({
        data: {
          orderId: createdOrders[0].order.id,
          customerId: reviewer.id,
          rating: input.review.rating,
          comment: input.review.comment,
          isApproved: true,
          createdAt: addHours(startedAt, 20),
        },
      });
    }

    // ── Audit trail for the visit ──
    const auditEntries: { action: string; entityType: string; entityId: string; actorEmail: string; at: Date }[] = [
      { action: 'TABLE_SESSION_OPENED', entityType: 'TableSession', entityId: tableSession.id, actorEmail: staff.waiter, at: startedAt },
      { action: 'ORDER_PLACED', entityType: 'Order', entityId: createdOrders[0].order.id, actorEmail: staff.waiter, at: addHours(startedAt, 0.1) },
      { action: 'PAYMENT_SETTLED', entityType: 'Payment', entityId: payment.id, actorEmail: staff.cashier, at: paidAt },
      { action: 'TABLE_SESSION_CLOSED', entityType: 'TableSession', entityId: tableSession.id, actorEmail: staff.waiter, at: addHours(startedAt, 2) },
    ];
    if (input.discountCode) {
      auditEntries.push({
        action: 'DISCOUNT_APPLIED',
        entityType: 'Order',
        entityId: createdOrders[0].order.id,
        actorEmail: staff.manager,
        at: addHours(startedAt, 0.2),
      });
    }

    for (const entry of auditEntries) {
      await prisma.auditLog.create({
        data: {
          branchId: input.branchId,
          actorId: staffByEmail[entry.actorEmail].userId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          metadata: { tableLabel: input.tableLabel, orderCount: createdOrders.length },
          createdAt: entry.at,
        },
      });
    }

    return createdOrders[0].order;
  }

  // ── A fortnight of trading history ──
  const burgerMeal: LineSpec[] = [
    { item: 'Saffron & Sage Burger', quantity: 1 },
    { item: 'House Lager', quantity: 2 },
  ];
  const curryMeal: LineSpec[] = [
    { item: 'Butter Chicken', quantity: 1 },
    { item: 'Garlic Flatbread', quantity: 1 },
    { item: 'Masala Chai', quantity: 1 },
  ];
  const seafoodMeal: LineSpec[] = [
    { item: 'Crispy Calamari', quantity: 1 },
    { item: 'Grilled Sea Bass', quantity: 1 },
    { item: 'House White Wine', quantity: 2 },
  ];
  const pizzaMeal: LineSpec[] = [
    { item: 'Margherita Pizza', quantity: 2 },
    { item: 'Fresh Mint Lemonade', quantity: 2 },
  ];
  const dessertMeal: LineSpec[] = [
    { item: 'Dark Chocolate Fondant', quantity: 2 },
    { item: 'Old Fashioned', quantity: 2 },
  ];
  const vegetarianMeal: LineSpec[] = [
    { item: 'Truffle Arancini', quantity: 1 },
    { item: 'Wild Mushroom Risotto', quantity: 1 },
    { item: 'Sparkling Water', quantity: 1 },
  ];

  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-01',
    daysBack: 13, hour: 19, sequence: 1,
    guests: [{ customerEmail: 'customer@tavonza.demo', lines: burgerMeal }],
    paymentMethod: PaymentMethod.CARD, paidByGuest: 0,
    review: { customerEmail: 'customer@tavonza.demo', rating: 5, comment: 'Burger was outstanding, service quick.' },
  });

  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-02',
    daysBack: 11, hour: 20, sequence: 1,
    guests: [{ customerEmail: 'customer2@tavonza.demo', lines: curryMeal }],
    discountCode: 'WELCOME10',
    paymentMethod: PaymentMethod.ONLINE_GATEWAY, paidByGuest: 0,
  });

  // A three-guest table where one person pays for everyone.
  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-03',
    daysBack: 9, hour: 19, sequence: 1,
    guests: [
      { customerEmail: 'customer@tavonza.demo', lines: seafoodMeal },
      { customerEmail: 'customer3@tavonza.demo', lines: pizzaMeal },
      { customerEmail: 'customer4@tavonza.demo', lines: dessertMeal },
    ],
    paymentMethod: PaymentMethod.CARD, paidByGuest: -1,
    review: { customerEmail: 'customer4@tavonza.demo', rating: 4, comment: 'Great table, slight wait on the fondant.' },
  });

  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-04',
    daysBack: 7, hour: 13, sequence: 1,
    guests: [{ customerEmail: 'customer3@tavonza.demo', lines: vegetarianMeal }],
    paymentMethod: PaymentMethod.CASH, paidByGuest: 0,
  });

  // Two guests, each settling their own tab.
  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-05',
    daysBack: 5, hour: 21, sequence: 1,
    guests: [
      { customerEmail: 'customer2@tavonza.demo', lines: burgerMeal },
      { customerEmail: null, lines: pizzaMeal },
    ],
    paymentMethod: PaymentMethod.MOBILE_WALLET, paidByGuest: 0,
  });

  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-06',
    daysBack: 3, hour: 19, sequence: 1,
    guests: [{ customerEmail: 'customer@tavonza.demo', lines: seafoodMeal }],
    discountCode: 'WELCOME10',
    paymentMethod: PaymentMethod.ONLINE_GATEWAY, paidByGuest: 0,
  });

  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-07',
    daysBack: 2, hour: 20, sequence: 1,
    guests: [{ customerEmail: 'customer4@tavonza.demo', lines: curryMeal }],
    paymentMethod: PaymentMethod.CARD, paidByGuest: 0,
  });

  await seedVisit({
    branchId: downtown.id, branchCode: 'DT', tableLabel: 'T-08',
    daysBack: 1, hour: 19, sequence: 1,
    guests: [
      { customerEmail: 'customer3@tavonza.demo', lines: vegetarianMeal },
      { customerEmail: 'customer2@tavonza.demo', lines: dessertMeal },
    ],
    paymentMethod: PaymentMethod.CARD, paidByGuest: -1,
  });

  // Riverside uses AUTO_ACCEPT, so its history looks different on purpose.
  await seedVisit({
    branchId: riverside.id, branchCode: 'RS', tableLabel: 'R-01',
    daysBack: 6, hour: 19, sequence: 1,
    guests: [{ customerEmail: 'customer2@tavonza.demo', lines: pizzaMeal }],
    paymentMethod: PaymentMethod.CARD, paidByGuest: 0,
  });

  await seedVisit({
    branchId: riverside.id, branchCode: 'RS', tableLabel: 'R-02',
    daysBack: 2, hour: 20, sequence: 1,
    guests: [{ customerEmail: 'customer@tavonza.demo', lines: burgerMeal }],
    paymentMethod: PaymentMethod.ONLINE_GATEWAY, paidByGuest: 0,
  });

  console.log('✅ history              10 completed visits with payments + allocations');

  // ══════════════════════════════════════════════════════════════════════════
  // 13. A REJECTED ORDER (with the resubmit chain)
  //     Demonstrates the Q4 rejection flow: reason code + note, customer can
  //     modify and resubmit, and the new order links back to the rejected one.
  // ══════════════════════════════════════════════════════════════════════════
  {
    const rejectedAt = daysAgo(4, 20, 15);
    const table = tablesByLabel['T-09'];
    const settings = downtownSettings;

    const session = await prisma.tableSession.create({
      data: {
        tableId: table.id,
        branchId: downtown.id,
        joinCode: 'T094',
        partySize: 2,
        startedAt: daysAgo(4, 20),
        status: TableSessionStatus.COMPLETED,
        endedAt: daysAgo(4, 22),
        closedByStaffId: staffByEmail['waiter2@tavonza.demo'].staffId,
      },
    });

    const guest = await prisma.guestSession.create({
      data: {
        tableSessionId: session.id,
        customerId: customersByEmail['customer4@tavonza.demo'].id,
        displayName: 'Kwame Mensah',
        contact: 'customer4@tavonza.demo',
        otpVerifiedAt: daysAgo(4, 20),
        isHostGuest: true,
        joinedAt: daysAgo(4, 20),
        leftAt: daysAgo(4, 22),
        status: GuestSessionStatus.CLOSED,
      },
    });

    const seaBass = menuItemsByName['Grilled Sea Bass'];
    const rejectedSubtotal = round2(seaBass.price * 2);

    const rejectedOrder = await prisma.order.create({
      data: {
        orderNumber: orderNumber('DT', rejectedAt, 1),
        branchId: downtown.id,
        tableId: table.id,
        customerId: customersByEmail['customer4@tavonza.demo'].id,
        tableSessionId: session.id,
        guestSessionId: guest.id,
        channel: OrderChannel.QR_SELF_ORDER,
        status: OrderStatus.REJECTED,
        subtotal: rejectedSubtotal,
        taxAmount: 0,
        serviceCharge: 0,
        totalAmount: rejectedSubtotal,
        paymentStatus: PaymentStatus.UNPAID,
        amountPaid: 0,
        waiterAssignmentId: tableAssignments['T-09']?.id ?? null,
        acceptanceMode: settings.orderAcceptanceMode,
        rejectedById: staffByEmail['waiter2@tavonza.demo'].userId,
        rejectedAt,
        rejectionReasonCode: OrderRejectionReason.ITEM_UNAVAILABLE,
        rejectionReason: 'We had just sold out of the last sea bass — sorry!',
        createdAt: daysAgo(4, 20, 10),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: rejectedOrder.id,
        productId: seaBass.id,
        productNameSnapshot: 'Grilled Sea Bass',
        unitPrice: seaBass.price,
        quantity: 2,
        subtotal: rejectedSubtotal,
        stationType: StationType.KITCHEN,
        status: OrderItemStatus.CANCELLED,
        unavailableReason: 'Sold out',
        createdAt: daysAgo(4, 20, 10),
      },
    });

    await prisma.orderStatusChangeLog.create({
      data: {
        orderId: rejectedOrder.id,
        previousStatus: OrderStatus.PENDING,
        newStatus: OrderStatus.REJECTED,
        changedById: staffByEmail['waiter2@tavonza.demo'].userId,
        note: 'Item unavailable',
        createdAt: rejectedAt,
      },
    });

    // The customer's resubmission, linked back to the rejected order.
    const resubmittedAt = daysAgo(4, 20, 25);
    const curry = menuItemsByName['Butter Chicken'];
    const flatbread = menuItemsByName['Garlic Flatbread'];
    const resubtotal = round2(curry.price + flatbread.price);
    const reservice = round2(resubtotal * (settings.serviceChargePct / 100));
    const retax = round2((resubtotal + reservice) * (settings.taxPercent / 100));

    const resubmitted = await prisma.order.create({
      data: {
        orderNumber: orderNumber('DT', resubmittedAt, 2),
        branchId: downtown.id,
        tableId: table.id,
        customerId: customersByEmail['customer4@tavonza.demo'].id,
        tableSessionId: session.id,
        guestSessionId: guest.id,
        channel: OrderChannel.QR_SELF_ORDER,
        status: OrderStatus.COMPLETED,
        subtotal: resubtotal,
        serviceCharge: reservice,
        taxAmount: retax,
        totalAmount: round2(resubtotal + reservice + retax),
        paymentStatus: PaymentStatus.PAID,
        amountPaid: round2(resubtotal + reservice + retax),
        waiterAssignmentId: tableAssignments['T-09']?.id ?? null,
        acceptanceMode: settings.orderAcceptanceMode,
        acceptedById: staffByEmail['waiter2@tavonza.demo'].userId,
        acceptedAt: daysAgo(4, 20, 30),
        resubmittedFromId: rejectedOrder.id,
        createdAt: resubmittedAt,
      },
    });

    const resubmitLines = [
      { item: curry, name: 'Butter Chicken', quantity: 1 },
      { item: flatbread, name: 'Garlic Flatbread', quantity: 1 },
    ];

    for (const line of resubmitLines) {
      await prisma.orderItem.create({
        data: {
          orderId: resubmitted.id,
          productId: line.item.id,
          productNameSnapshot: line.name,
          unitPrice: line.item.price,
          quantity: line.quantity,
          subtotal: round2(line.item.price * line.quantity),
          stationType: line.item.station,
          status: OrderItemStatus.SERVED,
          preparingAt: daysAgo(4, 20, 30),
          readyAt: daysAgo(4, 20, 50),
          servedAt: daysAgo(4, 21),
          createdAt: resubmittedAt,
        },
      });
    }

    const resubmittedTotal = round2(resubtotal + reservice + retax);
    const payment = await prisma.payment.create({
      data: {
        orderId: resubmitted.id,
        tableSessionId: session.id,
        payerGuestSessionId: guest.id,
        paidForGuestIds: [guest.id],
        scope: PaymentScope.ORDER,
        amount: resubmittedTotal,
        method: PaymentMethod.CARD,
        status: PaymentStatus.PAID,
        transactionRef: `txn_${randomUUID().slice(0, 12)}`,
        paidAt: daysAgo(4, 21, 15),
        settledById: staffByEmail['cashier@tavonza.demo'].userId,
        collectedById: staffByEmail['waiter2@tavonza.demo'].userId,
        createdAt: daysAgo(4, 21, 15),
      },
    });

    await prisma.paymentAllocation.create({
      data: { paymentId: payment.id, orderId: resubmitted.id, amount: resubmittedTotal },
    });

    await prisma.auditLog.create({
      data: {
        branchId: downtown.id,
        actorId: staffByEmail['waiter2@tavonza.demo'].userId,
        action: 'ORDER_REJECTED',
        entityType: 'Order',
        entityId: rejectedOrder.id,
        metadata: { reason: 'ITEM_UNAVAILABLE', tableLabel: 'T-09' },
        createdAt: rejectedAt,
      },
    });

    console.log('✅ rejection demo       T-09 rejected order + linked resubmission');
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 14. RESERVATIONS
  //     Exactly one has a null tableSessionId — MongoDB unique indexes treat
  //     null as a value, so a second null in the same field can collide.
  // ══════════════════════════════════════════════════════════════════════════
  await prisma.reservation.create({
    data: {
      branchId: downtown.id,
      tableId: tablesByLabel['T-10'].id,
      customerId: customersByEmail['customer@tavonza.demo'].id,
      guestName: 'Chloe Bennett',
      guestPhone: '+10000000030',
      partySize: 4,
      reservedFor: addHours(now, 26),
      durationMins: 120,
      status: ReservationStatus.CONFIRMED,
      specialRequest: 'Window table if possible.',
    },
  });

  // A past reservation that was seated and completed, linked to its session so
  // it does not introduce a second null.
  {
    const pastTable = tablesByLabel['T-11'];
    const pastStart = daysAgo(8, 19);
    const pastSession = await prisma.tableSession.create({
      data: {
        tableId: pastTable.id,
        branchId: downtown.id,
        joinCode: 'T118',
        partySize: 2,
        startedAt: pastStart,
        endedAt: addHours(pastStart, 2),
        status: TableSessionStatus.COMPLETED,
        closedByStaffId: staffByEmail['waiter@tavonza.demo'].staffId,
      },
    });

    await prisma.reservation.create({
      data: {
        branchId: downtown.id,
        tableId: pastTable.id,
        customerId: customersByEmail['customer2@tavonza.demo'].id,
        tableSessionId: pastSession.id,
        guestName: 'Ravi Patel',
        guestPhone: '+10000000031',
        partySize: 2,
        reservedFor: pastStart,
        durationMins: 90,
        status: ReservationStatus.COMPLETED,
      },
    });
  }
  console.log('✅ reservations         1 upcoming, 1 completed');

  // ══════════════════════════════════════════════════════════════════════════
  // 15. A TABLESIDE OTP ROW (so the table-auth surface is not empty)
  // ══════════════════════════════════════════════════════════════════════════
  await prisma.tableAuthOtp.create({
    data: {
      contact: '+10000000032',
      tableId: tablesByLabel['T-01'].id,
      purpose: OtpPurpose.TABLE_AUTH,
      otp: '000000',
      expiresAt: addHours(now, 1),
      verified: false,
    },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  console.log(`
${'═'.repeat(78)}
  DEMO READY
${'═'.repeat(78)}

  Organization   ${organization.name}
  Brand          ${restaurant.name}
  Branches       ${downtown.name}   (WAITER_APPROVAL, 12 tables)
                 ${riverside.name}  (AUTO_ACCEPT, 8 tables)

  Sign in at the admin app:

    Super admin   euhan.dev@gmail.com     ${SUPER_ADMIN_PASSWORD}
    Org owner     owner@tavonza.demo      ${ORG_PASSWORD}
    Regional mgr  regional@tavonza.demo   ${STAFF_PASSWORD}
    Branch mgr    manager@tavonza.demo    ${STAFF_PASSWORD}
    Waiter        waiter@tavonza.demo     ${STAFF_PASSWORD}
    Waiter 2      waiter2@tavonza.demo    ${STAFF_PASSWORD}
    Bartender     bartender@tavonza.demo  ${STAFF_PASSWORD}
    Kitchen       kitchen@tavonza.demo    ${STAFF_PASSWORD}
    Cashier       cashier@tavonza.demo    ${STAFF_PASSWORD}
    Host          host@tavonza.demo       ${STAFF_PASSWORD}
    Customer      customer@tavonza.demo   ${STAFF_PASSWORD}
    Customer 2    customer2@tavonza.demo  ${STAFF_PASSWORD}

  Table QR links (Downtown) — scan or open to start the live flow:
`);

  for (const table of downtownTables.slice(0, 4)) {
    console.log(`    ${table.label}   ${CUSTOMER_APP_URL}/qr-order?token=${table.token}`);
  }

  console.log(`
  Waiter cover:  Priya Sharma ${downtownTables[0].label}–${downtownTables[5].label}   |   Tom Alvarez ${downtownTables[6].label}–${downtownTables[11].label}

  Live flow to demo:
    1. Open a table QR link above → choose a table → phone/email → OTP
    2. Browse menu → add items (try Saffron & Sage Burger → Add-ons) → place order
    3. As waiter@tavonza.demo: accept the order
    4. As kitchen@ / bartender@: move items PENDING → PREPARING → READY
    5. As waiter@: serve, then customer pays (or cashier settles it)
    6. As waiter@: clear the table → back to AVAILABLE

  History already seeded: 10 completed visits, 1 rejected+resubmitted order,
  2 reviews, full audit trail. Branch 1 uses WAITER_APPROVAL, branch 2 AUTO_ACCEPT.
${'═'.repeat(78)}
`);
}

main()
  .catch((error) => {
    console.error('\n❌ Seed failed:\n', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

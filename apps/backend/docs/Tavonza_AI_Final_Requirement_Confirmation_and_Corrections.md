# **TAVONZA AI** 

## **Final Requirement Confirmation & Architecture Corrections** 

Development Reference / Client Feedback 

Hi, 

Thank you for preparing the detailed process flow and the Restaurant Ordering Platform Requirement Confirmation Document. 

I have now reviewed both from a business, operational and product perspective. 

Overall, I believe the foundation is strong and the flow is moving in the right direction. The structure around branches, employees, tables, QR ordering, waiter sessions, kitchen/bar preparation, payments and the table lifecycle provides a good operational foundation for Tavonza. 

However, before I provide final approval, I want to clarify several important points. 

My main concern is that Tavonza should not be architecturally designed only around the requirements of one restaurant today. We are building Tavonza as a scalable AI-powered hospitality operating system that should eventually be capable of supporting different restaurant businesses, multiple brands, multiple branches, different operating models and potentially very large numbers of locations. 

Therefore, some rules that currently appear fixed in the documentation should instead be configurable or flexible at architecture level. 

Please use the following as my formal feedback and answers to the open questions. 

## **1. Core Product Principle** 

The architecture should be designed around the following hierarchy: 

#### **Organization / Business -> Brand -> Branch -> Department / Station -> Employees / Roles / Permissions** 

A single business account should eventually be able to operate multiple brands, and each brand should be able to operate multiple branches. 

Each branch should have its own: 

- Menu 

- Employees 

- Tables 

- Stations 

- Inventory 

- Suppliers 

- Operating hours 

- Reservations 

- Orders 

- Customers / CRM context 

- Payments 

- Reporting 

####  Configuration 

At Owner/Admin level, authorized users should be able to view consolidated information across brands and branches. 

This is important because Tavonza should be built as a scalable SaaS platform rather than being architecturally tied to one restaurant configuration. 

The multi-brand structure proposed in the requirement document is therefore approved and should be part of the underlying architecture. 

## **2. Important Change - Table Sessions and Multiple Customers** 

I want to change one important assumption in the current documentation. 

I do not want the architecture limited to only one active customer session per table. 

#### **One active Table Session - but potentially Multiple Guests / Customer Sessions within that Table Session** 

For example, four people sitting at Table 12 should all be able to scan the same QR code and join the active table session. 

They should potentially be able to: 

- Order individually 

- Order together 

- Add items to the same table 

- Identify their own items 

- Pay individually 

- Split a bill 

- Pay for another guest 

- Pay the entire table 

- Continue ordering until the table session is closed 

Therefore, please separate the concepts of: 

- Table Session 

- Guest / Customer Session 

- Order 

- Payment 

A second customer scanning the QR code should not automatically receive a "table occupied" error. Instead, they should be able to join the existing table session where appropriate. This is important for real restaurant usage. 

## **3. Order Acceptance Should Be Configurable** 

I want customer order acceptance to be configurable rather than permanently requiring Waiter approval. 

- Auto Accept - Customer order immediately enters production. 

- Waiter Approval - Waiter reviews and accepts the order. 

- Manager Approval - For certain exceptional workflows or order types. 

For the Tavonza MVP, Waiter Approval can remain the default workflow if this simplifies development. 

However, please do not architect the platform in a way where waiter approval is permanently mandatory. 

## **4. Separate State Machines** 

I like the proposed table lifecycle: 

#### **AVAILABLE -> OCCUPIED -> ORDERING -> PREPARING -> SERVING -> PAYMENT_PENDING ->** 

#### **CLOSING -> AVAILABLE** 

However, I want us to avoid using the Table Status as the only source of truth for everything happening operationally. 

We should ideally have separate states for: 

- Table Session Status 

- Order Status 

- Order Item Status 

- Payment Status 

- Reservation Status 

For example, one table could simultaneously have Order A = SERVED, Order B = PREPARING and Order C = PAYMENT_PENDING while the overall Table Session remains active. This separation will make the system much more scalable and accurate. 

## **5. JARVIS Must Be Part of the Core Architecture** 

This is one of my most important additions. 

The current document describes the operational transaction system very well, but Tavonza is ultimately an AI-powered hospitality operating system. 

JARVIS should therefore not be treated simply as a chatbot added to the interface later. 

#### **JARVIS Intelligence / Orchestration Layer** 

JARVIS should eventually be capable of consuming operational events across Tavonza, including: 

- Customer behaviour 

- Reservations 

- Orders 

- Order items 

- Preparation times 

- Kitchen performance 

- Table activity 

- Waiter activity 

- Inventory 

- Staff 

- Payments 

- Reviews 

- Customer history 

- Sales 

- Branch performance 

and then generate role-specific intelligence. 

**Customer JARVIS:** What does this customer want? 

**Waiter JARVIS:** What should this waiter do next? 

**Kitchen JARVIS:** What should the kitchen prepare or prioritize next? 

**Cashier JARVIS:** What should be processed or potentially suggested? 

**Manager JARVIS:** What requires management attention? 

**Owner JARVIS:** What is happening across the business and what should change? 

These should ideally use the same underlying intelligence/orchestration architecture, while exposing different information and actions depending on permissions. 

## **6. Real-Time Event Architecture** 

The platform should be designed so that operational changes propagate between roles in real time. 

**Customer places order** 

**Waiter receives order** 

**Order accepted / automatically accepted** 

**Kitchen/Bartender receives relevant items** 

#### **Preparation begins** 

**JARVIS monitors operational status** 

**Kitchen marks item ready** 

**Waiter receives notification** 

**Item is served** 

**Customer requests bill** 

**Cashier / online payment processes payment** 

#### **Table session closes** 

#### **Inventory / reporting / customer history / analytics update** 

I want us to be able to demonstrate this entire journey live in the MVP. This is one of the most important Tavonza demo flows. 

## **Answers to the 24 Confirmation Questions** 

### **Q1 - Accept Order** 

YES - Waiter default, Manager/Admin backup, Auto Accept configurable. Admin and Branch Manager should be able to accept an order as backup. The normal operational user should be the Waiter. 

### **Q2 - Manage Menu** 

Admin and authorized Managers should have full menu-management capabilities. Kitchen and Bartender should primarily control operational availability such as Available, Unavailable, 86'd and stock-related 

availability. They should not automatically have permission to change commercial pricing unless explicitly authorized. 

### **Q3 - Manager-to-Branch Relationship** 

Multiple managers per branch should be supported. Please do not restrict a branch permanently to exactly one Manager. Support General Manager, Assistant Manager, Shift Manager and higher-level managers who may manage multiple branches. 

### **Q4 - Order Rejection** 

When an order is rejected, the customer should receive a reason. Use predefined reasons with optional notes, such as item unavailable, kitchen capacity, modification impossible, allergy concern, restaurant closing or other. The customer should be able to modify and resubmit. 

### **Q5 - Session Boundaries** 

Support both recurring schedules and ad-hoc / one-off assignments. Restaurants operate differently, so we should not permanently force one scheduling model. 

### **Q6 - Payment Gateway** 

Do not permanently couple Tavonza to one payment provider. Build a payment abstraction / integration layer so different providers can eventually be connected. The initial MVP provider can be decided separately. 

### **Q7 - Cashier Order View** 

The Cashier should see order number, table, items, subtotal, taxes, discounts, tips, total, amount already paid, outstanding amount, payment method and payment status. Customer personal information should only be displayed when operationally required and permitted. 

### **Q8 - Refund Settlement** 

Where technically supported, online refunds should return through the original payment provider. Every refund should create an audit trail containing original transaction, refund amount, reason, employee, permission level, date/time and approval if required. 

### **Q9 - Ingredient-Based Availability** 

Default behaviour should preferably show the product but mark it unavailable/disabled. Restaurants should eventually be able to configure whether unavailable items are hidden or shown as unavailable. 

### **Q10 - Multi-Branch Reporting** 

YES. Admin/Owner needs consolidated reporting across branches, combined with branch-level drill-down. Eventually JARVIS should also provide cross-branch intelligence. 

### **Q11 - Business Structure** 

YES. Support Business / Organization -> Multiple Brands -> Multiple Branches from the underlying architecture. This is extremely important. 

### **Q12 - Platform Support Account** 

YES, but with strict security. Support access should be permission-based, auditable, logged, restricted and ideally time-limited where appropriate. It should never automatically have unrestricted access to sensitive restaurant or customer information. 

### **Q13 - Host Role** 

YES. Add a dedicated Host role for reservations, walk-ins, waiting list, seating, table assignment, guest arrival and no-shows. Keep this separate from Waiter and Manager. 

### **Q14 - Staff Working Across Branches** 

Allow multi-branch assignments based on permissions. An employee can have a primary/home branch, while authorized employees may work across additional branches. This is important for Operations Managers, Area Managers, Senior Managers, temporary coverage and shared staff. 

### **Q15 - Extra Permissions** 

YES. Use granular permission control and do not limit the system to only one additional permission per employee. Examples include discounts, low-value refunds, table reassignment, selected reports and order overrides. 

### **Q16 - Bartender Login** 

YES - separate Bartender role/login. Kitchen and Bar can use the same underlying station/order-routing architecture, but their operational interfaces and permissions should remain separate. 

### **Q17 - Advance Table Reservations** 

YES. Support date, time, party size, name, phone/email and preferences/notes. Guest reservation should be possible without requiring a full Tavonza account, with later profile linking. 

### **Q18 - Menu Customization** 

YES - absolutely required. Support sizes, add-ons, extras, removal options, cooking preference, spice level, required/optional modifiers, min/max selections and price-changing modifiers. Selected modifiers and prices should be included in the historical order snapshot. 

### **Q19 - Takeaway & Delivery** 

Reserve architecture for Dine-in QR, Waiter POS, Self-service kiosk, Takeaway, Delivery, Mobile app and Web ordering. Not all need to be fully developed in the first MVP. Delivery can be Phase 2. The Order model should not assume every order belongs to a physical table. 

### **Q20 - Discount Codes** 

YES. Support customer-entered promotional codes and staff-applied discounts with permissions. Eventually support percentage, fixed amount, products/categories, minimum spend, date range, usage limits, customer-specific offers and branch-specific promotions. 

### **Q21 - Customer Reviews** 

YES. Customers should be able to leave ratings and comments after a completed experience. Legitimate negative reviews should not be hidden merely because a Manager does not approve them. Moderation should focus on spam, abuse, fraud and inappropriate content. 

### **Q22 - Staff Work Schedule & Attendance** 

YES. Support staff scheduling and clock-in/clock-out separately from Waiter-to-Table assignments. Eventually support scheduled shift, actual clock-in/out, breaks, late arrival, overtime, attendance, shift changes, role and branch. 

### **Q23 - Suppliers & Inventory** 

YES, with a deeper architecture: Supplier -> Ingredient -> Inventory -> Recipe/BOM -> Menu Item -> Order -> Stock Consumption. Full automation can come later, but the data model should support this relationship now. 

### **Q24 - Branch Operating Hours & Holidays** 

YES. Each branch should independently configure weekly opening hours, multiple service periods per day, holiday closures, special opening hours and temporary closures. This should eventually affect reservations, ordering and customer-facing availability automatically. 

## **Additional Requirement - Inventory & Menu Connection** 

Please make sure inventory and menu architecture can eventually support real recipe-level inventory. 

A menu item should be able to contain multiple ingredients, and an ingredient should be capable of appearing in multiple menu items. This many-to-many relationship is important. 

Example: 

- Wagyu Burger -> Beef 180g 

- Bun 1 

- Cheese 2 slices 

- Sauce 30ml 

- Lettuce 20g 

Selling the item should eventually reduce theoretical stock accordingly. Actual inventory counts can then be compared against theoretical inventory. 

This is where JARVIS can later identify: 

- Waste 

- Variance 

- Possible theft 

- Over-portioning 

- Stock shortages 

- Reorder requirements 

## **Additional Requirement - Audit Log** 

Important operational actions should create an immutable audit trail. 

- Order cancellation 

- Refund 

- Discount 

- Price override 

- Table reassignment 

- Stock correction 

- Permission change 

- Employee creation/deletion 

- Manual order modification 

- Manager override 

#### **Who did what, when, where, and why.** 

This becomes increasingly important as Tavonza serves larger restaurant businesses. 

## **Additional Requirement - Customer / Dining Memory** 

Customer identity should not only exist for authentication. Where legally permitted and subject to appropriate privacy controls, Tavonza should be capable of building a customer profile over time. 

- Previous visits 

- Favourite restaurants 

- Favourite dishes 

- Allergies 

- Dietary preferences 

- Seating preferences 

- Average spend 

- Typical drinks 

- Order history 

- Reservation history 

- Loyalty 

- Reviews 

- Preferences 

This will eventually power JARVIS Dining Memory. 

## **Additional Requirement - API & Integration Layer** 

Please avoid building Tavonza as a completely closed system. The architecture should allow external integrations through APIs/webhooks where appropriate. 

- Payment providers 

- POS systems 

- Accounting 

- Payroll 

- Delivery platforms 

- Reservation systems 

- Suppliers 

- Loyalty systems 

- Hotel systems 

- Hardware 

- Kitchen displays 

We don't need to build all integrations now. I simply want the architecture to remain integration-friendly. 

## **MVP Priority** 

I want to make an important distinction between Architecture Support and MVP Functionality. 

I do not want us to delay the MVP by trying to fully build every future feature immediately. 

The first major objective remains getting one restaurant ecosystem working extremely well. 

#### **Customer -> QR / App -> Authentication / Table Session -> Menu -> Order -> Waiter / Auto Acceptance -> Kitchen / Bar -> Preparation -> Ready -> Waiter -> Served -> Additional Orders -> Bill -> Online / Offline Payment -> Table Close -> Analytics** 

with JARVIS observing and assisting throughout the journey. 

Once this core works reliably in real time, we can progressively activate more advanced modules. 

## **Final Architectural Principle** 

The most important principle I want us to maintain is: 

#### **Tavonza should not be a collection of disconnected restaurant applications.** 

Customer App, Waiter, Kitchen/KDS, Bartender, Cashier, Host, Manager and Owner should all operate on the same underlying operational reality. 

An order created by a customer should immediately become relevant to the waiter, kitchen, inventory, payment system, analytics and JARVIS. 

Likewise, if Kitchen marks something unavailable, that information should eventually propagate to Waiter, Customer, Manager, Inventory and JARVIS where relevant. 

The system should therefore increasingly become: 

#### **One hospitality operating system.** 

**One operational data layer.** 

#### **One intelligence layer.** 

#### **Different interfaces based on role and permission.** 

And the product philosophy remains: 

#### **Complex intelligence in the background. Extreme simplicity for the user.** 

The objective is not to give restaurant teams more software to manage. 

#### **Tavonza should use software and AI to help manage the restaurant for them.** 

With the corrections and confirmations above incorporated into the specification and architecture, I am comfortable proceeding with the next phase of development. 

Please update the requirement document/architecture accordingly and highlight any points where these changes materially affect the current scope, timeline or development cost before implementation. 

Thank you, and great progress so far. 

Best regards, 

**Errol Carkic** 

Founder & CEO 

Tavonza AI 


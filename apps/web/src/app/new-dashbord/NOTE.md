# New Dashboard Workspace Architecture

> **User Instruction & Architectural Rule:**
> 1. `new-dashbord` is the root development incubator for dashboards.
> 2. Inside `new-dashbord`, every role has its own dedicated, self-contained module following the dashboard pattern:
>    - `src/app/new-dashbord/waiter/`: All waiter-related pages, views, modals, and components live here.
>    - `src/app/new-dashbord/kitchen/`: When kitchen-related requests are provided, all kitchen-related files and components will live in this `kitchen/` module!
>    - Other roles (bar, cashier, manager) will follow this exact pattern.
> 3. Each role module must be self-contained so it can be added to any route seamlessly.

---

## Standard Dashboard Architecture in this Project

When building a new dashboard for Tavonza AI Hospitality, ensure adherence to the established patterns:

1. **Server Component Entry (`page.tsx`):**
   - Read `searchParams` (`tab`) on the server.
   - Pass `initialTab` / `initialNav` to prevent sidebar flickering on refresh.
   - Set `export const dynamic = 'force-dynamic'`.

2. **Dashboard Component Layout (`...Dashboard.tsx`):**
   - Fixed/Sticky Left Sidebar (`Sidebar.tsx`) with consistent navigation items and icons.
   - Sticky Top Header (`Header.tsx`, height: `h-20` / `5rem`, `z-40`).
   - Main Content Container (`<main>` with custom scrollbar, padding, and tab routing).
   - Sync active tab with URL query parameter (`?tab=...`) and browser `popstate` history.

3. **Scoped Modals & Backdrops:**
   - Any modal backdrop must be scoped so the sidebar and navbar remain crisp, unblurred, and completely visible.
   - Modals must support:
     - Backdrop click-to-close (`onClick={onClose}`)
     - Stop propagation on dialog container (`onClick={(e) => e.stopPropagation()}`)
     - `Escape` key to close

4. **Design Aesthetics:**
   - Dark mode background (`bg-black` and `bg-neutral-900`/`bg-zinc-900`)
   - Borders: `border-white/10` or `border-zinc-800`
   - Typography: `Inter`, `Plus Jakarta Sans`, and `DM Mono` for tickets/numbers
   - Curated accents: Amber (`#f59e0b`), Emerald (`#10b981`), Violet (`#8b5cf6`), Blue (`#3b82f6`)

---

## Implemented Waiter Station Dashboard (`/new-dashbord`)

Built according to Figma code and touch modal specifications:

- **Route**: `/new-dashbord` (via `src/app/new-dashbord/page.tsx`)
- **Main Component**: `NewDashboard.tsx`
- **Header**: `Header.tsx` (Downtown branch switcher, search input, Voice button, notification alert with badge 4, Michael Davis waiter badge, station live pulse)
- **Sidebar**: `Sidebar.tsx` (Floor View, Orders [04], Alerts [14], JARVIS [14], Profile, Settings, Logout)
- **AI Operations Hero**: Operational summary, shift status, Ask Tavonza AI, View AI Report, Current Shift card with Table 12 priority dispatch
- **Live Feed**: Auto-refreshing station pulse bar with last update sync
- **KPI Metric Filter Cards**: All Table (08), Ready (02), Attention (01), Bill (01), Seated (01) with interactive table filtering
- **Table Grid**: Real-time table cards with badges, timers, waiter label, and action buttons:
  - Table 1: Ready to Serve -> opens `ServeOrderModal.tsx` matching the uploaded touch screen screenshot
  - Table 2: Need Attention -> opens `AttentionModal.tsx` (Sea Bass allergy inquiry)
  - Table 3 & 7: Kitchen Preparing -> opens `TableDetailsModal.tsx`
  - Table 4: Bill Requested -> opens `ProcessPaymentModal.tsx` (Split check settlement)
- **Scoped Modals**: Fully isolated backdrops via `.new-dashbord-main` and `.new-dashbord-modal-backdrop` in `src/app/globals.css`. Top nav and left sidebar remain 100% visible and interactive.
- **Ad-Hoc Customer Requests & AI Voice Parser (`AdHocRequestsView.tsx`)**:
  - Accessible via Sidebar (`Alerts` tab) or top tab switcher.
  - **Table Target Selector**: Interactive `Table-1` to `Table-8` selector.
  - **Speed Presets**: 8 quick-tap presets (Water Refill, Extra Napkins, Extra Condiments, Table Spill Cleanup, Severe Allergy, Call Manager, Cutlery Replacement, Expedite Course). Clicking any preset instantly dispatches a ticket to the active queue.
  - **Tavonza AI Natural Language Parser**: Text input and "Simulate Waiter Speech" action with "Parse & Dispatch" routing to KDS / BDS / Manager.
  - **Active Request Queue**: Live queue with pending counters, table labels, departments, timestamps, and "Mark Handled / Completed" action.
- **Taking Order / Point of Sale View (`TakingOrderView.tsx`)**:
  - Accessible via Sidebar (`Orders` tab), top switcher, or "Take Order" button on seated table cards.
  - **Table Order Banner**: Displays target table (e.g., Table 2), guest count (`4 Guests`), assigned waiter, and Cancel button.
  - **Tavonza AI Menu & Pairing Parser**: Natural language assistant for gluten-free inquiries, wine pairings, and dietary recommendations.
  - **Category Filters**: Starters, Mains, Desserts, Cocktails & Wine, Non-Alcoholic, Chef Specials.
  - **Search Bar**: Real-time filtering by dish name or dietary tags.
  - **Interactive Dish Cards**: Full pricing, descriptions, dietary badges (Vegetarian, Gluten-Free), and responsive `Add` / `[-] [qty] [+]` steppers.
  - **Order Ticket Panel**: Real-time line item breakdown, special allergy notes input, subtotal & tax calculation, and `"Fire Order To Kitchen / Bar"` dispatch action.

---

## Standalone Waiter Module (`src/app/new-dashbord/waiter/`)

All waiter-related files are organized into a completely self-contained module in `src/app/new-dashbord/waiter/`:

- **Direct Route**: `http://localhost:3000/new-dashbord/waiter` (via `src/app/new-dashbord/waiter/page.tsx`)
- **Parent Route**: `http://localhost:3000/new-dashbord` (imports directly from `./waiter`)
- **Main Component**: `WaiterDashboard.tsx`
- **Barrel Export**: `index.ts` (exports `default`, all components, types, and mock data)
- **Sub-components**: `src/app/new-dashbord/waiter/components/`
  - `Header.tsx`
  - `Sidebar.tsx`
  - `ServeOrderModal.tsx`
  - `AttentionModal.tsx`
  - `ProcessPaymentModal.tsx`
  - `TableDetailsModal.tsx`
  - `TavonzaAIModal.tsx`
  - `AdHocRequestsView.tsx`
  - `TakingOrderView.tsx`
- **Data & Types**: `types.ts` & `data.ts`

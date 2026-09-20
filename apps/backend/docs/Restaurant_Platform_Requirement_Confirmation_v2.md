**RESTAURANT ORDERING & TABLE MANAGEMENT PLATFORM**

**Functional Requirement & Process Flow — Client Confirmation Draft**

*Prepared for internal review and client sign-off. Please read Section 13 (“Items Requiring Client Confirmation”) carefully — development will proceed on the assumptions stated here unless corrected.*

# **1\. Overview**

This document consolidates the requirements shared for the restaurant ordering and table-management platform into a structured specification. It covers the seven user roles, branch/employee hierarchy, table and QR code handling, the customer ordering journey, the full order lifecycle, table status states, price-snapshot handling, and the cancellation/refund policy.

The purpose of this document is to confirm, in writing, that our understanding of the requirement matches the client's intent before development begins or continues.

# **2\. User Roles**

The platform supports seven distinct roles, each scoped to a specific level of the restaurant hierarchy:

* Admin / Owner — platform-wide control across all branches.

* Branch Manager — controls a single assigned branch (one manager per branch).

* Cashier — handles offline/in-person payment settlement at a branch.

* Waiter — serves an assigned set of tables during a defined session.

* Kitchen / Chef — prepares food items and updates preparation status.

* Bartender — prepares beverage items and updates preparation status.

* Customer — authenticates per table/session, orders, and pays.

# **3\. Roles & Permissions Matrix**

The matrix below reflects the access levels described in the requirement. Cells marked “❓ TBC” were left open in the original requirement and are listed again in Section 25 for explicit confirmation.

| Feature | Admin | Manager | Cashier | Waiter | Kitchen | Bartender |
| ----- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Create Branch** | ✅ Yes | — No | — No | — No | — No | — No |
| **Create Manager** | ✅ Yes | — No | — No | — No | — No | — No |
| **Create Employee** | ✅ Yes | ✅ Yes | — No | — No | — No | — No |
| **Create Table / QR** | ✅ Yes | ✅ Yes | — No | — No | — No | — No |
| **Assign Waiter to Table (Session)** | ✅ Yes | ✅ Yes | — No | — No | — No | — No |
| **View Orders** | ✅ Yes | ✅ Yes | Limited | Assigned | Station | Station |
| **Accept Order** | **❓ TBC** | **❓ TBC** | — No | ✅ Yes | — No | — No |
| **Process Payment** | ✅ Yes | ✅ Yes | ✅ Yes | — No | — No | — No |
| **Manage Menu** | **❓ TBC** | ✅ Yes | — No | — No | ✅ Yes | ✅ Yes |

*Legend: Limited \= restricted view for Cashier (e.g. payment-relevant order data only). Assigned \= Waiter sees only orders for tables assigned to them in the active session. Station \= Kitchen/Bartender see only items relevant to their station (food vs. beverage).*

# **4\. Branch & Manager Hierarchy**

1. Admin creates one or more restaurant branches.

2. Admin creates Branch Manager accounts (no limit on the number of managers created).

3. Admin assigns exactly one Branch Manager to each branch.

4. A branch cannot operate without an assigned manager; a manager is not simultaneously assigned to more than one branch (as per current requirement — see Q1 in Section 25).

# **5\. Table & QR Code Management**

5. Branch Manager creates tables within their branch.

6. Each table is issued a unique QR code; the manager can regenerate a table's QR code (e.g. if compromised or misprinted).

7. The QR code encodes only the table number and branch ID — it is not used for authentication.

8. Scanning the QR code redirects the customer's device to the ordering website, pre-loaded with the branch and table context.

# **6\. Employee Management**

9. Branch Manager creates employee accounts for their branch: Cashier, Bartender, Kitchen/Chef, and Waiter.

10. An employee is strictly scoped to the branch that created them and cannot access or operate on other branches' data (e.g. a Branch A waiter cannot view or serve Branch B tables/orders).

# **7\. Waiter-to-Table Session Assignment**

Waiters are assigned to tables via time-bound sessions rather than a fixed, permanent mapping:

* Example: Waiter A serves Tables 1, 2, 3 from 10:00 PM to 10:00 AM.

* Example: Waiter B serves Tables 4, 5, 6 from 10:00 AM to 10:00 PM.

* A single table cannot be assigned to two waiters for overlapping session windows — the system must validate against session-time conflicts when a manager creates or edits an assignment.

# **8\. Customer Authentication Flow**

Authentication is deliberately decoupled from the QR code itself:

11. Customer scans the table QR code → lands on the ordering site with branch ID \+ table number pre-filled (not yet authenticated).

12. Customer enters email or phone number.

13. System sends an OTP for verification.

14. Customer enters the OTP; upon success, an authenticated session is created that binds together: customer identity \+ table \+ session \+ (subsequent) order.

15. This binding is what prevents a customer seated at Table 2 from using a QR scan/link for Table 10 — every action is validated against the session's bound table, not just the QR payload.

16. Only one active customer session is allowed per table at a time — concurrent customers on the same table in the same session window are not permitted.

# **9\. Table Booking & Occupancy Lock**

17. When a customer successfully authenticates against a table, that table is locked to that customer's session and its status moves to OCCUPIED.

18. If a second customer (“Customer B”) attempts to authenticate against the same table while it is still OCCUPIED, the system blocks the attempt and shows a “table currently occupied” message.

19. The table only becomes available again once its status is reset to AVAILABLE (see Section 11), i.e. after the waiter clears it at the end of service.

# **10\. End-to-End Order Lifecycle**

20. Customer browses the menu; items are filtered based on current ingredient availability.

21. Customer adds items to cart and places the order.

22. Order appears to the assigned Waiter for the table's active session; Waiter Accepts or Rejects it.

23. If accepted: (a) the customer may complete payment instantly online, and (b) the order is simultaneously routed to the Kitchen and/or Bartender based on item type.

24. Kitchen/Bartender view incoming items, prepare them, and mark each item “Ready to Serve” individually.

25. Waiter is notified when item(s) are ready, collects them from the kitchen/bar, and serves the customer.

26. If payment was not already completed online, the customer can pay once service is finished.

27. For offline payment, the Waiter collects cash/card from the customer, delivers it to the Cashier, and the Cashier settles the order against its order number.

28. Waiter marks the table “Clear” only once (a) all orders are fully paid, by any method, and (b) there are no pending kitchen/bar items.

29. Additional orders placed by the same customer after the initial order are tracked as supplementary orders under the same table session; the table cannot be cleared until every additional order is also completed and paid.

# **11\. Table Status Lifecycle**

Each table progresses through a defined status machine rather than a simple free/occupied flag:

| Status | Meaning / Trigger |
| ----- | ----- |
| **AVAILABLE** | No active session. Table is free and its QR code can be scanned to start a new session. |
| **OCCUPIED** | Customer has been authenticated (OTP verified) and a session is bound to the table. No order placed yet. |
| **ORDERING** | Customer is actively building a cart / has an order awaiting waiter acceptance. |
| **PREPARING** | Waiter has accepted the order and it has moved to the kitchen / bar for preparation. |
| **SERVING** | One or more items are marked “ready to serve” or have been served; order still open for additional items. |
| **PAYMENT\_PENDING** | All ordered items are served but payment (online or offline) has not yet been settled. |
| **CLOSING** | Payment settled, no pending kitchen items, waiter has requested table clear; awaiting reset to AVAILABLE. |

# **12\. Order Price Snapshot (Historical Price Integrity)**

To ensure past orders are never affected by later menu/price changes, each order line item stores a snapshot of product data at the time of ordering, rather than a live reference:

| Field | Type | Purpose |
| ----- | ----- | ----- |
| **productId** | Reference | Links back to the current menu item (for reporting / relations only). |
| **productNameSnapshot** | String | Name of the item at the time of order — preserved even if the product is later renamed. |
| **unitPrice** | Decimal | Price per unit at the time of order — preserved even if the menu price later changes. |
| **quantity** | Integer | Number of units ordered. |
| **subtotal** | Decimal | unitPrice × quantity, stored explicitly rather than recalculated. |

# **13\. Cancellation & Refund Policy**

Cancellation authority is staged by role and by how far the order has progressed:

| Role | Cancellation / Refund Scope |
| ----- | ----- |
| **Customer** | Can cancel an order only before the waiter has accepted it. |
| **Waiter** | Can cancel an order only before kitchen/bar preparation has started. |
| **Kitchen / Bartender** | Can mark a specific item as unavailable (item-level cancellation) once preparation has started. |
| **Manager** | Can override a cancellation at branch level (e.g. cancel after preparation has started, for exceptional cases). |
| **Admin** | Has full override authority across all branches, at any order stage, including post-payment refunds. |

| ADDITIONAL CAPABILITIES — IDENTIFIED SINCE THE ORIGINAL DRAFT *Everything above this line reflects the original requirement, unchanged. Everything below is new — surfaced while turning that requirement into a detailed technical design, for your review.* |
| :---: |

# **14\. Additional Capabilities Identified — At a Glance**

While working through the technical design in detail, a number of additional capabilities came up that are worth considering, along with a few areas that need your decision before development continues on them. The table below is a quick summary; full detail and the specific question for each is in the sections that follow.

| Feature Area | What It Means | See |
| ----- | ----- | :---: |
| **Business Structure** | Whether one owner can run more than one separate restaurant brand, each with its own branches. | *§15, Q11–Q12* |
| **Roles & Permissions** | A new “Host” role, permissions grantable to one person at a time, and whether staff can ever work more than one branch. | *§16, Q13–Q16* |
| **Table Reservations** | Customers can book a table in advance, not only walk in and scan. | *§17, Q17* |
| **Menu Customization** | Customers choose sizes, spice level, or add-ons that change the price. | *§18, Q18* |
| **Takeaway & Delivery** | Order types beyond sit-down dine-in. | *§19, Q19* |
| **Discount Codes** | Promo codes worth a percentage or fixed amount off an order. | *§20, Q20* |
| **Customer Reviews** | Star rating and comment after an order is completed. | *§21, Q21* |
| **Staff Scheduling** | Full work shifts and clock-in/clock-out attendance, beyond table assignment. | *§22, Q22* |
| **Suppliers & Inventory** | A supplier directory and stock tracking for back-office use. | *§23, Q23* |
| **Operating Hours & Holidays** | Multiple time slots per day and holiday overrides for each branch. | *§24, Q24* |

# **15\. Business Structure: Single Restaurant vs. Multi-Restaurant**

The technical design now supports a structure where a single business owner could, in future, operate more than one separate restaurant brand — each with its own name, branches, menu, and staff — all under one account. This sits on top of the original design, where one Admin manages branches of a single restaurant.

Separately, the design also allows for a special account used only by our own development/support team — for setting up new client accounts and providing technical assistance. This account would not place orders or represent your restaurant, and would not access your sales figures beyond what's needed to provide support, unless otherwise agreed.

# **16\. Additional Roles & Flexible Permissions**

### **A new “Host” role**

A Host role has been added to the design, for greeting and seating walk-in guests and coordinating table reservations (see Section 17\) — separate from Waiter and Branch Manager.

### **Bar staff login**

Kitchen and bar staff are currently grouped under one “Kitchen Staff” role in the design, with orders routed to the right station (kitchen or bar) automatically. Bartenders would not have a separate role or a separate login unless you'd like one added.

### **Extra permissions for one person at a time**

Beyond the fixed role permissions already agreed (Section 3), a Branch Manager could optionally grant one additional permission to a specific staff member — for example, letting one trusted Waiter apply discounts — without changing that person's overall role.

### **Staff working across branches**

| ⚠ This would change a rule already agreed in Section 6\. Section 6 states an employee is strictly scoped to the branch that created them. The technical design, as currently structured, does not prevent a staff member from being assigned to more than one branch. Please confirm explicitly whether this should remain an absolute rule for everyone, or whether an exception should exist for certain roles (see Q14). |
| :---- |

# **17\. Advance Table Reservations**

Customers could be able to book a table ahead of time — choosing a date, time, and party size — in addition to the walk-in-and-scan-QR flow already agreed. A reservation could optionally be linked to a specific table, or left for a Host to assign on arrival. Its status would move from Requested through Confirmed and Seated to Completed, or to Cancelled / No-Show if the guest doesn't arrive.

This would exist alongside the walk-in flow, not replace it — most customers may still be walk-ins scanning a table's QR code.

# **18\. Menu Customization — Sizes, Add-Ons & Options**

Menu items could support customer-chosen options — such as size or spice level (sometimes required, sometimes optional, sometimes capped at a maximum number of choices) — and add-ons, such as extra toppings, each of which can change the item's price. The customer's exact choices and the final price would be locked in and saved with the order, the same way item prices are already locked in today (Section 12), so a later menu change never affects a past order.

# **19\. Order Types — Takeaway & Delivery**

Beyond scanning a QR code at the table, the platform could support two further ways to order: Takeaway (the customer orders ahead and collects it, with no table involved) and Delivery (the order is sent to an address). As things stand, the technical design only reserves room for these order types — no delivery-specific functionality, such as assigning a rider, has been built out. If wanted, each of these needs considerably more definition of its own — for example, who confirms a takeaway order when there's no assigned waiter.

# **20\. Discount Codes**

The design supports promotional codes worth either a percentage or a fixed amount off an order, optionally limited to a specific date range and a maximum number of uses.

# **21\. Customer Reviews**

After an order is completed, a customer could leave a star rating (1 to 5\) and an optional comment. Reviews can optionally require a Manager's approval before becoming visible to others, to filter out spam or inappropriate comments.

# **22\. Staff Work Schedule & Attendance**

This is broader than — and separate from — the Waiter-to-Table Session Assignment already agreed in Section 7, which decides which tables a waiter is responsible for during a time window. This new capability covers each employee's actual work schedule for every role (for example, “Morning Shift, 6:00 AM– 2:00 PM, Tuesday”), plus a record of when they actually clocked in and out — useful for payroll and attendance, independent of table coverage.

# **23\. Suppliers & Inventory Tracking**

The design can include a directory of the suppliers each branch buys from, and a stock list showing what's on hand, a low-stock warning level, and cost per unit.

As currently scoped, this stock list is for back-office record-keeping only — it is not yet connected to the menu, so it would not automatically hide a dish when a specific ingredient runs out. If you'd like the “hide unavailable dishes automatically” behaviour from the original requirement (Section 10, step 1\) to run off real stock counts, we would connect this inventory list to specific menu items as a follow-on piece of work — flagging the decision here so it's visible early.

# **24\. Branch Operating Hours & Holidays**

Each branch could set its own regular weekly opening hours, with more than one time window per day where useful — for example, open for lunch 11:00 AM–3:00 PM, closed mid-afternoon, then open again for dinner 6:00 PM–11:00 PM. Specific calendar dates could be marked as holidays or given special hours (for example, closed for a public holiday, or shorter hours on one particular date), which would override the normal weekly pattern for that day only.

# **25\. Items Requiring Client Confirmation**

**This section combines every open question raised across both versions of this document into one list. Please confirm or correct each before we finalize the build:**

## **From the original requirement**

1. Accept Order — the requirement marks Admin and Manager with “?” for order acceptance. Should Admin and/or Branch Manager be able to accept an order directly (e.g. as backup when no waiter is available), or is order acceptance strictly a Waiter-only action?

2. Manage Menu — similarly marked “?” for Admin and Manager. Should Admin and/or Branch Manager be able to create/edit menu items and prices, in addition to Kitchen and Bartender, or is menu management restricted to Kitchen/Bartender only?

3. Manager-to-branch relationship — the requirement states one manager per branch, but does not state whether a manager can ever be reassigned to a different branch, or manage more than one branch over time.

4. Order rejection — when a Waiter rejects an order, does the customer receive a reason, and can they immediately re-submit a revised order, or does rejection end that ordering attempt entirely?

5. Session boundaries — are waiter sessions fixed daily recurring windows (e.g. every day 10 PM–10 AM) that a manager sets once, or ad-hoc/one-off windows created per shift?

6. Payment gateway — which online payment provider(s) should instant payment integrate with (e.g. Stripe, bKash, Nagad, card gateway)? This affects both scope and refund mechanics for Section 13\.

7. Cashier's “Limited” order view — please confirm exactly which fields the Cashier should see (e.g. order number, amount due, payment status) versus what should stay hidden (e.g. full item list, customer contact details).

8. Refund settlement — for online payments that are refunded (Manager/Admin override), should the refund go back through the original payment gateway automatically, or is it handled manually/offline?

9. Ingredient-based availability — should out-of-stock items be hidden from the customer entirely, or shown but disabled/greyed out with an “unavailable” label?

10. Multi-branch reporting — does Admin require a consolidated cross-branch dashboard (sales, orders, staff), or only the ability to drill into one branch at a time?

## **New in this version**

11. Business structure — should the platform support a single business owner running more than one separate restaurant brand (each with its own name, branches, menu, and staff) under one account, or should it remain scoped to one restaurant with multiple branches, as originally described?

12. Platform support account — should there be a separate account, used only by our development/support team, for setting up new client accounts and providing technical assistance? It would not place orders or represent your restaurant, and would not access your sales data beyond what's needed to provide support, unless otherwise agreed.

13. Host role — should we add a dedicated “Host” role for greeting and seating walk-in guests and coordinating table reservations, separate from Waiter and Branch Manager?

14. Staff working across branches — the original requirement states a staff member belongs to exactly one branch. Should this remain an absolute rule for every role, or should certain roles (for example, a senior or regional manager) be allowed to work across more than one branch?

15. Extra permissions for individual staff — beyond the fixed role permissions already agreed (Section 3), should a Branch Manager be able to grant one additional permission to a specific staff member (for example, letting one trusted Waiter apply discounts) without changing that person's overall role?

16. Bartender login — should Bartenders have their own distinct role and login, separate from Kitchen Staff, or should bar and kitchen staff share one login and simply see different items depending on which station (kitchen or bar) each dish is routed to?

17. Advance table reservations — should customers be able to book a table ahead of time (choosing a date, time, and party size), in addition to the walk-in-and-scan-QR flow already agreed? If yes, should a guest without an account be able to reserve using just a name and phone number?

18. Menu customization — should menu items support customer-chosen options and add-ons that change the price (for example, size, spice level, or extra toppings), or should the menu remain fixed dishes at a fixed price for this phase?

19. Takeaway & delivery — should the platform support Takeaway and/or Delivery orders, in addition to sit-down dine-in? Please note this would need considerable further scoping of its own (for example, who confirms a takeaway order with no assigned waiter, or how a delivery rider is assigned) — we're only asking whether to reserve room for it now.

20. Discount codes — should the system support promotional codes worth a percentage or fixed amount off an order? If yes, should customers be able to enter a code themselves at checkout, or should only staff (such as Cashier or Manager) be able to apply one?

21. Customer reviews — should customers be able to leave a star rating and comment after their order is completed? If yes, should a Manager need to approve a review before it becomes visible to others?

22. Staff work schedule & attendance — beyond the waiter-to-table session assignment already agreed (Section 7), should the system also track each employee's full work schedule and record their actual clock-in and clock-out times, for every role?

23. Suppliers & inventory tracking — should the system include a supplier directory and stock-level tracking (current stock, low-stock warnings, cost per unit) for back-office use? Please note that, as currently scoped, this would be for record-keeping only and would not yet automatically hide a menu item when its ingredients run low — connecting the two is a separate piece of work we can scope in if wanted.

24. Branch operating hours & holidays — should each branch be able to set its own weekly opening hours with more than one time window per day (for example, open for lunch, closed mid-afternoon, open again for dinner), and mark specific dates as holidays or special hours that override the normal schedule for that day?


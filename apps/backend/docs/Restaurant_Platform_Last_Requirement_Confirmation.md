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

The matrix below reflects the access levels described in the requirement. Cells marked “❓ TBC” were left open in the original requirement and are listed again in Section 13 for explicit confirmation.

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
| **Manage Menu** | **❓ TBC** | **❓ TBC** | — No | — No | ✅ Yes | ✅ Yes |

*Legend: Limited \= restricted view for Cashier (e.g. payment-relevant order data only). Assigned \= Waiter sees only orders for tables assigned to them in the active session. Station \= Kitchen/Bartender see only items relevant to their station (food vs. beverage).*

# **4\. Branch & Manager Hierarchy**

1. Admin creates one or more restaurant branches.

2. Admin creates Branch Manager accounts (no limit on the number of managers created).

3. Admin assigns exactly one Branch Manager to each branch.

4. A branch cannot operate without an assigned manager; a manager is not simultaneously assigned to more than one branch (as per current requirement — see Q1 in Section 13).

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

# **14\. Items Requiring Client Confirmation**

**The following points were either explicitly marked open in the source requirement, or are gaps we identified while structuring the flow. Please confirm or correct each before we finalize the build:**

1. Accept Order — the requirement marks Admin and Manager with “?” for order acceptance. Should Admin and/or Branch Manager be able to accept an order directly (e.g. as backup when no waiter is available), or is order acceptance strictly a Waiter-only action?

2. Manage Menu — similarly marked “?” for Admin and Manager. Should Admin and/or Branch Manager be able to create/edit menu items and prices, in addition to Kitchen and Bartender, or is menu management restricted to Kitchen/Bartender only?

3. Manager-to-branch relationship — the requirement states one manager per branch, but does not state whether a manager can ever be reassigned to a different branch, or manage more than one branch over time.

4. Order rejection — when a Waiter rejects an order, does the customer receive a reason, and can they immediately re-submit a revised order, or does rejection end that ordering attempt entirely?

5. Session boundaries — are waiter sessions fixed daily recurring windows (e.g. every day 10 PM–10 AM) that a manager sets once, or ad-hoc/one-off windows created per shift?

6. Payment gateway — which online payment provider(s) should instant payment integrate with (e.g. Stripe, card gateway, or any other)? This affects both scope and refund mechanics for Section 13\.

7. Cashier's “Limited” order view — please confirm exactly which fields the Cashier should see (e.g. order number, amount due, payment status) versus what should stay hidden (e.g. full item list, customer contact details).

8. Refund settlement — for online payments that are refunded (Manager/Admin override), should the refund go back through the original payment gateway automatically, or is it handled manually/offline?

9. Ingredient-based availability — should out-of-stock items be hidden from the customer entirely, or shown but disabled/greyed out with an “unavailable” label?

10. Multi-branch reporting — does Admin require a consolidated cross-branch dashboard (sales, orders, staff), or only the ability to drill into one branch at a time?

Please review each section above, and specifically the answers to Section 14, then confirm below so development can proceed against an agreed scope. If you have any concern about any features just leave a comment here in this document.
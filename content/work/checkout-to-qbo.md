## The problem

A single purchase touches checkout, Salesforce, and QuickBooks — three systems with three different opinions about what happened, especially once currency, refunds, and mid-order changes enter the picture.

## What I built

The integration layer that turns one purchase event into a consistent record across all three systems: the invoice, the entitlement, the revenue schedule, all created from a single webhook, correctly, once.

Architected and own it — built with a collaborator.

- **Idempotency is a state machine, not a hope.** Every webhook is keyed and tracked as processing, completed, or failed. A replay of a completed event returns the original result instead of doing the work twice; a replay of an event still in flight is rejected outright.
- **Failure rolls back everywhere it touched.** If a multi-step transaction fails partway through, a compensating rollback unwinds every system it already changed — invoices voided, records reverted — instead of leaving three systems in three different states.
- **Multi-currency, handled properly.** Orders in a second currency track their own foreign-exchange gain and loss rather than assuming a single exchange rate holds forever.
- **Revenue recognition, corrected.** A recurring pattern — canceling and rebooking rather than amending in place — was quietly inflating what looked like active revenue. I closed that gap with a small, explicit rule about what "superseded" means, instead of a one-off patch that would have needed repeating for the next case.

## Where it stands

In production since 2025, carrying every purchase-to-revenue transaction the organization runs — the one system where the numbers have to be right the first time.

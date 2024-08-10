# Business Logic

Each user has one or more entries in the balance table, with each entry representing an amount the user has paid on behalf of another person. These balance entries are always positive and are updated whenever a payment is made.

To determine how much one user owes another, we calculate the difference between their respective balance entries. The user with the higher balance entry owes the difference from the user with the lower balance entry.

For example:

- User A owes User B 100€: user_id: user_a, owes: user_b, amount=100
- User B owes User A 50€: user_id: user_b, owes: user_a, amount=50

To calculate the difference between two users we subtract the two balance entries. For example, if User A owes User B 100€ and User B owes User A 50€, the difference is 50€. This means that User A owes User B 50€.

To ensure the balance is always accurate, we don't simply add up a user's balance entries when a payment is made. Instead, we retrieve all relevant entries from the expenses table where the user is involved and recalculate the balance accordingly. This approach ensures that the balance remains correct even if an expense is deleted or modified. With this approach we can also make sure that we can always reconstruct the balance from the expenses table.

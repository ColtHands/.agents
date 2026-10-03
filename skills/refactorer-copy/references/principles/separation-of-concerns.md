# Separation of Concerns

## Use when

Business decisions, I/O, and presentation change together accidentally. Look for policy that cannot be tested without a network or for a transport adapter that decides domain eligibility.

## Avoid over-separation

A concern is a cohesive body of knowledge, not every line or step. Splitting a single invariant across services can increase coordination and destroy locality. Follow the repository's real domain ownership rather than prescribing controller/service/repository folders.

## TypeScript example

```typescript
type Cart = Readonly<{ subtotalCents: number; member: boolean }>;
function amountDue(cart: Cart): number {
  return cart.member
    ? Math.round(cart.subtotalCents * 0.9)
    : cart.subtotalCents;
}
type CollectPayment = (cents: number) => Promise<string>;
async function checkout(cart: Cart, collect: CollectPayment): Promise<string> {
  return collect(amountDue(cart));
}
if (amountDue({ subtotalCents: 101, member: true }) !== 91) {
  throw new Error("Rounding policy changed");
}
```

The example assumes the cart already satisfies its input contract. Pricing owns the rounding rule; payment orchestration owns the effect. Moving the rule does not justify changing the existing discount or rounding semantics.

## Refactor and verify

Identify which knowledge changes independently, isolate deterministic decisions, and place external operations at their owner. Keep the resulting public operation deep enough that callers do not coordinate its internals.

Test policy boundaries directly, then test the orchestration's observable calls and failure behavior. Preserve transactions and ordering while moving code; a split across modules must not imply a split across databases or deployments.

Sources: [Parnas on modularization](https://www.cs.umd.edu/class/spring2003/cmsc838p/Design/criteria.pdf), [local design sources](../INDEX.md#sources).

Related: [deep modules](../deep-modules.md).

# DRY — Don't Repeat Yourself

## Use when

The same business fact or decision must be changed in several places. Search callers and tests to establish that the copies represent the same knowledge and should evolve together. Similar syntax alone is weak evidence.

## Prefer less abstraction when

Two features currently compute the same thing for different reasons. Sharing their implementation can couple unrelated product decisions. A small repeated expression can also be clearer than a configurable helper with several modes.

## TypeScript example

Two callers had repeated the same catalog eligibility rule. Put that rule with catalog policy; each caller keeps its presentation choice.

```typescript
type Product = Readonly<{ enabled: boolean; stock: number }>;
function canOrder(product: Product): boolean {
  return product.enabled && product.stock > 0;
}
function buttonLabel(product: Product): string {
  return canOrder(product) ? "Order" : "Unavailable";
}
function availableProducts(products: readonly Product[]): Product[] {
  return products.filter(canOrder);
}
const soldOut: Product = { enabled: true, stock: 0 };
if (buttonLabel(soldOut) !== "Unavailable"
  || availableProducts([soldOut]).length !== 0) {
  throw new Error("Eligibility drifted");
}
```

## Refactor and verify

Identify the shared invariant and its owner before extracting. Check for an existing canonical helper. Migrate every copy of the same rule and test its boundary cases through representative callers. Keep UI wording, transport, and persistence out of the shared policy.

The gain is one place to change the rule. If the helper grows flags describing its callers, reconsider whether the supposedly shared knowledge is actually shared. Do not deduplicate by moving an entire feature into a generic utility package.

Source: [Pragmatic Programmer tips](https://pragprog.com/tips/).

Related: [SoC](separation-of-concerns.md), [deep modules](../deep-modules.md).

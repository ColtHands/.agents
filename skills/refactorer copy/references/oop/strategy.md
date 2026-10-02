# Strategy

## Use when

Callers select among interchangeable algorithms while the surrounding workflow remains stable. Repeated algorithm-selection conditionals may belong at one composition point.

## Prefer simpler

Use a typed function for a stateless algorithm. A local switch can be clearest for a small closed choice. Strategy should not scatter configuration or erase meaningful differences in contracts.

## TypeScript example

```typescript
type ShippingCost = (weightGrams: number) => number;
const standard: ShippingCost = (grams) => grams <= 1000 ? 300 : 600;
const express: ShippingCost = (grams) => grams <= 1000 ? 700 : 1000;
function total(baseCents: number, grams: number, shipping: ShippingCost): number {
  return baseCents + shipping(grams);
}
if (total(1000, 500, standard) !== 1300
  || total(1000, 500, express) !== 1700) {
  throw new Error("Strategy behavior changed");
}
```

## Refactor and verify

Identify the actual interchangeable operation, define its inputs and guarantees, and separate strategy selection from execution. Keep domain decisions about which strategy is allowed with their owner.

Test each algorithm and the unchanged surrounding workflow. Include boundary inputs and expected failures. If the algorithms need substantially different inputs or sequencing, they may not be substitutable; a union or separate operation may communicate the model better.

Source: [Strategy](https://refactoring.guru/design-patterns/strategy).

Related: [State](state.md), [SOLID](../principles/solid.md).

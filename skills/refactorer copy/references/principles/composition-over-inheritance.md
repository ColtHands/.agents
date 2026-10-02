# Composition over Inheritance

## Use when

Subclasses combine independent variations, override internal sequencing, or inherit methods they cannot honor. Compose explicit capabilities when the behavior varies independently of identity.

## Keep inheritance when

An existing framework requires it or there is a stable, substitutable hierarchy whose protected contract is useful. A mechanical conversion can be more indirect and can break lifecycle hooks.

## TypeScript example

```typescript
type Price = (baseCents: number) => number;
type Shipping = (weightGrams: number) => number;
function quoteWith(price: Price, shipping: Shipping) {
  return (baseCents: number, weightGrams: number): number =>
    price(baseCents) + shipping(weightGrams);
}
const memberPrice: Price = (base) => Math.round(base * 0.9);
const standardShipping: Shipping = (grams) => grams <= 1000 ? 300 : 600;
const quote = quoteWith(memberPrice, standardShipping);
if (quote(1000, 500) !== 1200) throw new Error("Quote changed");
```

Pricing and shipping compose without a subclass for every combination. The example assumes validated nonnegative inputs, and preserves its chosen rounding and shipping rules.

## Refactor and verify

Separate the actual variation axes, extract their contracts, and wire them at the existing composition point. Keep lifecycle ownership explicit. A plain function is sufficient when an object has no useful state.

Test supported combinations and order-sensitive interactions. Preserve inherited public behavior before removing the hierarchy. Reject a composition framework if two direct dependencies solve the current problem.

Sources: [GoF design patterns](https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780321770462), [Bridge](https://refactoring.guru/design-patterns/bridge).

Related: [Strategy](../oop/strategy.md), [Bridge](../oop/bridge.md), [Decorator](../oop/decorator.md), [SOLID](solid.md).

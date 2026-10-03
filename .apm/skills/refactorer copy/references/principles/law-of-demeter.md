# Law of Demeter

## Use when

A caller navigates another module's internal object graph to make a decision. The problem is knowledge of collaborators' collaborators, not the number of dots in an expression.

## Prefer direct access when

The value is an intentionally exposed data record, or a fluent API is itself the public contract. Avoid generating forwarding getters solely to reduce dot counts.

## TypeScript example

Ask the module for the capability the caller needs instead of learning its nested configuration.

```typescript
type Settings = Readonly<{ delivery: Readonly<{ allowedRegions: readonly string[] }> }>;
class Merchant {
  constructor(private readonly settings: Settings) {}
  shipsTo(region: string): boolean {
    return this.settings.delivery.allowedRegions.includes(region);
  }
}
function canCheckout(merchant: Merchant, region: string): boolean {
  return merchant.shipsTo(region);
}
const merchant = new Merchant({ delivery: { allowedRegions: ["GE"] } });
if (!canCheckout(merchant, "GE") || canCheckout(merchant, "FR")) {
  throw new Error("Shipping policy changed");
}
```

The merchant owns a meaningful question. An equivalent pure function can be better if merchant settings are deliberately plain shared data; do not force a class solely for this principle.

## Refactor and verify

Find the implementation detail the caller knows and the question it actually needs answered. Move the question to the owner and keep the required capability small. Check that the new method eliminates knowledge rather than forwarding one field.

Test the answer through the new interface and verify that changes to internal nesting no longer require caller edits. Keep DTO serialization and deliberate projections intact.

Source: [Law of Demeter, Northeastern University](https://www.khoury.northeastern.edu/home/lieber/LoD.html).

Related: [Facade](../oop/facade.md), [deep modules](../deep-modules.md), [SoC](separation-of-concerns.md).

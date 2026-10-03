# Adapter

## Use when

An existing collaborator has a useful implementation but a contract that does not match the consuming module. Vendor vocabulary, units, or error types are otherwise leaking into business code.

## Prefer simpler

Call a compatible function directly. A forwarding interface with the same shape and no policy can add unnecessary indirection. Adapt at the owner of the integration, not separately in every caller.

## TypeScript example

```typescript
type Stock = Readonly<{ available: number }>;
type Inventory = (sku: string) => Promise<Stock>;
interface LegacyWarehouse {
  lookup(code: string): Promise<{ qty: number; held: number }>;
}
function adaptWarehouse(legacy: LegacyWarehouse): Inventory {
  return async (sku) => {
    const row = await legacy.lookup(sku);
    return { available: row.qty - row.held };
  };
}
async function verify(): Promise<void> {
  const inventory = adaptWarehouse({
    lookup: async () => ({ qty: 7, held: 2 }),
  });
  if ((await inventory("book")).available !== 5) {
    throw new Error("Inventory mapping changed");
  }
}
void verify();
```

## Refactor and verify

Define the consuming contract first, consolidate translation into the adapter, and migrate callers. Preserve errors, units, nullability, resource lifetime, and cancellation. Validate untrusted wire data at the integration boundary; TypeScript declarations alone are not validation.

Use contract tests for conversion and failure behavior, plus realistic integration checks for the external API. Do not silently clamp or default unexpected data unless that is the established contract.

Source: [Adapter](https://refactoring.guru/design-patterns/adapter).

Related: [Bridge](bridge.md), [deep modules](../deep-modules.md).

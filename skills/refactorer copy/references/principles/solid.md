# SOLID

Use these five lenses when responsibility, substitution, or dependencies make changes spread. They are design tests, not a requirement for five new interfaces.

## The five principles

- **Single Responsibility:** group code that changes for the same domain reason or stakeholder. A cohesive operation can contain many steps; splitting every step into a class can scatter one responsibility.
- **Open/Closed:** at an established axis of variation, adding a variant should not require editing unrelated policy. A closed union and one exhaustive switch can be better for a fixed set of domain states. Do not invent plugin points for possible future requirements.
- **Liskov Substitution:** an implementation must honor the guarantees callers rely on. Compatible TypeScript shapes do not prove compatible error, ordering, mutability, or performance behavior. Do not strengthen preconditions or weaken promised results.
- **Interface Segregation:** expose the capability the caller needs. Avoid making a read-only consumer depend on a large store interface. Do not split a cohesive operation into a sequence callers must orchestrate.
- **Dependency Inversion:** high-level policy should own the dependency contract it needs, instead of learning vendor details. Inject a function or small object at a real seam; a DI container is not required.

## TypeScript example

```typescript
type Receipt = Readonly<{ reference: string }>;
type Charge = (cents: number) => Promise<Receipt>;
type Checkout = (cents: number) => Promise<Receipt>;

function checkoutWith(charge: Charge): Checkout {
  return async (cents) => {
    if (!Number.isSafeInteger(cents) || cents <= 0) {
      throw new RangeError("Positive integer cents required");
    }
    return charge(cents);
  };
}
const calls: number[] = [];
const testCharge: Charge = async (cents) => {
  calls.push(cents);
  return { reference: "receipt-1" };
};
async function verify(): Promise<void> {
  const checkout = checkoutWith(testCharge);
  const receipt = await checkout(1250);
  if (receipt.reference !== "receipt-1" || calls[0] !== 1250) {
    throw new Error("Charge contract changed");
  }
}
void verify();
```

Policy owns the required charge capability. A real provider adapter can satisfy it; adding that adapter does not move checkout rules into the provider. Document and preserve provider failure semantics as part of substitution.

## Refactor and verify

Find actual reasons for change and variations. Move policy to its owner, narrow dependency capabilities, and migrate callers. Test shared contract cases against each adapter, including failures; use integration tests for vendor behavior a fake cannot establish.

Prefer the direct implementation when only one local computation exists. Reject abstractions that increase configuration, casts, or caller coordination without hiding knowledge.

Sources: [Robert C. Martin on Single Responsibility](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html), [design principles collected by Robert C. Martin](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod).

Related: [Strategy](../oop/strategy.md), [Adapter](../oop/adapter.md), [YAGNI](yagni.md), [deep modules](../deep-modules.md).

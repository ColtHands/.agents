# Abstract Factory

## Use when

A caller must construct a family of collaborating products that must agree on a variant. Repeated independent switches risk mixing incompatible members of a family.

## Prefer simpler

One product or one concrete family usually needs a constructor or function. In TypeScript, an object of typed factory functions often expresses a family without an abstract-class hierarchy.

## TypeScript example

```typescript
interface Heading { render(text: string): string }
interface Divider { render(): string }
interface DocumentFactory {
  heading(): Heading;
  divider(): Divider;
}
const markdown: DocumentFactory = {
  heading: () => ({ render: (text) => "# " + text }),
  divider: () => ({ render: () => "---" }),
};
const plain: DocumentFactory = {
  heading: () => ({ render: (text) => text.toUpperCase() }),
  divider: () => ({ render: () => "===" }),
};
function documentTitle(factory: DocumentFactory, text: string): string {
  return factory.heading().render(text) + "\\n" + factory.divider().render();
}
if (documentTitle(markdown, "Guide") !== "# Guide\\n---"
  || documentTitle(plain, "Guide") !== "GUIDE\\n===") {
  throw new Error("Product family changed");
}
```

## Refactor and verify

Find the family-level decision and select it once at the composition point. Have callers use the family contract instead of picking concrete products individually. Do not move product-independent domain policy into the factory.

Test each supported family and interactions between its members. A shared structural interface alone does not enforce family compatibility; enforce stronger constraints when the domain needs them. Adding a new product kind changes every family, so this pattern favors varying families over frequently varying product categories.

Source: [Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory).

Related: [Factory Method](factory-method.md), [Bridge](bridge.md).

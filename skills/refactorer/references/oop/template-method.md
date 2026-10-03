# Template Method

## Use when

An existing inheritance contract has a stable algorithm skeleton with a small number of intentional customization hooks. Subclasses should vary steps while the base class preserves ordering.

## Prefer simpler

Compose functions when there is no useful hierarchy or when steps vary independently. A base class with many optional hooks and flags usually exposes too much implementation.

## TypeScript example

```typescript
abstract class TextJob {
  run(input: string): string {
    const normalized = input.trim();
    return this.transform(normalized) + "\\n";
  }
  protected abstract transform(input: string): string;
}
class UpperJob extends TextJob {
  protected transform(input: string): string {
    return input.toUpperCase();
  }
}
if (new UpperJob().run(" hello ") !== "HELLO\\n") {
  throw new Error("Template order changed");
}
```

TypeScript does not make `run` final here. The design relies on a documented subclass contract; use encapsulation or composition if callers must not override the skeleton.

## Refactor and verify

Locate genuine shared workflow, extract stable sequencing, and keep the hook surface small. Preserve initialization order, exception behavior, and any framework lifecycle contract.

Test the skeleton with representative subclasses and check that hooks cannot accidentally bypass required invariants. Reconsider the hierarchy if customization forces subclasses to understand internal state or call hooks in a prescribed order themselves.

Source: [Template Method](https://refactoring.guru/design-patterns/template-method).

Related: [Factory Method](factory-method.md), [composition over inheritance](../principles/composition-over-inheritance.md).

# Factory Method

## Use when

An existing creator workflow uses products through a common contract, while subclasses legitimately select the concrete product. The creation hook belongs to a useful workflow; a class containing only a forwarding factory rarely earns its hierarchy.

## Prefer simpler

Use a direct constructor or injected factory function when subclass customization is unnecessary. A function named `createThing` is a factory function, not automatically the GoF Factory Method pattern.

## TypeScript example

```typescript
interface Formatter {
  format(value: string): string;
}
abstract class Exporter {
  protected abstract createFormatter(): Formatter;
  export(value: string): string {
    return this.createFormatter().format(value.trim());
  }
}
class UpperExporter extends Exporter {
  protected createFormatter(): Formatter {
    return { format: (value) => value.toUpperCase() };
  }
}
class PlainExporter extends Exporter {
  protected createFormatter(): Formatter {
    return { format: (value) => value };
  }
}
if (new UpperExporter().export(" hi ") !== "HI"
  || new PlainExporter().export(" hi ") !== "hi") {
  throw new Error("Export contract changed");
}
```

## Refactor and verify

Locate the existing creation variation, define the minimum product contract, and move only construction into the hook. Keep invariant workflow steps in their current owner. Preserve whether creation returns a new instance, a cached instance, or an owned resource.

Run the same workflow contract cases for each creator, including errors and resource cleanup where relevant. If the creator loses its meaningful workflow, collapse the hierarchy into composition.

Source: [Factory Method](https://refactoring.guru/design-patterns/factory-method).

Related: [Abstract Factory](abstract-factory.md), [Template Method](template-method.md), [composition over inheritance](../principles/composition-over-inheritance.md).

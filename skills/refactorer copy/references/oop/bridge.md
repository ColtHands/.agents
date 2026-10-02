# Bridge

## Use when

Two dimensions vary independently and an inheritance tree has a class for every combination. Separate the caller-facing abstraction from the implementation capability it delegates to.

## Prefer simpler

A single algorithm variation may need only Strategy. Bridge is useful when both sides have their own meaningful evolution, not merely because a constructor accepts a dependency.

## TypeScript example

```typescript
interface Output {
  write(text: string): void;
}
class Report {
  constructor(protected readonly output: Output) {}
  publish(title: string): void {
    this.output.write(title);
  }
}
class NumberedReport extends Report {
  override publish(title: string): void {
    this.output.write("1. " + title);
  }
}
const lines: string[] = [];
const memory: Output = { write: (text) => { lines.push(text); } };
const upper: Output = { write: (text) => { lines.push(text.toUpperCase()); } };
new Report(memory).publish("Status");
new NumberedReport(upper).publish("Status");
if (lines.join("|") !== "Status|1. STATUS") {
  throw new Error("Bridge combinations changed");
}
```

## Refactor and verify

Identify independent dimensions and move their responsibilities to opposite sides of a small contract. Compose at the existing wiring point. A functional implementation can express the same separation without subclassing.

Test supported combinations and lifecycle ownership. Keep the abstraction useful to callers; exposing every low-level output option can turn the bridge into a shallow pass-through. Avoid supporting a Cartesian product the domain does not permit.

Source: [Bridge](https://refactoring.guru/design-patterns/bridge).

Related: [composition over inheritance](../principles/composition-over-inheritance.md), [Strategy](strategy.md), [Abstract Factory](abstract-factory.md).

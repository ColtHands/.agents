# Visitor

## Use when

A stable set of element variants needs several independently evolving operations. Move each operation into one visitor instead of distributing it across every element implementation.

## Prefer simpler

A discriminated union with an exhaustive function is often enough in TypeScript. Visitor favors adding operations; adding a new element variant requires updating all visitors.

## TypeScript example

```typescript
interface Visitor<R> {
  text(value: Text): R;
  count(value: Count): R;
}
interface ElementValue { accept<R>(visitor: Visitor<R>): R }
class Text implements ElementValue {
  constructor(readonly value: string) {}
  accept<R>(visitor: Visitor<R>): R { return visitor.text(this); }
}
class Count implements ElementValue {
  constructor(readonly value: number) {}
  accept<R>(visitor: Visitor<R>): R { return visitor.count(this); }
}
const render: Visitor<string> = {
  text: (text) => text.value,
  count: (count) => String(count.value),
};
const elements: readonly ElementValue[] = [new Text("items"), new Count(2)];
if (elements.map((element) => element.accept(render)).join(":") !== "items:2") {
  throw new Error("Visitor dispatch changed");
}
```

## Refactor and verify

Establish which axis changes more often: element kinds or operations. Extract one operation at a time, preserving traversal ownership and order. Avoid exposing private representation solely to feed visitors.

Test every variant against each operation and verify that adding a variant creates useful compiler pressure. Do not introduce generic visitor machinery for a single small switch.

Source: [Visitor](https://refactoring.guru/design-patterns/visitor).

Related: [Composite](composite.md), [Interpreter](interpreter.md).

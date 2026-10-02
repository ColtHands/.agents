# Interpreter

## Use when

A small, stable language of expressions is repeatedly evaluated, and its grammar should be explicit. Put grammar representation and evaluation together rather than scattering string parsing and condition checks across callers.

## Prefer simpler

A predicate function or lookup table is enough for a fixed rule. A substantial language generally needs established parsing tools and a deliberate language specification. Do not replace a rule with arbitrary code evaluation.

## TypeScript example

```typescript
type Expression =
  | Readonly<{ kind: "literal"; value: number }>
  | Readonly<{ kind: "add"; left: Expression; right: Expression }>;
function evaluate(expression: Expression): number {
  switch (expression.kind) {
    case "literal": return expression.value;
    case "add": return evaluate(expression.left) + evaluate(expression.right);
  }
}
const expression: Expression = {
  kind: "add",
  left: { kind: "literal", value: 2 },
  right: { kind: "literal", value: 3 },
};
if (evaluate(expression) !== 5) throw new Error("Expression semantics changed");
```

This TypeScript union is a compact alternative to a GoF class per grammar production. It represents an already constructed expression; it does not parse untrusted input.

## Refactor and verify

Define the supported grammar and semantics, represent its nodes explicitly, and isolate evaluation. Keep parsing, validation, and evaluation responsibilities clear.

Test every production, nesting, failure behavior, and evaluation order. Bound work for untrusted or deeply nested expressions when that is relevant to the existing contract. Adding a new node requires checking every interpreter or visitor.

Source: [GoF catalog, including Interpreter](https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780321770462).

Related: [Composite](composite.md), [Visitor](visitor.md).

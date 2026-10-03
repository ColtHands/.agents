# Iterator

## Use when

Callers need ordered traversal without learning a collection's representation. A traversal may be lazy, stateful, or shared across several consumers.

## Prefer simpler

Use native arrays and iteration when they already provide the right contract. TypeScript's `Iterable<T>` and generator syntax usually eliminate custom iterator classes.

## TypeScript example

```typescript
function* range(start: number, endExclusive: number): Generator<number, void, unknown> {
  for (let value = start; value < endExclusive; value += 1) {
    yield value;
  }
}
const values = [...range(2, 5)];
if (values.join(",") !== "2,3,4" || [...range(2, 2)].length !== 0) {
  throw new Error("Traversal boundaries changed");
}
```

## Refactor and verify

Identify traversal order, whether consumers can restart, and whether data is snapshotted or live. Replace exposed collection internals with the existing native protocol where useful. This range assumes finite integer bounds.

Test empty traversal, ordering, partial consumption, and reuse. A generator instance is normally consumed once, while a function can create another iterator. Resource-owning iterators need cleanup on early termination; async iterables also need explicit failure and cancellation behavior.

Source: [Iterator](https://refactoring.guru/design-patterns/iterator).

Related: [Composite](composite.md).

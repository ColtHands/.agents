# Prototype

## Use when

A caller needs an independent object based on an existing configured instance, and the object should own how its meaningful state is copied. Copying knowledge is otherwise scattered across callers.

## Prefer simpler

An immutable value can often be reused. A record spread is sufficient for a shallow copy when that is the actual contract. This design pattern is distinct from the language's prototype inheritance mechanism.

## TypeScript example

```typescript
type Point = { x: number; y: number };
class Stroke {
  constructor(readonly points: Point[], readonly color: string) {}
  clone(): Stroke {
    return new Stroke(this.points.map((point) => ({ ...point })), this.color);
  }
}
const original = new Stroke([{ x: 1, y: 2 }], "black");
const copy = original.clone();
const point = copy.points[0];
if (point) point.x = 9;
if (original.points[0]?.x !== 1 || copy === original) {
  throw new Error("Clone independence failed");
}
```

## Refactor and verify

Define what gets copied, shared, reset, or assigned a new identity. Move that policy into one creation operation. Preserve domain identity rules; duplicating an entity is often a domain operation, not generic cloning.

Test nested mutation independence and intentional sharing. Object spread is shallow, and structured cloning does not preserve arbitrary class behavior or external resources. Never assume a database connection, subscription, or file handle can be cloned as ordinary state.

Source: [Prototype](https://refactoring.guru/design-patterns/prototype).

Related: [Memento](memento.md).

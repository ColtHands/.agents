# Flyweight

## Use when

Measured memory pressure comes from many objects repeating the same immutable intrinsic state. Share that state while keeping occurrence-specific state outside it.

## Prefer simpler

Ordinary values are better when memory is not a demonstrated problem. A pool can add key computation, retention, and lifecycle complexity. Flyweight is not a general name for any cache.

## TypeScript example

```typescript
type Style = Readonly<{ font: string; size: number }>;
type Glyph = Readonly<{ character: string; x: number; style: Style }>;
const styles = new Map<string, Style>();
function styleFor(font: string, size: number): Style {
  const key = JSON.stringify([font, size]);
  const existing = styles.get(key);
  if (existing) return existing;
  const style = Object.freeze({ font, size });
  styles.set(key, style);
  return style;
}
const a: Glyph = { character: "A", x: 0, style: styleFor("Serif", 12) };
const b: Glyph = { character: "B", x: 10, style: styleFor("Serif", 12) };
if (a.style !== b.style || a.x === b.x) {
  throw new Error("Intrinsic and extrinsic state were mixed");
}
```

## Refactor and verify

Measure allocations, distinguish shared intrinsic values from position or owner-specific data, and centralize interning within an appropriate lifetime. Ensure cache keys distinguish all intrinsic fields.

Verify both value behavior and intentional sharing. Benchmark memory with realistic cardinality, including pool overhead and retention. Shared state must not change under another occurrence; shallow readonly types alone do not guarantee that. Bound or scope the pool when the key space can grow.

Source: [Flyweight](https://refactoring.guru/design-patterns/flyweight).

Related: [Prototype](prototype.md), [Proxy](proxy.md).

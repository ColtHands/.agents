# TypeScript design

Read when selecting a representation or changing a typed interface.
Prefer ordinary TypeScript that reveals the invariant.
Adapt to the target project's compiler and framework conventions.
Do not weaken its settings to accommodate a refactor.

## Selection signals

Use a function for an operation, a record for data, a discriminated union for a closed set of alternatives, and a class or closure when identity, lifecycle, or encapsulated state earns it. A function parameter can provide a strategy. A typed object of constructors can provide an abstract factory. Preserve the distinction between these simpler alternatives and inheritance-based textbook patterns.

Avoid exporting every internal type, manufacturing interfaces for single pass-through implementations, or replacing a clear switch with cast-heavy dispatch. Generics should describe a relationship callers need, not hide an unmodeled shape.

## Model the invariant

```typescript
type Delivery =
  | Readonly<{ kind: "pickup"; desk: string }>
  | Readonly<{ kind: "shipping"; address: string }>;

function describe(delivery: Delivery): string {
  switch (delivery.kind) {
    case "pickup":
      return "Collect at " + delivery.desk;
    case "shipping":
      return "Ship to " + delivery.address;
    default: {
      const unreachable: never = delivery;
      return unreachable;
    }
  }
}
if (describe({ kind: "pickup", desk: "A" }) !== "Collect at A") {
  throw new Error("Unexpected delivery description");
}
```

The union removes optional fields that would require callers to reconstruct which combinations are valid. An exhaustive switch is often the simplest implementation for a closed domain.

## Preserve runtime truth

- Parse untrusted values at entry points. `unknown` makes that uncertainty explicit; an assertion alone does not validate data.
- Keep errors and absence distinct when callers need that distinction. Preserve existing throw/return contracts at external interfaces.
- `readonly` and `Readonly<T>` are compile-time restrictions and shallow. They neither freeze nested values nor protect an object from another mutable alias.
- A branded type needs a controlled creation path. Explain any assertion at that path; avoid distributing unchecked casts through callers.
- Optional properties, explicit `undefined`, `null`, and omitted serialized fields can have different observable behavior.
- An ECMAScript module instance is not a universal singleton across workers, processes, bundles, or request contexts. An async function and a Promise are not automatically pure, lazy, or cancellable.

## Refactoring and checks

Start from callers and the values that actually arrive. Move validation to the owner, introduce the stronger internal type, and migrate operations together. Preserve serialization, exception behavior, object identity where exposed, and framework lifecycle semantics.

Type-check exhaustive handling and valid construction, then run behavior tests for boundary inputs. Do not migrate the repository to a new validation or FP framework just because an example uses a union.

Sources: [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [object types](https://www.typescriptlang.org/docs/handbook/2/objects.html), [classes](https://www.typescriptlang.org/docs/handbook/2/classes.html).

Related: [Strategy](oop/strategy.md).

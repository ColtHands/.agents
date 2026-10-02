# Deep modules

Read when changing an interface, moving ownership, or joining shallow modules. Adapted from the **Deep vs shallow** and **Principles** sections of `codebase-design`; provenance is in the [sources](INDEX.md#sources).

## Vocabulary

A **module** is anything with an interface and implementation: a function, class, package, or larger slice. Its **interface** includes everything callers must know: types, invariants, sequencing, errors, configuration, and performance constraints. A **seam** is the place where behavior can be substituted. An **adapter** fills that role with a concrete implementation.

**Depth** is the amount of useful behavior available for the interface callers must learn. **Leverage** is the benefit to callers; **locality** means knowledge, fixes, and verification concentrate in one place. These terms describe design properties, not required TypeScript keywords or folder names.

## Deep vs shallow

**Deep module** = small interface + lots of implementation:

```text
┌─────────────────────┐
│   Small Interface   │  Few operations, simple parameters
├─────────────────────┤
│                     │
│ Deep Implementation │  Complexity hidden from callers
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation:

```text
┌─────────────────────────────────┐
│       Large Interface           │  Many methods, complex parameters
├─────────────────────────────────┤
│      Thin Implementation        │  Mostly passes through
└─────────────────────────────────┘
```

Ask whether there can be fewer operations, simpler parameters, or less caller knowledge. Depth is not an implementation-lines-to-interface-lines ratio: adding code never earns depth by itself.

## Principles

- **Depth is a property of the interface, not the implementation.** Internals may contain small, replaceable parts. Private internal seams do not have to become public configuration.
- **The deletion test.** If removing a module makes complexity disappear, investigate whether it was a pass-through. If removal redistributes the same knowledge across callers, the module was earning its keep. Include compatibility and policy responsibilities in this judgment.
- **The interface is the test surface.** Exercise behavior through the same seam as callers. Pressure to test past it can reveal a poor shape. Internal tests can still be useful for substantial private algorithms.
- **One adapter means a hypothetical seam. Two adapters means a real one.** Introduce a substitution seam for actual variation, such as production I/O plus a justified test adapter. Do not create a public interface for every class.

## TypeScript example

Callers should request a reservation, rather than coordinating capacity checks and increments separately.

```typescript
type Reservation = Readonly<{ eventId: string; seats: number }>;
type ReserveResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: "invalid-count" | "unavailable" };

function ticketOffice(initial: ReadonlyMap<string, number>) {
  const remaining = new Map(initial);
  return {
    reserve(eventId: string, seats: number): ReserveResult {
      if (!Number.isSafeInteger(seats) || seats <= 0) {
        return { ok: false, reason: "invalid-count" };
      }
      const available = remaining.get(eventId) ?? 0;
      if (available < seats) return { ok: false, reason: "unavailable" };
      remaining.set(eventId, available - seats);
      return { ok: true, reservation: { eventId, seats } };
    },
  };
}
const office = ticketOffice(new Map([["talk", 2]]));
const reservation = office.reserve("talk", 2);
if (!reservation.ok || office.reserve("talk", 1).ok) {
  throw new Error("Reservation invariant failed");
}
```

This example owns one in-memory state update. Across database or network I/O, use the existing transaction or concurrency mechanism; hiding two remote calls behind a method does not make them atomic.

## Refactoring and verification

Map duplicated caller knowledge, move the invariant and its data together, then migrate callers to the smaller operation. Test outcomes, failure behavior, and repeated calls through that operation. Do not merge unrelated knowledge to make a large implementation.

For pure computation, test directly. For local dependencies, prefer realistic local stand-ins where they support the required behavior. Owned remote and third-party dependencies can use injected adapters with contract checks appropriate to the boundary. Keep test-only choices private unless callers actually need them.

Related: [Facade](oop/facade.md), [Design It Twice](design-it-twice.md).

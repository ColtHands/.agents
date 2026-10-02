# Singleton

## Use when

There is a demonstrated requirement for one controlled instance within a precisely defined runtime scope, and global access is an intentional part of the contract. Examine existing singleton use critically during refactoring.

## Prefer simpler

Create one instance at the composition root and inject it. This expresses shared lifetime without making every caller depend on global mutable state. A module export may suffice for immutable configuration; it does not guarantee one instance across all runtimes.

## TypeScript example

This shows the conventional mechanism, including its explicit shared-state consequence.

```typescript
class Sequence {
  private static readonly instance = new Sequence();
  private value = 0;
  private constructor() {}
  static shared(): Sequence {
    return Sequence.instance;
  }
  next(): number {
    this.value += 1;
    return this.value;
  }
}
const first = Sequence.shared();
const second = Sequence.shared();
if (first !== second || first.next() !== 1 || second.next() !== 2) {
  throw new Error("Runtime-scoped identity changed");
}
```

## Refactor and verify

Specify the required scope: request, application instance, worker, or process. Trace initialization, cleanup, test isolation, and state ownership. If refactoring away from a singleton, pass its actual capability from that scope's owner and migrate callers.

Test identity within the intended scope and isolation across distinct scopes. Multiple processes, workers, bundles, or module copies can each have an instance. A Singleton class is neither a distributed uniqueness guarantee nor a synchronization mechanism.

Source: [Singleton](https://refactoring.guru/design-patterns/singleton).

Related: [SOLID](../principles/solid.md), [TypeScript design](../typescript-design.md).

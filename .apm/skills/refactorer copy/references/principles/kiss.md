# KISS — Keep It Simple

## Use when

The reader must learn a mechanism larger than the problem: layered wrappers, a generic dispatcher for one operation, or a clever pipeline that hides the actual decision.

## What simplicity means

Optimize the facts a maintainer must hold in mind. Shorter text is not automatically simpler; a named intermediate result, explicit branch, or loop may make behavior easier to verify. Essential complexity still needs an honest representation.

## TypeScript example

```typescript
function firstAvailable(values: readonly (string | undefined)[]): string | undefined {
  for (const value of values) {
    if (value !== undefined && value.length > 0) return value;
  }
  return undefined;
}
if (firstAvailable([undefined, "", "ready", "later"]) !== "ready"
  || firstAvailable([]) !== undefined) {
  throw new Error("Selection semantics changed");
}
```

This loop makes ordering, termination, and absence visible. A pipeline is also reasonable if it is at least as clear and preserves eager/lazy behavior. A custom Option framework is not required for this one operation.

## Refactor and verify

Write the operation in domain terms, remove indirection that adds no contract, and name the decisions that remain. Inspect callers: a short helper is not a simplification if it exports hidden preconditions to every user.

Verify edge cases, evaluation order, and early termination. Compare candidate designs using actual caller knowledge. Do not compress code to manufacture a line-count win.

Sources: [Pragmatic Programmer tips on simpler change and knowledge](https://pragprog.com/tips/), [local design sources](../INDEX.md#sources).

Related: [deep modules](../deep-modules.md), [YAGNI](yagni.md).

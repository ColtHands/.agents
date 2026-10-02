# Composite

## Use when

Leaves and nested groups form a tree, and callers should perform the same operation on either. Repeated recursive type checks may be an opportunity to put the operation behind a shared contract.

## Prefer simpler

A discriminated union with one recursive function is often clearer for a closed tree model. Do not force leaves to expose meaningless mutating child operations.

## TypeScript example

```typescript
interface Sized {
  size(): number;
}
class FileEntry implements Sized {
  constructor(private readonly bytes: number) {}
  size(): number { return this.bytes; }
}
class Directory implements Sized {
  constructor(private readonly children: readonly Sized[]) {}
  size(): number {
    return this.children.reduce((sum, child) => sum + child.size(), 0);
  }
}
const root = new Directory([
  new FileEntry(4),
  new Directory([new FileEntry(6)]),
]);
if (root.size() !== 10 || new Directory([]).size() !== 0) {
  throw new Error("Tree aggregation changed");
}
```

## Refactor and verify

Identify the common operation, distinguish leaf data from child ownership, and migrate callers to the common contract. Keep construction constraints explicit: this example assumes an acyclic tree.

Test empty groups, nested groups, and operation ordering where it matters. If the actual structure is a graph with sharing or cycles, choose whether to revisit, deduplicate, or reject; do not accidentally convert graph semantics into tree semantics. Deep recursion may need an iterative traversal.

Source: [Composite](https://refactoring.guru/design-patterns/composite).

Related: [Visitor](visitor.md), [Iterator](iterator.md).

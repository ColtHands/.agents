# Strict structural review

Use during diagnosis and again on the final diff. Adapted from `beautifully-strict-code-quality-review`; see [sources](INDEX.md#sources).

## Look for the restructuring that deletes complexity

Ask whether a different owner, invariant, or representation could remove entire categories of helpers and conditionals. Be ambitious within scope. A refactor should reduce the knowledge needed to understand the behavior, not just distribute the same knowledge across more files.

Prioritize structural regressions, missed simplifications, tangled control flow, weak contracts, then decomposition and readability. Prefer a few findings grounded in actual callers over cosmetic nits.

| Signal | Investigation | Preferred direction |
|---|---|---|
| Repeated flags or condition chains | Are invalid combinations being represented? | A coherent state model or one explicit policy |
| Same rule in several layers | Who owns the domain decision? | One canonical implementation and typed inputs |
| Identity wrappers or forwarding classes | What knowledge would deletion expose? | Remove the layer if it has no contract or policy |
| Casts, optional fields, fallback defaults | Is an invariant missing at the data boundary? | Validate there and narrow the internal model |
| Feature checks in shared infrastructure | Did domain knowledge leak? | Move it to the owner and pass a meaningful operation |
| Large file or growing god object | Which responsibilities change independently? | Cohesive modules with meaningful interfaces |
| Sequential async work or partial updates | Are ordering or transaction semantics required? | Simplify orchestration without changing guarantees |

Crossing 1,000 lines is a strong signal to investigate decomposition. Existing large files also deserve scrutiny. Generated code and cohesive tables differ from mixed responsibilities. Explain a justified exception; do not create arbitrary fragments or request routine permission just because of the count.

## A concrete deletion

This helper adds no policy, validation, or stable abstraction; internal callers can use the existing operation.

```typescript
type Item = Readonly<{ title: string }>;
function readTitle(item: Item): string {
  return item.title;
}
function captionBefore(item: Item): string {
  return readTitle(item).trim();
}
function captionAfter(item: Item): string {
  return item.title.trim();
}
const item: Item = { title: "  Workshop  " };
if (captionBefore(item) !== captionAfter(item)) {
  throw new Error("Caption behavior changed");
}
```

An exported compatibility wrapper or a function hiding an unstable representation may earn its place. Inspect those responsibilities before deletion.

## Review the implementation

Trace happy and failure paths across changed callers. Check that new types reveal actual guarantees: `unknown` is appropriate at untrusted edges, and a localized checked assertion is different from casts distributed across business logic. Do not mechanically ban every conditional or optional property.

Look for lost validation, changed exception types, altered effect order, shared mutable state, stale caches, and weakened tests. Parallelization can change rate limits, cancellation, failures, or side effects. A new method does not make several writes atomic.

## Completion bar

The selected change must preserve required behavior, have no clear structural regression, and leave no obvious in-scope simplification unaddressed. New abstractions must hide knowledge or support actual variation. Callers should need fewer facts; files should group coherent responsibilities.

When a finding remains, state the code evidence, consequence, and concrete remedy. When implementation is authorized, fix it rather than stopping at feedback. Do not erase useful test coverage to make the refactor look smaller.

Related: [deep modules](deep-modules.md), [DRY](principles/dry.md), [TypeScript design](typescript-design.md), [state](oop/state.md).

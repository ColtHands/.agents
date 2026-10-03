# Design It Twice

Use for substantial interface, ownership, state-model, or cross-module responsibility changes. Adapted from `codebase-design/DESIGN-IT-TWICE.md`; see the [sources](INDEX.md#sources). Small local refactors can proceed directly.

## Frame the problem

Read [deep modules](deep-modules.md). Explain the concrete problem and constraints to the user, then continue without inserting an approval pause. Identify callers, the current behavioral contract, domain language, existing edits, and dependencies. Use repository architecture notes when present; do not require a file named CONTEXT.md.

A brief should state what currently varies, what must remain compatible, and the evidence of complexity. An illustrative TypeScript shape can make constraints concrete, but do not seed all designers with your preferred answer.

## Three independent designs

Spawn three read-only design sub-agents in parallel. Give each the same raw code context, scope, contract, and relevant local reference links, plus a different constraint:

1. **Minimal interface:** minimize caller knowledge and aim for a few meaningful entry points. Seek a model that deletes branches or coordination.
2. **Justified variation:** support the variants and adapters that exist or are required now. Consider a different ownership or representation; exclude hypothetical extension requirements.
3. **Common caller:** make the most common operation obvious and hard to misuse. Prefer direct composition where it hides the right complexity.

Ask for structurally different alternatives, not renamed versions of one design. At least one candidate must consider the simplest native TypeScript solution. Designers must not edit shared files or present their alternatives as user-approved requirements.

Each designer returns:

- A TypeScript interface and caller example.
- Invariants, sequencing, errors, and compatibility consequences.
- What implementation detail becomes hidden and who owns it.
- Dependency strategy, actual variation, and verification through the seam.
- Tradeoffs in depth, locality, migration cost, and remaining complexity.

If three parallel agents are unavailable or disallowed, explicitly say so and develop three distinct alternatives sequentially. Do not pretend that sequential work was independent. Adapt to available concurrency; avoid nested delegation that blocks on exhausted slots.

## Compare and choose

Reject candidates that cannot preserve required behavior. Compare remaining candidates against the current design and the simplest equivalent native alternative:

| Criterion | Evidence |
|---|---|
| Depth | Facts, operations, and ordering rules callers stop knowing |
| Locality | Places a domain rule or variant must change |
| Seam placement | Knowledge and actual variation aligned with ownership |
| Simplicity | Concepts, branches, casts, states, and layers eliminated |
| Verification | Observable behavior testable without exposing internals |
| Cost | Migration size and any changed performance or dependency burden |

Do not average invented numeric scores. Name the strongest candidate and the decisive tradeoff. A hybrid is useful only if its combined interface remains coherent. Present the comparison briefly, then implement the winner within the user's authorization.

When evaluating a library, compare the complete candidate, including adapters, with the simplest native design. Ask for clarification only when a requirement or incompatible external contract remains unresolved; the existence of alternatives is not itself a reason to stop.

After implementation, rerun the [strict review](strict-review.md). A beautiful proposal does not excuse an implementation that merely relocates complexity.

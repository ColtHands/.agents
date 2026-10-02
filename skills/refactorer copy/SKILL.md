---
name: refactorer
description: Refactor TypeScript code for deeper modules, simpler models, clearer ownership, and less branching while preserving behavior. Use for structural cleanup, module or interface redesign, and ambitious codebase refactoring; honor requests that limit the work to review or planning.
---

# Refactorer

Make the implementation simpler to understand.
Seek restructurings that delete unnecessary concepts, states, branches, and layers. A pattern earns its place by improving the actual code, not by having a name.

Default to inspecting, designing, implementing, and verifying the requested refactor. If the user asks only for a review, alternatives, or a plan, keep the work read-only. Honor the current execution mode and the user's scope.

## 1. Establish the behavior and scope

- Read repository instructions, relevant callers, types, dependencies, and tests. Inspect existing edits before changing code.
- Resolve an explicit path, module, diff, or repository-wide request from the conversation. If no target can be inferred after inspection, ask for the missing scope.
- Identify observable contracts: return values, errors, side effects, ordering, concurrency, identity, persistence, and relevant performance characteristics. Preserve these unless the user requested a change.
- Find the project's compiler, formatter, lint, and test commands. Record existing failures. Add characterization tests where important behavior lacks coverage.
- Inspect broadly enough to find the canonical owner and existing helpers. Keep edits tied to the requested behavior; a repository-wide task can proceed through coherent refactoring candidates.

## 2. Find the structural simplification

Use [strict structural review](references/strict-review.md) to diagnose the problem. Prefer a small number of high-conviction opportunities with concrete caller or code evidence.

For module or ownership changes, read [deep modules](references/deep-modules.md). Ask what complexity callers could stop knowing, what invariant belongs in one place, and whether a better state representation would remove entire branches.

Use the [reference index](references/INDEX.md) to select relevant guides. Read the shortlisted guides before applying a pattern. Do not load the entire library. Include the simplest behaviorally equivalent native TypeScript design among the candidates; sometimes the best refactor is deletion, a function, a record, or an explicit switch.

Apply [TypeScript design guidance](references/typescript-design.md) to the selected design. Choose functions, classes, unions, or composed objects according to the problem and project conventions. Keep domain terms consistent with the repository.

## 3. Design substantial changes three ways

For substantial changes to interfaces, ownership, state models, or responsibilities across modules, follow [Design It Twice](references/design-it-twice.md): obtain three independent designs, compare them, and choose one.

A rename, a local helper extraction, removal of a redundant wrapper, or another small change that preserves those structures does not need the full comparison. Do not split a substantial redesign into small edits to bypass design work.

## 4. Implement and verify

- Implement the chosen design in coherent increments. Migrate affected internal callers together and remove obsolete paths once their behavior is covered.
- Keep compatibility at public interfaces unless changing it is in scope. Internal types can improve while an existing external contract is adapted at its owner.
- Reuse existing project utilities and suitable dependencies. Do not introduce speculative extension points, generic frameworks, or architecture migrations merely to demonstrate a pattern.
- Test through the resulting interface. Retain useful coverage; replace tests coupled to deleted internals only when the same behaviors are verified through the new interface.
- Run the appropriate checks and inspect the final diff. Reapply [strict structural review](references/strict-review.md): passing tests is necessary evidence, not proof of good design.
- Continue while a concrete, in-scope improvement remains necessary. Stop when the selected refactor is coherent, verified as far as available tooling allows, and has no unresolved structural regression. Do not invent churn to satisfy an ideal of perfection.

Routine implementation choices do not need repeated approval. Clarify missing requirements or incompatible contracts when the available evidence cannot resolve them.

## Deliver the result

Explain the structural problem, what became simpler, and why the selected design fits. For substantial changes, summarize the alternatives and the decisive tradeoff. Report checks actually run, pre-existing failures, and material verification limits.

## Reference conventions

All programming examples are TypeScript. Each fenced example is self-contained and can be checked independently; examples illustrate a seam and are not a mandate to copy a framework into the project. Read sources only when clarification or current library APIs require them.

The [reference index](references/INDEX.md#sources) records sources. The skill's workflow and pattern guidance are available locally and do not require the original skills to be installed.

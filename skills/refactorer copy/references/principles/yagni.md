# YAGNI — You Aren't Gonna Need It

## Use when

A refactor introduces registries, modes, plugins, or extension hooks for use cases that no caller or requirement needs. Distinguish useful simplification now from machinery justified only by a forecast.

## Keep necessary design

YAGNI does not excuse known requirements, required compatibility, meaningful tests, or deferred cleanup that already obstructs work. A production dependency and a real test substitute can justify a seam today.

## TypeScript example

A current requirement selects one of two known output forms. It does not yet need a plugin registry.

```typescript
type Format = "plain" | "upper";
function renderTitle(title: string, format: Format): string {
  return format === "upper" ? title.toUpperCase() : title;
}
if (renderTitle("Guide", "plain") !== "Guide"
  || renderTitle("Guide", "upper") !== "GUIDE") {
  throw new Error("Supported output changed");
}
```

If independent providers actually appear, reconsider a strategy or adapter then. Removing unsupported extension hooks now can eliminate initialization order, registration errors, and mutable global state.

## Refactor and verify

Trace users of every proposed option or extension point. Keep required variants, remove unused scaffolding within scope, and simplify the default path. Before deleting a public extension API, check compatibility requirements rather than inferring usage solely from repository search.

Test all supported variants and any required rejection behavior. Preserve the user's intended feature set; do not label an inconvenient requirement speculative.

Source: [Martin Fowler on Yagni](https://martinfowler.com/bliki/Yagni.html).

Related: [KISS](kiss.md), [SOLID](solid.md), [Strategy](../oop/strategy.md).

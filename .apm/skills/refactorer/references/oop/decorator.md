# Decorator

## Use when

Behavior must be layered around a capability while keeping its caller-facing contract. Several independent concerns would otherwise create a subclass for every combination.

## Prefer simpler

A direct call is enough for one fixed concern. TypeScript higher-order functions often express decoration compactly. The GoF pattern does not require TypeScript decorator syntax or experimental metadata.

## TypeScript example

```typescript
type Render = (value: string) => string;
function withPrefix(render: Render, prefix: string): Render {
  return (value) => prefix + render(value);
}
function withBrackets(render: Render): Render {
  return (value) => "[" + render(value) + "]";
}
const identity: Render = (value) => value;
const outerBrackets = withBrackets(withPrefix(identity, "> "));
const outerPrefix = withPrefix(withBrackets(identity), "> ");
if (outerBrackets("a") !== "[> a]" || outerPrefix("a") !== "> [a]") {
  throw new Error("Decoration order changed");
}
```

## Refactor and verify

Keep the original operation contract and extract the surrounding concern into one wrapper. Compose the order explicitly. Avoid a framework that makes the wrapping order harder to inspect than the original code.

Test the base behavior, each concern, and supported compositions. Error handling, async completion, retries, and caching can alter semantics; a decorator is not automatically transparent merely because its type matches.

Source: [Decorator](https://refactoring.guru/design-patterns/decorator).

Related: [Proxy](proxy.md).

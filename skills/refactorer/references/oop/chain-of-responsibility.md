# Chain of Responsibility

## Use when

A request must pass through ordered handlers that may handle it or pass it onward. Scattered checks duplicate a real routing or processing sequence.

## Prefer simpler

A fixed local decision often needs one switch. An ordinary array of typed functions can express a chain; linked handler classes are unnecessary unless their object lifecycle matters.

## TypeScript example

```typescript
type Request = Readonly<{ path: string }>;
type Reply = Readonly<{ status: number; body: string }>;
type Handler = (request: Request) => Reply | undefined;
function route(request: Request, handlers: readonly Handler[]): Reply {
  for (const handler of handlers) {
    const reply = handler(request);
    if (reply !== undefined) return reply;
  }
  return { status: 404, body: "Missing" };
}
const handlers: readonly Handler[] = [
  (request) => request.path === "/health"
    ? { status: 200, body: "OK" } : undefined,
];
if (route({ path: "/health" }, handlers).status !== 200
  || route({ path: "/other" }, handlers).status !== 404) {
  throw new Error("Routing contract changed");
}
```

## Refactor and verify

State whether the chain stops on first handling, runs all handlers, or uses middleware with an explicit continuation. These contracts are different. Preserve order, error propagation, and unhandled behavior.

Extract handlers around real responsibilities and keep chain construction visible. Test short-circuiting, fallthrough, failures, and handler ordering. Do not introduce a global registry merely to relocate a local branch chain.

Source: [Chain of Responsibility](https://refactoring.guru/design-patterns/chain-of-responsibility).

Related: [Strategy](strategy.md).

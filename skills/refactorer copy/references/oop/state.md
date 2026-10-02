# State

## Use when

An object's valid operations depend on its current state, and repeated conditionals obscure transitions or allow invalid combinations. State-specific behavior and transition ownership should be explicit.

## Prefer simpler

A closed discriminated union and one transition function often fit TypeScript better than a class per state. Conventional State objects are useful when each state's behavior is substantial or state implementations actually vary.

## TypeScript example

```typescript
type Upload =
  | Readonly<{ kind: "queued" }>
  | Readonly<{ kind: "sending"; sent: number }>
  | Readonly<{ kind: "complete" }>;
type Action =
  | Readonly<{ kind: "start" }>
  | Readonly<{ kind: "progress"; sent: number }>
  | Readonly<{ kind: "finish" }>;
function transition(state: Upload, action: Action): Upload {
  if (state.kind === "queued" && action.kind === "start") {
    return { kind: "sending", sent: 0 };
  }
  if (state.kind === "sending" && action.kind === "progress") {
    return { kind: "sending", sent: action.sent };
  }
  if (state.kind === "sending" && action.kind === "finish") {
    return { kind: "complete" };
  }
  throw new Error("Invalid transition");
}
const started = transition({ kind: "queued" }, { kind: "start" });
if (transition(started, { kind: "finish" }).kind !== "complete") {
  throw new Error("Upload transition changed");
}
```

The example assumes validated progress values. It centralizes transition rules rather than eliminating all conditionals.

## Refactor and verify

Recover current transitions, including error or ignore behavior for invalid events. Replace flag combinations with meaningful variants and move transitions to one owner. Preserve external serialized formats through adaptation if required.

Test allowed and rejected transitions, repeated events, and state-specific data. A concurrent workflow also needs its existing synchronization or version checks; a state representation does not provide them.

Source: [State](https://refactoring.guru/design-patterns/state).

Related: [Strategy](strategy.md).

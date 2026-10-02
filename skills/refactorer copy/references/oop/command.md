# Command

## Use when

An operation needs an identity separate from the caller: scheduling, queuing, recording, or an explicitly defined undo capability. Distinguish describing an action from performing it.

## Prefer simpler

A callback is enough for a one-off deferred operation. A serializable command should be data plus a handler, not a closure that captures process-local objects.

## TypeScript example

```typescript
type CounterCommand = Readonly<{ kind: "add"; amount: number }>;
type Counter = Readonly<{ value: number }>;
function execute(state: Counter, command: CounterCommand): Counter {
  return { value: state.value + command.amount };
}
const pending: readonly CounterCommand[] = [
  { kind: "add", amount: 2 },
  { kind: "add", amount: 3 },
];
const result = pending.reduce(execute, { value: 0 });
if (result.value !== 5) throw new Error("Command order or handling changed");
```

## Refactor and verify

Move the request's required data into a typed command, keep the handler with the behavior's owner, and migrate producers. Preserve when validation and execution occur.

Test each command and sequences. For external effects, define existing delivery, retry, and idempotency expectations explicitly; creating a command object does not establish any delivery guarantee. Undo is a separate contract and may require a snapshot or compensation rather than an inverse operation.

Source: [Command](https://refactoring.guru/design-patterns/command).

Related: [Memento](memento.md), [Interpreter](interpreter.md).

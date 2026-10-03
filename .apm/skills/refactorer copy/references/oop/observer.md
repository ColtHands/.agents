# Observer

## Use when

Several consumers independently react to a publisher's changes, and their subscriptions have meaningful lifetimes. The publisher should not know every consumer's concrete role.

## Prefer simpler

A direct call is easier for a required single recipient. Do not turn essential sequential business steps into loosely coupled notifications merely to hide dependencies.

## TypeScript example

```typescript
type Listener<T> = (event: T) => void;
function subject<T>() {
  const listeners = new Set<Listener<T>>();
  return {
    subscribe(listener: Listener<T>): () => void {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    publish(event: T): void {
      for (const listener of [...listeners]) listener(event);
    },
  };
}
const updates = subject<number>();
const received: number[] = [];
const unsubscribe = updates.subscribe((value) => { received.push(value); });
updates.publish(1);
unsubscribe();
updates.publish(2);
if (received.join(",") !== "1") throw new Error("Subscription lifetime changed");
```

This example delivers synchronously in registration order using a snapshot of subscribers. A thrown error stops delivery. Those are explicit example semantics, not universal Observer requirements.

## Refactor and verify

Specify delivery order, reentrancy, errors, and subscription ownership before moving notifications. Return or reuse the project's disposal mechanism and release subscriptions with their owner.

Test unsubscribe, duplicate subscriptions, subscription changes during delivery, and failures according to the established contract. In-memory publication is not durable messaging and does not provide retries or exactly-once delivery.

Source: [Observer](https://refactoring.guru/design-patterns/observer).

Related: [Mediator](mediator.md).

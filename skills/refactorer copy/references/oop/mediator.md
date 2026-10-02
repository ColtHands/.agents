# Mediator

## Use when

Several peers know each other's details to coordinate an interaction. A focused coordinator can own that interaction and let each peer expose a smaller capability.

## Prefer simpler

Direct calls are clearer for a simple dependency. Avoid replacing every call with an event bus or creating one mediator that owns the entire application.

## TypeScript example

```typescript
interface SearchField { read(): string }
interface Results { show(query: string): void }
class SearchInteraction {
  constructor(
    private readonly field: SearchField,
    private readonly results: Results,
  ) {}
  submit(): void {
    this.results.show(this.field.read().trim());
  }
}
const displayed: string[] = [];
const interaction = new SearchInteraction(
  { read: () => " modules " },
  { show: (query) => { displayed.push(query); } },
);
interaction.submit();
if (displayed[0] !== "modules") throw new Error("Interaction changed");
```

## Refactor and verify

Name the specific interaction, move peer-to-peer coordination into that owner, and narrow peer contracts. Keep each participant's internal behavior with the participant.

Test ordering, relevant state transitions, and feedback loops. When async interactions exist, preserve stale-result handling and cancellation. If the mediator accumulates unrelated workflows, split by coherent interaction rather than introducing a generic message dispatcher.

Source: [Mediator](https://refactoring.guru/design-patterns/mediator).

Related: [Facade](facade.md), [Observer](observer.md).

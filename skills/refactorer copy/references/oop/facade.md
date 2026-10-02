# Facade

## Use when

Callers repeatedly coordinate several subsystem operations or learn their sequencing rules. Give the common task one useful interface and hide that coordination.

## Prefer simpler

Calling one stable function directly is usually clearer than wrapping it with the same contract. A facade should hide knowledge; it need not expose every subsystem capability.

## TypeScript example

```typescript
type RecordEntry = Readonly<{ id: string; title: string }>;
function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\\s+/).filter(Boolean);
}
function score(words: readonly string[], query: readonly string[]): number {
  return query.filter((term) => words.includes(term)).length;
}
function createSearch(records: readonly RecordEntry[]) {
  const indexed = records.map((record) => ({
    id: record.id, words: tokenize(record.title),
  }));
  return {
    find(text: string): string[] {
      const query = tokenize(text);
      return indexed
        .map((entry) => ({ id: entry.id, score: score(entry.words, query) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((entry) => entry.id);
    },
  };
}
const search = createSearch([{ id: "1", title: "Deep Modules" }]);
if (search.find("modules")[0] !== "1") throw new Error("Search changed");
```

## Refactor and verify

Extract the operation callers actually need, move sequencing and reusable preparation behind it, and remove repeated orchestration. Keep specialized internal capabilities private unless other callers need them.

Test the resulting behavior, empty cases, and ordering guarantees. This example snapshots its input; a mutable or remotely stored index needs an explicit freshness contract. Keep the facade cohesive so it does not become a new god object.

Source: [Facade](https://refactoring.guru/design-patterns/facade).

Related: [deep modules](../deep-modules.md), [Mediator](mediator.md), [Law of Demeter](../principles/law-of-demeter.md).

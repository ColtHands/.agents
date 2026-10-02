# Memento

## Use when

An object must restore an earlier state while keeping snapshot construction and restoration under its own control. The history owner should not depend on mutable implementation details.

## Prefer simpler

Immutable state values can themselves be snapshots. A reversible command may be smaller when a well-defined inverse exists. Neither mechanism automatically undoes external effects.

## TypeScript example

```typescript
type Snapshot = Readonly<{ text: string; cursor: number }>;
class Editor {
  private text = "";
  private cursor = 0;
  insert(value: string): void {
    this.text = this.text.slice(0, this.cursor) + value + this.text.slice(this.cursor);
    this.cursor += value.length;
  }
  save(): Snapshot {
    return Object.freeze({ text: this.text, cursor: this.cursor });
  }
  restore(snapshot: Snapshot): void {
    this.text = snapshot.text;
    this.cursor = snapshot.cursor;
  }
  content(): string { return this.text; }
}
const editor = new Editor();
editor.insert("A");
const saved = editor.save();
editor.insert("B");
editor.restore(saved);
if (editor.content() !== "A") throw new Error("Restore failed");
```

The snapshot is transparent here for brevity; the contract assumes snapshots produced by this editor. A module-private or opaque token can restrict access when the representation must remain hidden.

## Refactor and verify

Identify the state needed for restoration, capture it independently of later mutations, and keep restore invariants together. Define history retention and snapshot compatibility when persistence is involved.

Test multiple edits, restore, subsequent edits, and isolation of nested data. Avoid accidentally retaining large object graphs. Restoring memory does not reverse a sent message or a committed payment.

Source: [Memento](https://refactoring.guru/design-patterns/memento).

Related: [Command](command.md), [Prototype](prototype.md).

# Builder

## Use when

Construction has meaningful stages, optional assembled parts, or several reusable recipes. A builder can keep an incomplete representation private and publish only a valid result.

## Prefer simpler

A typed options object plus a constructor is usually enough for independent fields. Fluent setters alone do not justify an extra lifecycle or a director class.

## TypeScript example

```typescript
type Message = Readonly<{ subject: string; paragraphs: readonly string[] }>;
class MessageBuilder {
  private readonly paragraphs: string[] = [];
  constructor(private readonly subject: string) {}
  paragraph(text: string): this {
    this.paragraphs.push(text);
    return this;
  }
  build(): Message {
    if (this.subject.trim() === "" || this.paragraphs.length === 0) {
      throw new Error("A subject and paragraph are required");
    }
    return { subject: this.subject, paragraphs: [...this.paragraphs] };
  }
}
const builder = new MessageBuilder("Update").paragraph("First");
const first = builder.build();
builder.paragraph("Second");
if (first.paragraphs.length !== 1 || builder.build().paragraphs.length !== 2) {
  throw new Error("Built messages share builder state");
}
```

## Refactor and verify

Move assembly state and construction invariants together, then expose the few meaningful construction operations. Preserve defaults and validation timing where observable. Choose and document whether a builder is reusable or single-use.

Check incomplete builds, repeated builds, and mutation after building. Copy or otherwise isolate nested mutable data as the contract requires. Avoid elaborate type-state generics unless callers benefit from enforcing construction order at compile time.

Source: [Builder](https://refactoring.guru/design-patterns/builder).

Related: [KISS](../principles/kiss.md).

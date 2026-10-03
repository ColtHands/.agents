# Proxy

## Use when

A stand-in controls access or lifecycle while exposing the same capability: lazy creation, remote access, or an established access policy. The added behavior concerns access to the underlying operation.

## Prefer simpler

A function closure may be enough. The GoF pattern does not require the language's dynamic `Proxy` object. Transparent-looking caches and remote proxies can hide significant semantic changes.

## TypeScript example

```typescript
interface Dictionary { lookup(word: string): string | undefined }
class LazyDictionary implements Dictionary {
  private delegate: Dictionary | undefined;
  constructor(private readonly create: () => Dictionary) {}
  lookup(word: string): string | undefined {
    this.delegate ??= this.create();
    return this.delegate.lookup(word);
  }
}
let creations = 0;
const dictionary = new LazyDictionary(() => {
  creations += 1;
  const words = new Map([["seam", "A substitution point"]]);
  return { lookup: (word) => words.get(word) };
});
dictionary.lookup("seam");
dictionary.lookup("missing");
if (creations !== 1) throw new Error("Lazy initialization changed");
```

## Refactor and verify

Define which access behavior belongs in the stand-in and preserve the underlying contract. Keep creation, failure, and disposal ownership explicit.

Test deferred initialization, repeated access, creation failures, and cleanup where applicable. Async initialization needs a policy for concurrent callers and failed attempts. A cache additionally needs freshness and key semantics; matching a method signature does not prove substitutability.

Source: [Proxy](https://refactoring.guru/design-patterns/proxy).

Related: [Decorator](decorator.md), [Singleton](singleton.md).

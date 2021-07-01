# `outvariant`

## Why?

- Type-safe implementation of invariant. Asserts the given predicate expression so it's treated as non-nullable after the `invariant` call:

```ts
// Regular "invariant":
invariant(user, 'Failed to fetch')
user?.firstName // "user" is possibly undefined

// The glorious "outvariant":
invariant(user, 'Failed to fetch')
user.firstName // OK, "user" exists at this point
```

- Positionals support.

```js
invariant(predicate, 'Expected %s but got %s', 'one', false)
```

## Getting started

```sh
npm install outvariant
# or
yarn add outvariant
```

```js
import { invariant } from 'outvariant'

invariant(user, 'Failed to load: expected user, but got %o', user)
```

// @ts-ignore
import { invariant, InvariantError } from './invariant.ts'

it('does not throw any exceptions if the predicate is truthy', () => {
  expect(() => invariant(1, 'Error')).not.toThrow()
  expect(() => invariant('value', 'Error')).not.toThrow()
  expect(() => invariant(() => {}, 'Error')).not.toThrow()
  expect(() => invariant(true, 'Error')).not.toThrow()
})

it('throws an exception if the predicate is falsy', () => {
  expect(() => invariant(false, 'Error message')).toThrow(
    new InvariantError('Error message')
  )
  expect(() => invariant(null, 'Error message')).toThrow(
    new InvariantError('Error message')
  )
  expect(() => invariant(undefined, 'Error message')).toThrow(
    new InvariantError('Error message')
  )
})

it('supports positional values in the error message', () => {
  // Strings.
  expect(() => invariant(false, 'Cannot %s the %s', 'fetch', 'user')).toThrow(
    new InvariantError('Cannot fetch the user')
  )

  // Numbers.
  expect(() => invariant(false, 'Expected %d apples', 3)).toThrow(
    new InvariantError('Expected 3 apples')
  )

  // Booleans.
  expect(() => invariant(false, 'Expected %s but got %s', true, false)).toThrow(
    new InvariantError('Expected true but got false')
  )

  // Objects.
  expect(() =>
    invariant(false, 'Cannot create user: %o', { name: 'John' })
  ).toThrow(new InvariantError('Cannot create user: {"name":"John"}'))
})

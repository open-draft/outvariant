import { InvariantError, invariant } from './invariant'

it('does not throw any exceptions if the predicate is truthy', () => {
  expect(() => invariant(1, 'Error')).not.toThrow()
  expect(() => invariant('value', 'Error')).not.toThrow()
  expect(() => invariant(() => {}, 'Error')).not.toThrow()
  expect(() => invariant(true, 'Error')).not.toThrow()
})

it('throws an exception if the predicate is falsy', () => {
  expect(() => {
    let value: string | undefined
    invariant(value, 'Error message')
    value.toUpperCase()
  }).toThrow(new InvariantError('Error message'))

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
  ).toThrow(new InvariantError(`Cannot create user: {"name":"John"}`))
})

it('supports polymorphic error class using the "as" method', () => {
  class CustomError extends Error {
    name = 'CustomError'

    constructor(public readonly message: string) {
      super(message)
      Object.setPrototypeOf(this, CustomError.prototype)
    }
  }

  try {
    let value: number | undefined
    invariant.as(CustomError, value, 'Hello %s', 'world')
    value.toFixed()
  } catch (error) {
    expect(error).toBeInstanceOf(CustomError)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual('Hello world')
  }
})

it('supports polymorphic error class with additional arguments', () => {
  class NetworkError extends Error {
    constructor(
      public readonly errorCode: number,
      public readonly message: string
    ) {
      super(message)
      Object.setPrototypeOf(this, NetworkError.prototype)
    }
  }

  try {
    invariant.as(
      (message) => new NetworkError(230, message),
      false,
      'Failed to handle %s',
      'http://localhost:3000'
    )
  } catch (error) {
    expect(error).toBeInstanceOf(NetworkError)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toEqual('Failed to handle http://localhost:3000')
  }
})

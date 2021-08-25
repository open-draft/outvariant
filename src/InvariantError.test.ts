import { InvariantError } from './invariant'

it('creates an "Invariant Violation" error instance', () => {
  const error = new InvariantError('Custom message')
  expect(error.name).toEqual('Invariant Violation')
})

it('sets the error message on the error instance', () => {
  const error = new InvariantError('Custom message')
  expect(error.message).toEqual('Custom message')
})

it('removes internal stack trace from the error stack', () => {
  const error = new InvariantError('Custom message')
  const { stack } = error

  expect(stack).toBeDefined()
  expect(stack).toMatch(/^Invariant Violation: Custom message/)
  expect(stack).not.toEqual(expect.stringContaining('outvariant/src'))
})

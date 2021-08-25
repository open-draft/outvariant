import { format } from './format'

const STACK_FRAMES_TO_IGNORE = 2

export class InvariantError extends Error {
  constructor(message: string, ...positionals: any[]) {
    super(message)
    this.name = 'Invariant Violation'
    this.message = format(message, ...positionals)

    if (this.stack) {
      const nextStack = this.stack.split('\n')
      nextStack.splice(1, STACK_FRAMES_TO_IGNORE)
      this.stack = nextStack.join('\n')
    }
  }
}

export function invariant<T>(
  predicate: T,
  message: string,
  ...positionals: any[]
): asserts predicate {
  if (!predicate) {
    throw new InvariantError(message, ...positionals)
  }
}

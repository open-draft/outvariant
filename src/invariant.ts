import { format } from './format'

const STACK_FRAMES_TO_IGNORE = 2

/**
 * Remove the "outvariant" package trace from the given error.
 * This scopes down the error stack to the relevant parts
 * when used in other applications.
 */
function cleanErrorStack(error: Error): void {
  if (!error.stack) {
    return
  }

  const nextStack = error.stack.split('\n')
  nextStack.splice(1, STACK_FRAMES_TO_IGNORE)
  error.stack = nextStack.join('\n')
}

export class InvariantError extends Error {
  name = 'Invariant Violation'

  constructor(public readonly message: string, ...positionals: any[]) {
    super(message)
    this.message = format(message, ...positionals)
    cleanErrorStack(this)
  }
}

export interface CustomErrorConstructor {
  new (message: string): Error
}

export interface CustomErrorFactory {
  (message: string): Error
}

export type CustomError = CustomErrorConstructor | CustomErrorFactory

type Invariant = {
  (
    predicate: unknown,
    message: string,
    ...positionals: any[]
  ): asserts predicate

  as(
    ErrorConstructor: CustomError,
    predicate: unknown,
    message: string,
    ...positionals: unknown[]
  ): asserts predicate
}

export const invariant: Invariant = (
  predicate,
  message,
  ...positionals
): asserts predicate => {
  if (!predicate) {
    throw new InvariantError(message, ...positionals)
  }
}

invariant.as = (ErrorConstructor, predicate, message, ...positionals) => {
  if (!predicate) {
    const formatMessage = positionals.length === 0 ? message : format(message, positionals);
    let error: Error;

    try {
      error = Reflect.construct(ErrorConstructor as CustomErrorConstructor, [formatMessage]);
    } catch(err) {
      error = (ErrorConstructor as CustomErrorFactory)(formatMessage);
    }

    throw error
  }
}

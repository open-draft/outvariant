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

export interface InvariantFunction {
  (
    predicate: unknown,
    message: string,
    ...positionals: unknown[]
  ): asserts predicate
}

export interface CustomErrorConstructor {
  new (message: string): Error
}

export interface CustomErrorFactory {
  (message: string): Error
}

export type CustomError = CustomErrorConstructor | CustomErrorFactory

export function createInvariantWith(
  ErrorConstructor: CustomError
): InvariantFunction {
  const invariant: InvariantFunction = (predicate, message, ...positionals) => {
    if (!predicate) {
      const resolvedMessage = format(message, ...positionals)
      const isConstructor = !!ErrorConstructor.prototype.name

      const error: Error = isConstructor
        ? // @ts-expect-error Construct/call signature too dynamic.
          new ErrorConstructor(resolvedMessage)
        : // @ts-expect-error Construct/call signature too dynamic.
          ErrorConstructor(resolvedMessage)

      cleanErrorStack(error)

      throw error
    }
  }

  return invariant
}

function polymorphicInvariant(
  ErrorClass: CustomError,
  ...args: Parameters<InvariantFunction>
): ReturnType<InvariantFunction> {
  return createInvariantWith(ErrorClass)(...args)
}

export const invariant = createInvariantWith(
  InvariantError
) as InvariantFunction & {
  as: typeof polymorphicInvariant
}

invariant.as = polymorphicInvariant

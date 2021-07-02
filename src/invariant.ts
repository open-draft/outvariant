const STACK_FRAMES_TO_IGNORE = 2

export function interpolate(message: string, ...positionals: any[]): string {
  let index = 0

  return message.replace(/%[s|d|o]/g, (match) => {
    const value = positionals[index++] ?? match
    return typeof value === 'object' ? JSON.stringify(value) : value
  })
}

export class InvariantError extends Error {
  constructor(message: string, ...positionals: any[]) {
    super(message)
    this.name = 'Invariant Violation'
    this.message = interpolate(message, ...positionals)

    if (this.stack) {
      const prevStack = this.stack
      this.stack = prevStack
        .split('\n')
        .slice(STACK_FRAMES_TO_IGNORE)
        .join('\n')
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

export class InvariantError extends Error {
  constructor(message: string, ...positionals: any[]) {
    super(message)
    this.name = 'Invariant Violation'
    this.message = this.formatMessage(message, positionals)
  }

  private formatMessage(message: string, positionals: any[]): string {
    let index = -1

    return message.replace(/%[s|d|o]/g, () => {
      const value = positionals[index++]
      return typeof value === 'object' ? JSON.stringify(value) : value
    })
  }
}

export function invariant<T>(
  predicate: T,
  message: string,
  ...positionals: any[]
): asserts predicate {
  if (!predicate) {
    throw new InvariantError(message, positionals)
  }
}

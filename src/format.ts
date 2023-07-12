const POSITIONALS_EXP = /(%?)(%([sdijo]))/g

function serializePositional(positional: any, flag: string): any {
  switch (flag) {
    // Strings.
    case 's':
      return positional

    // Digits.
    case 'd':
    case 'i':
      return Number(positional)

    // JSON.
    case 'j':
      return JSON.stringify(positional)

    // Objects.
    case 'o': {
      // Preserve stings to prevent extra quotes around them.
      if (typeof positional === 'string') {
        return positional
      }

      const json = JSON.stringify(positional)

      // If the positional isn't serializable, return it as-is.
      if (json === '{}' || json === '[]' || /^\[object .+?\]$/.test(json)) {
        return positional
      }

      return json
    }
  }
}

export function format(message: string, ...positionals: any[]): string {
  if (positionals.length === 0) {
    return message
  }

  let positionalIndex = 0
  let formattedMessage = message.replace(
    POSITIONALS_EXP,
    (match, isEscaped, _, flag) => {
      const positional = positionals[positionalIndex]
      const value = serializePositional(positional, flag)

      if (!isEscaped) {
        positionalIndex++
        return value
      }

      return match
    }
  )

  // Append unresolved positionals to string as-is.
  if (positionalIndex < positionals.length) {
    formattedMessage += ` ${positionals.slice(positionalIndex).join(' ')}`
  }

  formattedMessage = formattedMessage.replace(/%{2,2}/g, '%')

  return formattedMessage
}

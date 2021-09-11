import { format } from './format'

it('does not format a string without positionals', () => {
  expect(format('hello world')).toEqual('hello world')
  expect(format('%s hello %d %o world %j')).toEqual('%s hello %d %o world %j')
})

it('formats a single string (%s) positional', () => {
  expect(format('hello %s', 'world')).toEqual('hello world')
})

it('formats multiple string (%s) positionals', () => {
  expect(format('%s, my name is %s', 'Amy', 'Jake')).toEqual(
    'Amy, my name is Jake'
  )
  expect(format('%s:%s', '12', '34')).toEqual('12:34')
})

it('formats escaped string (%s)', () => {
  expect(format('%%s', 'hello')).toEqual('%s hello')
})

it('formats digit (%d) positionals', () => {
  expect(format('%d', 32)).toEqual('32')
  expect(format('I am %d years old', 18)).toEqual('I am 18 years old')
})

it('replaces invalid digits with NaN when formatting %d', () => {
  expect(format('%d', 'word')).toEqual('NaN')
  expect(format('I am %d years old', 'seven')).toEqual('I am NaN years old')
})

it('formats a JSON string (%j)', () => {
  expect(format('%j', 'hello')).toEqual(`"hello"`)
})

it('formats a JSON Array (%j)', () => {
  expect(format('%j', [1, 2, 3])).toEqual('[1,2,3]')
})

it('formats object (%o) positionals', () => {
  expect(format('%o', { id: 1, name: 'Kate' })).toEqual(
    `{"id":1,"name":"Kate"}`
  )
})

it('formats a string given as %o', () => {
  expect(format('%o', 'hello')).toEqual('hello')
})

it('formats an Error given as %o', () => {
  expect(format('%o', new Error('Custom error message'))).toEqual(
    'Error: Custom error message'
  )
})

it('formats an Array given as %o', () => {
  expect(format('%o', [1, 2, 3])).toEqual('[1,2,3]')
})

it('appends unresolved positionals to the string', () => {
  expect(format('hello %s', 'world', 'Jake', 32)).toEqual('hello world Jake 32')
})

it('respects new line characters in plain strings', () => {
  expect(format('Hello\n%s\n\n%s', 'My', 'World')).toEqual('Hello\nMy\n\nWorld')
})

it('respects new lines in template literals', () => {
  expect(
    format(
      `\
Hello

%s

%s`,
      'My',
      'World'
    )
  ).toEqual('Hello\n\nMy\n\nWorld')
})

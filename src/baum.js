// @flow
const { and, is, not, equals, length } = require('ramda')
const a = console.assert

// t
type T = { name: 't' }
const t = { name: 't' }
const isT = (x) => equals(x, t)

// f
type F = { name: 'f' }
const f = { name: 'f' }
const isF = (x) => equals(x, f)

type Bool = T | F

// From now on - no more JS booleans!

type Atom = { name: string }

// atom - isAtom
const isAtom = (a: Atom):Bool => (
  and(
    is(Object)(a),
    is(String)(a.name)) ? t : f)

type Cons = [Atom, (Atom | Cons)]

// cons - isCons
const isCons = (c: Cons): Bool => (
  and(is(Array)(c),
      equals(length(c),
             2)) ? t : f)

a(isT(isCons([{ name: 'some atom' },
              { name: 't' }])))

// quote - identity
const quote = (x) => x

// Equality check
const eq = (x, y) => {
  a(isAtom(x))
  a(isAtom(y))
  return (equals(x, y) ? t : f)}

a(isT(
  eq(
    t,
    t)))

a(isF(
  eq(
    { name: 'some rando atom' },
    { name: 'some other atom' })))

// konstigt - cons

const cons = (a, list) => [a, list]

a(equals([{ name: 'a' },
          [{ name: 'b' },
           { name: 'c' }]],
         cons({ name: 'a' },
              cons({ name: 'b' },
                   { name: 'c'}))))

const bif = (condition: Bool, then, otherwise) => isT(condition) ? then : otherwise

a(
  equals(
    { name: 'it works' },
    bif(
      { name: 't' },
      { name: 'it works' },
      { name: 'not going to happen' })))


a(
  equals(
    { name: 'falsy path' },
    bif(
      { name: 'f' },
      { name: 'path not walked' },
      { name: 'falsy path' })))

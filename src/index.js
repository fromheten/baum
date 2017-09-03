const { equals, and, path, not, length, reduce, splitEvery } = require('ramda')
const a = console.assert

// Util functions

function isObject(o) { return and(not(Array.isArray(o)),
                                  (o instanceof Object)) }
a(isObject({key: "val"}), "Object is object")
a(not(isObject([])), "Array is not object")

function isString(s) { return (typeof s === 'string') }
a(isString("hello!"), "A string is a string")
a(not(isString(123)), "Number is not string")
a(not(isString({wow: "cool"})), "Object is not string")

const isTrue = equals({ name: 't' })
a(isTrue({ name: 't' }), "(quote t) is t")
a(not(isTrue({ name: 'a' })), "(quote a) is not t")

// Interpreter implementation

// Atom: {name: 'a'}
// Cell: [Atom, Atom]

function quote(x) { return x }

a(equals(quote({ name: 'a' }), { name: 'a' }))

// Should be called atom? or isAtom, but I forgive McCarthy
function atom(x) {
  return (and(
    isObject(x),
    isString(path(['name'], x))
  )) ? { name: 't' } : { name: 'f' }}

a(equals(
  { name: 't' },
  atom({ name: "atom" })))

a(equals(
  { name: 'f' },
  atom([{ name: 't' }, { name: 't' }])))

function eq(a, b) { return equals(a, b) }

function car(consCell) {
  a(length(consCell) === 2)
  a(and(atom(consCell[0]),
        atom(consCell[1]))) // this is a bug, has to be list or atom (+ (+ 1 1) 1)
  return consCell[0]}

function cdr(consCell) {
  a(length(consCell) === 2)
  a(and(atom(consCell[0]),
        atom(consCell[1]))) // this has the same bug
  return consCell[1]}

function cons(a, b) {
  return [a, b]}

a(eq(car(cons({ name: 'a'}, { name: 'b'})),
     cdr(cons({ name: 'b'}, { name: 'a'}))))

/* (cond
 *   ((eq (quote a) (quote b)) (quote first))
 *   ((atom (quote a)) (quote second)))
 * => { name: 'second' }
 */

/* (if (quote t)
 *   (quote a)
 *   (quote b))
 * => { name: 'a' }
 */

function lispIF (condition, then, otherwise) {
  return isTrue(condition) ? then : otherwise}

a(equals(lispIF(
  { name: 'quote' },
  { name: 'not-gonna-happen' },
  { name: 'very-likely' })),
            { name: 'very-likely' })
a(equals({ name: 'very-likely' },
         lispIF(
           { name: 't' },
           { name: 'very-likely' },
           { name: 'not-gonna-happen' })),
  "if with non-true value is false")

function read (stringInterchangeFormat) {
  if(equals("0;", stringInterchangeFormat.slice(0, 2))) {
    return JSON.parse(stringInterchangeFormat.slice(2))
  } else {
    return [{ name: 'Version Error' }]
  }}

a(
  equals(
    read('0;{"name":"t"}'),
    { name: 't' }))

function toString(program) {
  return "0;" + JSON.stringify(program)}

const keccak = require('keccakjs')
const btoa = require('btoa')
// String -> Base64ofSha3
function toHash(string) {
  // Generate 512-bit digest.
  var hash = new keccak() // uses 512 bits by default
  hash.update(string)
  return btoa(hash.digest())}

a(equals(
  toHash("baum"),
  '25cU/Ixg/HMmH7/+63jmfdQVHkofcv74M10MmHyYFD+0iBjpI7BmXRppYRosT8FmwytSic231UurQXTA93CU6g=='))

a(equals(
  toHash(toString({ name: 't' })),
  '2Vi0UPBOGvJ8oofANSwx0jh5l8J/yLyDTeMBonsvpU3+oxUPuY0FNklF2JvVQ9HWlTsTkuho7nUCvQrxkbD78w=='))

//a(equals(read(), [{ name: 'quote' }, { name: 'a' }]),
//   'The text interchange format of Baum 1 is the AST as an S-Expression')

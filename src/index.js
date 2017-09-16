const {
  equals,
  and,
  path,
  not,
  length,
  reduce,
  splitEvery,
  or,
  is
} = require('ramda')
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

function isConsCell(x){
  return and(
    is(Array)(x),
    equals(
      length(x),
      2))}

function isAtomOrCons (x) {
  // { name: 't' } if x is atom or cons
  return (or(atom(x), isConsCell(x))) ? { name: 't' } : { name: 'f' } }

// Interpreter implementation

// Atom: { name: 'a' }
// Cell: [Atom, Atom]

function quote(x) { return x }

a(equals(quote({ name: 'a' }), { name: 'a' }))

// Should be called atom? or isAtom, but I forgive McCarthy
function atom(x) {
  return (and(
    isObject(x),
    isString(path(['name'], x))
  )) ? { name: 't' } : { name: 'f' }}

const isAtom = atom

a(equals(
  { name: 't' },
  atom({ name: "atom" })))

a(equals(
  { name: 'f' },
  atom([{ name: 't' }, { name: 't' }])))

function eq(a, b) { return { name: (equals(a, b) ? 't' : 'f') } }

function car(consCell) {
  a(isConsCell(consCell),
    `car type error: ${JSON.stringify(consCell)} not cons cell`)
  return consCell[0]}

const first = car

function cdr(consCell) {
  a(length(consCell) === 2)
  a(and(atom(consCell[0]),
        atom(consCell[1]))) // this has the same bug
  return consCell[1]}

function cons(a, b) {
  return [a, b]}

const jsbool = (lispbool) => {
  if(equals(lispbool, { name: 't' })) {
    return true }
  else if (equals(lispbool, { name: 'f' })) {
      return false }
  else {
      a(false, `jsbool type error: ${lispbool} not a lisp bool`)}}

a(jsbool(
  eq(
    car(cons({ name: 'a'}, { name: 'b'})),
    cdr(cons({ name: 'b'}, { name: 'a'})))))

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

function isLispBool(atom) { return (or(equals(atom, { name: 't' }),
                                       equals(atom, { name: 'f' })))}

function lispIF (condition, then, otherwise) {
  a(isLispBool(atom), `lispIF Type Error: ${JSON.stringify(condition)} not a LispBool`)
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

a(read(
  toString(
    read(
      toString([{ name: 'quote' },
                { 'name': 'it works' }])))))

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


function caar (consCell) {
  a(isConsCell(consCell),
    `caar type error: ${consCell} is not a ConsCell`)
  return (car(car(consCell)))}

// http://clhs.lisp.se/Body/f_car_c.htm
// (cadar x) = (car (cdr (car x)))
function cadar(consCell) {
  a(isConsCell(consCell),
    `cadar type error: ${consCell} is not a ConsCell`)
  return car(cdr(car(consCell)))}

// util baum_assoc
function b_get (k, associativeArray) {
  return (lispIF(
    (eq(
      caar(
        associativeArray),
      k)),
    (cadar(
      associativeArray)),
    (b_get(
      k,
      cdr(
        associativeArray)))))}
const b_assoc = b_get

a(equals(b_get({ name: 'x' },
               [[ { name: 'x' }, { name: 'a' }],
                [ { name: 'y' }, { name: 'b' }]]),
         { name: 'a' }),
  'get/assoc error')

/* a(equals(
 *   baum_assoc(
 *     quote(
 *       { name: 'x' }),
 *     [[{ name: 'x' },
 *       { name: 'a' }]]),
 *   { name: 'a' }),
 *   "(assoc 'x '((x a) (y b))) ;;=> a")*/

function nil() { return { name: 'nil',
                          type: 'nil' }}

// Baum Eval
function beval(e, a) {
  lispIF(
    (isAtom(e),
     (b_assoc(e, a))))}

a(!!car)

a(equals(
  beval({ name: 'x' },
        [
          [{ name: 'x' },
           { name: 'a' }],
          nil()
        ]
  ),
  { name: 'a' }),
  "(eval 'x '((x a))) ;; => a")

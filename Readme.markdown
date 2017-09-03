# Baum - experimental version

Baum is a programming environment.

A Baum program is represented as a tree.

A tree can be stored in a text interchange format, such as JSON or S-Expressions.

Any program can be universally identified by the `hash(program)`.

When every function and program (program tree node) is universally addressable new possibilities open up.

This program is the interpreter, that evaluates a baum program.

For the very first version, it is implemented in Javascript. When the protocol for program interchange format (currently JSON, possibly S-expressions in the future) and the format of the hashes are set, I will re-write the features as a small C library. Then it will be easy to integrate in other platforms, and compile to JS via Emscripten.

## Name
Baum means tree in German. This is a thank you to the German people who have hosted me for many years! Geile Scheisse ;-).

## License
[GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.en.html). Subject to change in later versions.

# Parsley LSP

## Functionality

This Language Server works for parsley files, which should have the `.ply` extension. It has the following language features:

- Diagnostics, regenerated on each file change (save)
- Linking to external files
- Syntax highlighting for better development experience
- Code Completion for NonTerminals, both those in standard library, and those defined by the user

## Features

It is necessary before using this extension, to have the parsley interpreter installed on your machine. This can easily be found [here](https://github.com/SRI-CSL/parsley-lang). Install this using the provided instructions, and then use the `parsley.path::string` setting to set where the executable can be found on your machine.

## Contributor

Benjamin Cape '22

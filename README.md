# Parsley LSP

## Functionality

This Language Server works for parsley files. It has the following language features:

- Diagnostics regenerated on each file change or configuration change
- Linking to external files

## Structure

```
.
├── client // Language Client
│   ├── src
│   │   ├── test // End to End tests for Language Client / Server
│   │   └── extension.ts // Language Client entry point
├── package.json // The extension manifest.
└── server // Language Server
    └── src
        └── server.ts // Language Server entry point
```

## Running the Sample

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open a parsley document, potentially one of the examples from the [parsley](https://github.com/SRI-CSL/parsley-lang) repo.
- Make an error in the file and see the output error message

## Architect

Benjamin Cape '22

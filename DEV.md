# Development Help

So you're interested in building onto the `parsley-lsp`? Great! Here are some tips and pointers for how to best develop with the provided framework!

## Requirements

First clone this repository! If you don't have VSCode you'll also need to install that.

To being development you will need `node` installed. The preferred way to install is through homebrew.

Then, install all the local packages for the server, under the `/server` directory.

You should also installed the dependencies in the `/client` directory.

Then, you can start playing around! Most of the logic can be found in the `server/src/parsley`. Each sub-directory from there should be relatively clear as to what it contains, i.e. `typeChecker`, `codeCompletion`, `definition`.

To install your locally developed extension, press `f5` while VSCode is open. You should see a new VSCode window open, that window will have the development version of the extension installed!

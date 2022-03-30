import { Range } from "vscode-languageserver";

export const IMPORT_PREFIX = "use ";

// Ghost range is a range that is used to represent a an error in a file that has unknown location
// (defaults to the start of the document)
export const GHOST_RANGE: Range = {
  start: {
    character: 0,
    line: 0,
  },
  end: {
    character: 1,
    line: 0,
  },
};

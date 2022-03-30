import { Range } from "vscode-languageserver";

// Type that represents an import of a file
export type Import = {
  // The file that is imported
  fileName: string;
  // The Range of the import statement
  range: Range;
};

export type NonTerminal = {
  ident: string;
  uri: string;
  range: Range;
};

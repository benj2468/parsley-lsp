import { Range } from "vscode-languageserver";

export type Imports = {
  [key: string]: Range;
};

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

export function parseImports(text: string): Imports {
  const res: Imports = {};

  text.split("\n").forEach((lineText, line) => {
    if (lineText.startsWith("use ")) {
      const importIdent = lineText.split("use ")[1];
      const range: Range = {
        start: {
          line,
          character: 0,
        },
        end: {
          line,
          character: lineText.length,
        },
      };
      res[importIdent] = range;
    }
  });

  return res;
}

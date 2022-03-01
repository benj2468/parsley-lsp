import { Position, Range } from "vscode-languageserver";

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

export function positionInRange(position: Position, range: Range): boolean {
  if (position.line < range.start.line || position.line > range.end.line)
    return false;

  if (
    position.character < range.start.character &&
    range.start.line == position.line
  )
    return false;
  if (
    position.character > range.end.character &&
    range.end.line == position.line
  )
    return false;

  return true;
}

export function parseImports(text: string, lineBase = 0): Imports {
  const res: Imports = {};

  text.split("\n").forEach((lineText, line) => {
    if (lineText.startsWith("use ")) {
      const importIdent = lineText.split("use ")[1];
      const range: Range = {
        start: {
          line: line + lineBase,
          character: 4,
        },
        end: {
          line: line + lineBase,
          character: lineText.length,
        },
      };
      res[importIdent] = range;
    }
  });

  return res;
}

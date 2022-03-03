import { Position, Range } from "vscode-languageserver";

export type Import = {
  fileName: string;
  range: Range;
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

export function parseImports(text: string, lineBase = 0): Import[] {
  const res: Import[] = [];

  text.split("\n").forEach((lineText, line) => {
    if (lineText.startsWith("use ")) {
      const fileName = lineText.split("use ")[1];
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
      res.push({ fileName, range });
    }
  });

  return res;
}

export type NonTerminal = {
  ident: string;
  uri: string;
  range: Range;
};

export function didSelect(
  line: string,
  text: string,
  position: Position
): boolean {
  const idx = line.indexOf(text);
  console.log(
    line,
    text,
    idx,
    position.character,
    idx <= position.character,
    idx + text.length >= position.character
  );
  return idx <= position.character && idx + text.length >= position.character;
}

export function parseNonTerminals(
  files: { [x: string]: string },
  lineBase = 0
): NonTerminal[] {
  const res: NonTerminal[] = [];

  Object.entries(files).forEach(([uri, text]) => {
    text.split("\n").forEach((lineText, line) => {
      if (lineText.trim().match(/^[A-Z]\w*/)) {
        const ident = lineText.trim().split(" ")[0];
        const character = lineText.indexOf(ident);
        const range: Range = {
          start: {
            line: line + lineBase,
            character,
          },
          end: {
            line: line + lineBase,
            character: character + ident.length,
          },
        };
        res.push({ ident, uri, range });
      }
    });
  });

  return res;
}

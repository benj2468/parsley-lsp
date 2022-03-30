import { Position, Range } from "vscode-languageserver";
import { IMPORT_PREFIX } from "./constants";
import { Import, NonTerminal } from "./types";

// Checks if a position is inside a range
export function positionInRange(position: Position, range: Range): boolean {
  return (
    !positionAfterRange(position, range) &&
    !positionBeforeRange(position, range)
  );
}

// Checks if a position is after a range
export function positionAfterRange(position: Position, range: Range): boolean {
  return (
    range.end.line < position.line ||
    (range.end.line == position.line &&
      range.end.character < position.character)
  );
}

export function positionBeforeRange(position: Position, range: Range): boolean {
  return (
    range.start.line > position.line ||
    (range.start.line == position.line &&
      range.start.character > position.character)
  );
}

// Parses a string and returns a list of imports that are in that string.
export function parseImports(text: string, lineBase = 0): Import[] {
  const res: Import[] = [];

  text.split("\n").forEach((lineText, line) => {
    if (lineText.startsWith(IMPORT_PREFIX)) {
      const fileName = lineText.split(IMPORT_PREFIX)[1];
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

// Checks whether the user selected the specific text in the line, given the position they clicked
export function didSelect(
  line: string,
  text: string,
  position: Position
): boolean {
  const idx = line.indexOf(text);

  return idx <= position.character && idx + text.length >= position.character;
}

// Parses the non terminals in a set of files
export function parseNonTerminals(
  // Maps file uri to the text of the file
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

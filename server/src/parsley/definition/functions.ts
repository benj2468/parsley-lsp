import {
  Location,
  DefinitionParams,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as path from "path";
import * as utils from "../utils";
import { GHOST_RANGE } from "../utils";
import * as fs from "fs";

export function handler(documents: TextDocuments<TextDocument>) {
  return ({ textDocument, position }: DefinitionParams): Location[] => {
    const doc = documents.get(textDocument.uri);
    if (!doc) {
      return [];
    }
    const lineText =
      doc.getText({
        start: {
          line: position.line,
          character: 0,
        },
        end: {
          line: position.line,
          character: Infinity,
        },
      }) || "";

    const res: Location[] = [];
    const imports = utils.parseImports(lineText, position.line);
    imports
      .filter(({ range }) => utils.positionInRange(position, range))
      .forEach(({ fileName }) => {
        console.log(fileName);
        const uri = path.join(
          path.dirname(textDocument.uri),
          `${fileName}.ply`
        );
        res.push({
          range: GHOST_RANGE,
          uri,
        });
      });

    const files = utils.parseImports(doc.getText()).reduce(
      (res, { fileName }) => {
        const uri = path.join(
          path.dirname(textDocument.uri),
          `${fileName}.ply`
        );
        const doc = fs.readFileSync(uri.slice(5), "utf8");
        res[uri] = doc;
        return res;
      },
      { [doc.uri]: doc.getText() }
    );

    utils
      .parseNonTerminals(files)
      .filter(({ ident }) => utils.didSelect(lineText, ident, position))
      .forEach(({ range, uri }) => {
        res.push({
          range,
          uri,
        });
      });

    return res;
  };
}

import {
  Location,
  DefinitionParams,
  TextDocuments,
  TextDocumentIdentifier,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as path from "path";
import * as utils from "../utils";
import { GHOST_RANGE } from "../utils/constants";
import * as fs from "fs";

// Helper to build all the files and get their texts
export function buildAllFiles(
  documents: TextDocuments<TextDocument>,
  currentDoc: TextDocumentIdentifier
): { [x: string]: string } {
  const doc = documents.get(currentDoc.uri);
  if (!doc) {
    return {};
  }

  return utils.parseImports(doc.getText()).reduce(
    (res, { fileName }) => {
      const uri = path.join(path.dirname(currentDoc.uri), `${fileName}.ply`);
      const doc = fs.readFileSync(uri.slice(5), "utf8");
      res[uri] = doc;
      return res;
    },
    { [doc.uri]: doc.getText() }
  );
}

// Main handler for definition requests
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

    const files = buildAllFiles(documents, textDocument);

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

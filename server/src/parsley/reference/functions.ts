import {
  Location,
  DefinitionParams,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import * as path from "path";
import * as utils from "../utils";

export const foo = () => {
  console.log("bar");
};

export function goToFile(documents: TextDocuments<TextDocument>) {
  return ({ textDocument, position }: DefinitionParams): Location[] => {
    const doc = documents.get(textDocument.uri);
    const seeking = Object.keys(
      utils.parseImports(
        doc?.getText({
          start: {
            line: position.line,
            character: 0,
          },
          end: {
            line: position.line,
            character: Infinity,
          },
        }) || ""
      )
    );

    if (seeking.length) {
      const fileName = seeking[0];
      const uri = path.join(path.dirname(textDocument.uri), `${fileName}.ply`);
      return [
        {
          range: utils.GHOST_RANGE,
          uri,
        },
      ];
    }

    return [];
  };
}

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
    const seeking = utils.parseImports(
      doc?.getText({
        start: {
          line: position.line,
          character: 0,
        },
        end: {
          line: position.line,
          character: Infinity,
        },
      }) || "",
      position.line
    );

    const keys = Object.keys(seeking);

    if (keys.length && utils.positionInRange(position, seeking[keys[0]])) {
      const fileName = keys[0];
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

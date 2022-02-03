import * as child from "child_process";
import * as url from "url";
import { Diagnostic, _Connection } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

async function executeTypeChecker(
  filename: string
): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    child.exec(`parsleyc.exe -json ${filename}`, (err, data) => {
      if (err) {
        resolve(err.message);
      }
      resolve(undefined);
    });
  });
}

function parseParsleyResponse(response: string): Diagnostic | undefined {
  const data = response.split("\n")[1];
  const error = JSON.parse(data);

  if (error) {
    const { lnum, bol, cnum } = error;

    const character = cnum - bol;

    return {
      message: response,
      range: {
        start: {
          character,
          line: lnum - 2,
        },
        end: {
          character: character + 1,
          line: lnum - 2,
        },
      },
    };
  }
}

export function validateTextDocument(connection: _Connection) {
  return async ({ uri }: TextDocument): Promise<void> => {
    const file = url.parse(uri).pathname;
    const diagnostics: Diagnostic[] = [];

    if (file) {
      const result = await executeTypeChecker(file);
      if (result) {
        const diagnostic = parseParsleyResponse(result);

        if (diagnostic) {
          diagnostics.push(diagnostic);
        }
      }
    }

    connection.sendDiagnostics({ uri, diagnostics });
  };
}

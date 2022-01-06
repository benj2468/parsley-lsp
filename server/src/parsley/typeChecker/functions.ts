import * as child from "child_process";
import * as url from "url";
import { Diagnostic, _Connection } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

async function executeTypeChecker(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    child.exec(`parsleyc ${filename}`, (err, data) => {
      if (err) {
        resolve(err.message);
      }
      resolve(data);
    });
  });
}

function parseParsleyResponse(response: string): Diagnostic | undefined {
  const re = /File ".*", line (\d+), character (\d+): ((.|\n)*)/;

  const data = response.match(re);

  if (data) {
    const line = Number.parseInt(data[1]);
    const character = Number.parseInt(data[2]);
    const message = data[3];

    return {
      message,
      range: {
        start: {
          character,
          line,
        },
        end: {
          character,
          line,
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
      const diagnostic = parseParsleyResponse(result);

      if (diagnostic) {
        diagnostics.push(diagnostic);
      }
    }

    connection.sendDiagnostics({ uri, diagnostics });
  };
}

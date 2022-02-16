import * as child from "child_process";
import * as url from "url";
import {
  Diagnostic,
  Position,
  Range,
  _Connection,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

const GHOST_RANGE: Range = {
  start: {
    character: 0,
    line: 0,
  },
  end: {
    character: 1,
    line: 0,
  },
};

type ErrLocation = {
  fname: string;
  lnum: number;
  bol: number;
  cnum: number;
};

type ErrMessage = {
  errm_start: ErrLocation;
  errm_end: ErrLocation;
  errm_ghost: boolean;
  errm_reason: string;
};

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

function convertToPosition(errLocation: ErrLocation): Position {
  return {
    character: errLocation.cnum - errLocation.bol,
    line: errLocation.lnum - 1,
  };
}

function parseParsleyResponse(response: string): Diagnostic | undefined {
  const data = response.split("\n")[1];
  const error: ErrMessage = JSON.parse(data);

  if (error) {
    const { errm_start, errm_end, errm_reason, errm_ghost } = error;

    return errm_ghost
      ? { message: errm_reason, range: GHOST_RANGE }
      : {
          message: errm_reason,
          range: {
            start: convertToPosition(errm_start),
            end: convertToPosition(errm_end),
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

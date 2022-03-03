import * as child from "child_process";
import * as url from "url";
import * as path from "path";
import { Diagnostic, Position, _Connection } from "vscode-languageserver";
import * as utils from "../utils";
import { GHOST_RANGE } from "../utils";

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

function parseParsleyResponse(
  file: string,
  imports: utils.Import[],
  response: string
): Diagnostic | undefined {
  const data = response.split("\n")[1];
  const error: ErrMessage = JSON.parse(data);

  if (error) {
    const { errm_start, errm_end, errm_reason, errm_ghost } = error;

    if (errm_start.fname !== file) {
      const file = path.parse(errm_start.fname);

      return {
        message: `Error in file: ${errm_start.fname} : ${errm_reason}`,
        range:
          imports.find(({ fileName }) => file.name == fileName)!.range ||
          GHOST_RANGE,
      };
    }

    return errm_ghost
      ? { message: errm_reason, range: utils.GHOST_RANGE }
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
  return (uri: string, text: string) => {
    const file = url.parse(uri).pathname;
    const diagnostics: Diagnostic[] = [];

    const imports = utils.parseImports(text);

    if (file) {
      executeTypeChecker(file).then((result) => {
        if (result) {
          const diagnostic = parseParsleyResponse(file, imports, result);

          if (diagnostic) {
            diagnostics.push(diagnostic);
          }
        }
        connection.sendDiagnostics({ uri, diagnostics });
      });
    }
  };
}

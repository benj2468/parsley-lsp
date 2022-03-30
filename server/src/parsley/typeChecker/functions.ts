import * as child from "child_process";
import * as url from "url";
import * as path from "path";
import {
  Diagnostic,
  DiagnosticSeverity,
  Position,
  _Connection,
} from "vscode-languageserver";
import * as utils from "../utils";
import { GHOST_RANGE } from "../utils/constants";
import { Settings } from "../../types";
import { ErrLocation, ErrMessage } from "./types";
import { Import } from "../utils/types";

// Executes the type checker for parsley
async function executeTypeChecker(
  settings: Settings,
  filename: string
): Promise<string | undefined> {
  const { path } = settings;
  return new Promise((resolve, reject) => {
    child.exec(`${path} -json ${filename}`, (err, data) => {
      if (err?.code == 1) {
        resolve(err.message);
      }
      if (err?.code == 127) {
        reject(err.message);
      }
      resolve(undefined);
    });
  });
}

// Converts the error location to a position
function convertToPosition(errLocation: ErrLocation): Position {
  return {
    character: errLocation.cnum - errLocation.bol,
    line: errLocation.lnum - 1,
  };
}

// Parses the error message and returns a diagnostic
function parseParsleyResponse(
  file: string,
  imports: Import[],
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
        severity: DiagnosticSeverity.Error,
      };
    }

    return errm_ghost
      ? { message: errm_reason, range: GHOST_RANGE }
      : {
          message: errm_reason,
          range: {
            start: convertToPosition(errm_start),
            end: convertToPosition(errm_end),
          },
          severity: DiagnosticSeverity.Error,
        };
  }
}

// Main validator for parsley. This function is called by the server on file change.
// It sends diagnostics back to the client over the connection.
export function validateTextDocument(
  connection: _Connection,
  settings: Settings
) {
  return (uri: string, text: string) => {
    const file = url.parse(uri).pathname;
    const diagnostics: Diagnostic[] = [];

    const imports = utils.parseImports(text);

    if (file) {
      executeTypeChecker(settings, file)
        .then((result) => {
          if (result) {
            const diagnostic = parseParsleyResponse(file, imports, result);

            if (diagnostic) {
              diagnostics.push(diagnostic);
            }
          }
          connection.sendDiagnostics({ uri, diagnostics });
        })
        .catch((err) => {
          connection.sendDiagnostics({
            uri,
            diagnostics: [
              {
                message: err,
                range: GHOST_RANGE,
                severity: DiagnosticSeverity.Error,
              },
            ],
          });
        });
    }
  };
}

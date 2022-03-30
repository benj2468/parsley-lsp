import {
  CompletionItemKind,
  TextDocumentPositionParams,
} from "vscode-languageserver";
import { utils } from "..";
import { GlobalState } from "../../types";
import { STD_NON_TERMINALS } from "./constants";
import { CompletionItem, CompletionType } from "./types";

// Defines the completion options, must be called each time as it depends on the global state (non-terminals defined byt the user)
export const completionOptions =
  (globalState: GlobalState) =>
  ({ position }: TextDocumentPositionParams): CompletionItem[] => {
    const { nonTerminals } = globalState;

    return nonTerminals
      .filter(({ range }) => utils.positionAfterRange(position, range))
      .map(({ ident }) => ({
        label: ident,
        kind: CompletionItemKind.Constructor,
      }))
      .concat(
        STD_NON_TERMINALS.map((ident) => ({
          label: ident,
          kind: CompletionItemKind.Constructor,
        }))
      );
  };
// Resolves the completion item, not sure why we need this...
export const completionResolve = (item: CompletionItem): CompletionItem => {
  return item;
};

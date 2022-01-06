import {
  CompletionItemKind,
  TextDocumentPositionParams,
} from "vscode-languageserver";
import { CompletionItem, CompletionType } from "./types";

export function completionOptions(
  _textDocumentPosition: TextDocumentPositionParams
): CompletionItem[] {
  // The pass parameter contains the position of the text document in
  // which code complete got requested. For the example we ignore this
  // info and always provide the same completion items.
  return [
    {
      label: "TypeScript",
      kind: CompletionItemKind.Text,
      data: {
        type: CompletionType.Ident,
      },
    },
    {
      label: "JavaScript",
      kind: CompletionItemKind.Text,
      data: {
        type: CompletionType.Other,
      },
    },
  ];
}

export function completionResolve(item: CompletionItem): CompletionItem {
  if (item.data?.type === CompletionType.Ident) {
    item.detail = "TypeScript details";
    item.documentation = "TypeScript documentation";
  } else if (item.data?.type === CompletionType.Other) {
    item.detail = "JavaScript details";
    item.documentation = "JavaScript documentation";
  }
  return item;
}

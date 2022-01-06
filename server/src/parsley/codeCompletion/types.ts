import { CompletionItem as VSCodeCompletionItem } from "vscode-languageserver";

export enum CompletionType {
  Ident = "Ident",
  Other = "Other",
}

export type CompletionData = {
  type: CompletionType;
};

export type CompletionItem = Omit<VSCodeCompletionItem, "data"> & {
  data?: CompletionData;
};

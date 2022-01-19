import * as vscode from "vscode";
import * as help from "./_helpers";

export const legend = () => {
  const tokenTypesLegend = [
    "comment",
    "string",
    "keyword",
    "number",
    "regexp",
    "operator",
    "namespace",
    "type",
    "struct",
    "class",
    "interface",
    "enum",
    "typeParameter",
    "function",
    "method",
    "decorator",
    "macro",
    "variable",
    "parameter",
    "property",
    "label",
  ];
  tokenTypesLegend.forEach((tokenType, index) =>
    help.tokenTypes.set(tokenType, index)
  );

  const tokenModifiersLegend = [
    "declaration",
    "documentation",
    "readonly",
    "static",
    "abstract",
    "deprecated",
    "modification",
    "async",
  ];
  tokenModifiersLegend.forEach((tokenModifier, index) =>
    help.tokenModifiers.set(tokenModifier, index)
  );

  return new vscode.SemanticTokensLegend(
    tokenTypesLegend,
    tokenModifiersLegend
  );
};

export const provider: vscode.DocumentSemanticTokensProvider = {
  provideDocumentSemanticTokens: (document: vscode.TextDocument) => {
    const allTokens = help.parseText(document.getText());
    const builder = new vscode.SemanticTokensBuilder();

    allTokens.forEach((token) => {
      builder.push(
        token.line,
        token.startCharacter,
        token.length,
        help.encodeTokenType(token.tokenType),
        help.encodeTokenModifiers(token.tokenModifiers)
      );
    });
    return builder.build();
  },
};

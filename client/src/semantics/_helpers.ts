import { IParsedToken } from "./types";

export const tokenTypes = new Map<string, number>();
export const tokenModifiers = new Map<string, number>();

const Token = (
  tokenType: string,
  re: RegExp,
  func: (groups: string[]) => string
) => ({
  match: (text: string) => {
    const groups = text.match(re);
    return func(groups);
  },
  tokenType,
});

const matchings = [
  Token("type", /type\s+([\w_]+)\s+=/i, (groups) => {
    if (groups) {
      return groups[1];
    }
  }),
];

const parseTextToken = (
  text: string
): { tokenType: string; tokenModifiers: string[] } => {
  const parts = text.split(".");
  return {
    tokenType: parts[0],
    tokenModifiers: parts.slice(1),
  };
};

export const parseText = (text: string): IParsedToken[] => {
  const r: IParsedToken[] = [];
  const lines = text.split(/\r\n|\r|\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    matchings.forEach(({ match, tokenType }) => {
      const me = match(line);
      const start = line.indexOf(me);
      if (me) {
        r.push({
          line: i,
          startCharacter: start,
          length: me.length,
          tokenType,
          tokenModifiers: [],
        });
      }
    });
  }
  return r;
};

export const encodeTokenType = (tokenType: string): number => {
  if (tokenTypes.has(tokenType)) {
    return tokenTypes.get(tokenType)!;
  } else if (tokenType === "notInLegend") {
    return tokenTypes.size + 2;
  }
  return 0;
};

export const encodeTokenModifiers = (strTokenModifiers: string[]): number => {
  let result = 0;
  for (let i = 0; i < strTokenModifiers.length; i++) {
    const tokenModifier = strTokenModifiers[i];
    if (tokenModifiers.has(tokenModifier)) {
      result = result | (1 << tokenModifiers.get(tokenModifier)!);
    } else if (tokenModifier === "notInLegend") {
      result = result | (1 << (tokenModifiers.size + 2));
    }
  }
  return result;
};

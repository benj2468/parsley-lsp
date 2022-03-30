import { NonTerminal } from "./parsley/utils/types";

export interface Settings {
  path: string;
}

export type GlobalState = {
  nonTerminals: NonTerminal[];
};

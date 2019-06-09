import IOHandler from "./io/IOHandler";

export enum ChipmunkNodeType {
  Boolean,
  Function,
  List,
  Map,
  Nil,
  Number,
  String,
  Symbol,
}

export interface ChipmunkTypeBase {
  type: ChipmunkNodeType;
  line?: number;
  column?: number;
}

export interface ChipmunkBoolean extends ChipmunkTypeBase {
  type: ChipmunkNodeType.Boolean;
  value: boolean;
}

export interface ChipmunkFunction extends ChipmunkTypeBase {
  type: ChipmunkNodeType.Function;
  callable: (args: ChipmunkType[], ioHandler: IOHandler) => ChipmunkType;
  isUserDefined: boolean;
  name?: string;
  params?: ChipmunkSymbol[];
  body?: ChipmunkType;
}

export interface ChipmunkList extends ChipmunkTypeBase {
  type: ChipmunkNodeType.List;
  items: ChipmunkType[];
}

export interface ChipmunkMap extends ChipmunkTypeBase {
  type: ChipmunkNodeType.Map;
  entries: Map<string, ChipmunkType>;
}

export interface ChipmunkNil extends ChipmunkTypeBase {
  type: ChipmunkNodeType.Nil;
}

export interface ChipmunkNumber extends ChipmunkTypeBase {
  type: ChipmunkNodeType.Number;
  value: number;
}

export interface ChipmunkString extends ChipmunkTypeBase {
  type: ChipmunkNodeType.String;
  value: string;
}

export interface ChipmunkSymbol extends ChipmunkTypeBase {
  type: ChipmunkNodeType.Symbol;
  name: string;
}

export type ChipmunkType =
  ChipmunkBoolean |
  ChipmunkFunction |
  ChipmunkList |
  ChipmunkMap |
  ChipmunkNil |
  ChipmunkNumber |
  ChipmunkString |
  ChipmunkSymbol;

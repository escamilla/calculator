import IOHandler from "./io/IOHandler.ts";

export interface SourceNode {
  line?: number;
  column?: number;
}

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

export interface ChipmunkBoolean extends SourceNode {
  type: ChipmunkNodeType.Boolean;
  value: boolean;
}

export interface ChipmunkFunction extends SourceNode {
  type: ChipmunkNodeType.Function;
  callable: (args: ChipmunkType[], ioHandler: IOHandler) => ChipmunkType;
  isUserDefined: boolean;
  name?: string;
  params?: ChipmunkSymbol[];
  body?: ChipmunkType;
}

export interface ChipmunkList extends SourceNode {
  type: ChipmunkNodeType.List;
  items: ChipmunkType[];
}

export interface ChipmunkMap extends SourceNode {
  type: ChipmunkNodeType.Map;
  entries: Map<string, ChipmunkType>;
}

export interface ChipmunkNil extends SourceNode {
  type: ChipmunkNodeType.Nil;
}

export interface ChipmunkNumber extends SourceNode {
  type: ChipmunkNodeType.Number;
  value: number;
}

export interface ChipmunkString extends SourceNode {
  type: ChipmunkNodeType.String;
  value: string;
}

export interface ChipmunkSymbol extends SourceNode {
  type: ChipmunkNodeType.Symbol;
  name: string;
}

export type ChipmunkType =
  | ChipmunkBoolean
  | ChipmunkFunction
  | ChipmunkList
  | ChipmunkMap
  | ChipmunkNil
  | ChipmunkNumber
  | ChipmunkString
  | ChipmunkSymbol;

import JavaScriptNode from "./JavaScriptNode.ts";
import JavaScriptNodeBase from "./JavaScriptNodeBase.ts";
import JavaScriptNodeType from "./JavaScriptNodeType.ts";

interface JavaScriptIIFE extends JavaScriptNodeBase {
  type: JavaScriptNodeType.IIFE;
  nodes: JavaScriptNode[];
  isRootNode: boolean;
}

export default JavaScriptIIFE;

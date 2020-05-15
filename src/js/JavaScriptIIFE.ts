import JavaScriptNode from "./JavaScriptNode";
import JavaScriptNodeBase from "./JavaScriptNodeBase";
import JavaScriptNodeType from "./JavaScriptNodeType";

interface JavaScriptIIFE extends JavaScriptNodeBase {
  type: JavaScriptNodeType.IIFE;
  nodes: JavaScriptNode[];
  isRootNode: boolean;
}

export default JavaScriptIIFE;
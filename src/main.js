import { HydrangeaJS } from "./lib/HydrangeaJS/src/main.js";
import { RootComponent } from "./lib/Node/Component/root_component.js";
import { DraggableComponent } from "./lib/Node/Component/draggable_component.js";
import { FrameNode, TextureNode, ShaderNode } from "./lib/Node/NodeComponent/frame.js";
import { Node, NodeParam } from "./lib/Node/Component/node_component.js";

window.HydrangeaJS = HydrangeaJS;
window.RootComponent = RootComponent;
window.DraggableComponent = DraggableComponent;
window.FrameNode = FrameNode;
window.TextureNode = TextureNode;
window.ShaderNode = ShaderNode;
window.Node = Node;
window.NodeParam = NodeParam;
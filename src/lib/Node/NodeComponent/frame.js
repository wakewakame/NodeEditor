import { Node, NodeParam } from "../Component/node_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const ShaderNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.shader = null;
		this.inputFrameNodeParam = null;
		this.outputFrameNodeParam = null;
	}
	setup(){
		super.setup();
		this.outputFrameNodeParam = this.outputs.add(new NodeParam("shader", "output"));
		this.shader = this.graphics.createShader();
		this.shader.loadDefaultShader();
	}
	loadShader(fragmentShader){
		let result = this.shader.loadShader(this.shader.default_shader.vertex, fragmentShader);
		if (result !== "") return result;
		for(let i of this.inputs.childs) this.inputs.remove(i);
		Object.keys(this.shader.uniforms_type).forEach((key) => {
			if (key !== "matrix") this.inputs.add(new NodeParam("frame", key));
		});
		return "";
	}
	job(){
		super.job();
		Object.keys(this.shader.uniforms_type).forEach((key) => {
			if (key !== "matrix") {
				let inputs = this.inputs.childs.filter(np => np.name === key);
				if (inputs.length === 1) {
					let output = inputs[0].output;
					if (output !== null) this.shader.set(key, output.node.frameBuffer.texture);
				}
			}
		});
	}
	reset(){
		super.reset();
	}
};

export const FrameNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.frameBuffer = null;
		this.inputShaderNodeParam = null;
		this.outputShaderNodeParam = null;
		this.previewShader = null;
	}
	setup(){
		super.setup();
		this.inputShaderNodeParam = this.inputs.add(new NodeParam("shader", "input"));
		this.outputShaderNodeParam = this.outputs.add(new NodeParam("frame", "output"));
		this.frameBuffer = this.graphics.createFrame(512, 512);
		this.previewShader = this.graphics.createShader();
		this.previewShader.loadShader(this.previewShader.default_shader.vertex, `
			precision highp float;
			uniform sampler2D texture;
			uniform vec2 textureArea;
			varying vec2 vUv;
			varying vec4 vColor;

			void main(void){
				gl_FragColor = texture2D(texture, vUv * textureArea);
			}
		`);
	}
	job(){
		super.job();
		if(this.inputs.childs.length !== 1 || this.inputs.childs[0] === null) return;
		if(this.inputs.childs[0].output === null) return;
		if(!(this.inputs.childs[0].output.node instanceof ShaderNode)) return;
		let shader = this.inputs.childs[0].output.node.shader;
		this.frameBuffer.beginDraw();
		let tmp_current_shader = this.graphics.current_shader;
		this.graphics.shader(shader);
		this.graphics.rect(0, this.frameBuffer.height, this.frameBuffer.width, -this.frameBuffer.height);
		this.graphics.shader(tmp_current_shader);
		this.frameBuffer.endDraw();
	}
	reset(){
		super.reset();
	}
	update(){
		super.update();
		if (this.parent.childs[0] === this)	{
			this.reset();
			this.job();
		}
	}
	draw(){
		super.draw();
		let tmp_current_shader = this.graphics.current_shader;
		this.graphics.shader(this.previewShader);
		this.previewShader.set("texture", this.frameBuffer.texture);
		this.previewShader.set(
			"textureArea",
			this.frameBuffer.texture.width  / this.frameBuffer.texture.pow2_width,
			this.frameBuffer.texture.height / this.frameBuffer.texture.pow2_height
		);
		this.graphics.shape(this.inner_shape);
		this.graphics.shader(tmp_current_shader);
	}
};

export const TextureNode = class extends FrameNode {
	constructor(name, img_url, x, y) {
		super(name, x, y);
		this.img_url = img_url;
		this.frameBuffer = null;
		this.outputShaderNodeParam = null;
		this.previewShader = null;
	}
	setup(){
		super.setup();
		let img = this.graphics.createTexture(0, 0);
		img.loadImg(this.img_url, () => {
			this.frameBuffer.resize(img.width, img.height);
			this.frameBuffer.beginDraw();
			this.graphics.image(img, 0, img.height, img.width, 0.0 - img.height);
			this.frameBuffer.endDraw();
			this.resizeBox.target.y = this.w * img.height / img.width;
		});
		this.inputs.remove(this.inputShaderNodeParam);
	}
	job(){
		super.job();
	}
	reset(){
		super.reset();
	}
	update(){
		super.update();
	}
	draw(){
		super.draw();
	}
};
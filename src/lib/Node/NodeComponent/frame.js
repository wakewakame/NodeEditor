import { Node, NodeParam } from "../Component/node_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const ShaderNodeParam = class extends NodeParam {
	constructor(name) {
		super(name);
	}
	setup(){
		super.setup();
	}
	deleted(){
		super.deleted();
	}
	canOutput(p){
		return true;
	}
	job() {}
	reset() {}
	update() {
		super.update();
	}
	draw() {
		super.draw();
	}
};

export const ShaderNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.shader = null;
		this.inputFrameNodeParam = null;
		this.outputFrameNodeParam = null;
	}
	setup(){
		super.setup();
		this.inputFrameNodeParam = this.inputs.add(new FrameNodeParam("input"));
		this.outputFrameNodeParam = this.outputs.add(new FrameNodeParam("output"));
		this.shader = this.graphics.createShader();
		this.shader.loadDefaultShader();
	}
	loadShader(fragmentShader){
		this.shader.loadShader(this.shader.default_shader.vertex, fragmentShader);
	}
	job(){
		super.job();
	}
	reset(){
		super.reset();
	}
};

export const FrameNodeParam = class extends NodeParam {
	constructor(name) {
		super(name);
	}
	setup(){
		super.setup();
	}
	deleted(){
		super.deleted();
	}
	canOutput(p){
		return true;
	}
	job() {}
	reset() {}
	update() {
		super.update();
	}
	draw() {
		super.draw();
	}
};

export const FrameNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.frameBuffer = null;
		this.inputFrameNodeParam = null;
		this.outputFrameNodeParam = null;
		this.previewShader = null;
	}
	setup(){
		super.setup();
		this.inputFrameNodeParam = this.inputs.add(new FrameNodeParam("input"));
		this.outputFrameNodeParam = this.outputs.add(new FrameNodeParam("output"));
		this.frameBuffer = this.graphics.createFrame(100, 100);
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
		this.graphics.rect(0, 0, this.frameBuffer.width, this.frameBuffer.height);
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
		this.outputFrameNodeParam = null;
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
		this.inputs.remove(this.inputFrameNodeParam);
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
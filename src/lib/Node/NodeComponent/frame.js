import { Node, NodeParam } from "../Component/node_component.js";
import { HydrangeaJS } from "../../HydrangeaJS/src/main.js";

export const ValueNodeParam = class extends NodeParam {
	constructor(type, name) {
		super(type, name);
		this.value = {
			x: 0.0,
			y: 0.0,
			z: 0.0,
			w: 0.0,
			mat: [],
			texture: [],
			shader: null
		}
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
		this.outputFrameNodeParam = this.outputs.add(new ValueNodeParam("shader", "output"));
		this.shader = this.graphics.createShader();
		this.shader.loadDefaultShader();
	}
	deleted(){
		super.deleted();
		this.shader.delete();
	}
	loadShader(fragmentShader){
		let result = this.shader.loadShader(this.shader.default_shader.vertex, fragmentShader);
		if (result !== "") return result;
		for(let i of this.inputs.childs) this.inputs.remove(i);
		Object.keys(this.shader.uniforms_type).forEach((key) => {
			if (key === "matrix") return;
			let type = this.shader.uniforms_type[key];
			if (type === "sampler2D") {
				this.inputs.add(new ValueNodeParam("frame", key));
			}
			else {
				this.inputs.add(new ValueNodeParam(type, key));
			}
		});
		return "";
	}
	job(){
		super.job();
		this.outputFrameNodeParam.value.shader = this.shader;
		for(let c of this.inputs.childs) {
			if(c.output === null) continue;
			switch(c.type){
				case "int":
				case "float":
					this.shader.set(
						c.name,
						c.output.value.x
					);
					break;
				case "ivec2":
				case "vec2":
					this.shader.set(
						c.name,
						c.output.value.x,
						c.output.value.y
					);
					break;
				case "ivec3":
				case "vec3":
					this.shader.set(
						c.name,
						c.output.value.x,
						c.output.value.y,
						c.output.value.z
					);
					break;
				case "ivec4":
				case "vec4":
					this.shader.set(
						c.name,
						c.output.value.x,
						c.output.value.y,
						c.output.value.z,
						c.output.value.w
					);
					break;
				case "mat2":
				case "mat3":
				case "mat4":
					this.shader.set(
						c.name,
						c.output.value.mat
					);
					break;
				case "frame":
					this.shader.set(
						c.name,
						c.output.value.texture
					);
					break;
			}
		}
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
		this.inputShaderNodeParam = this.inputs.add(new ValueNodeParam("shader", "input"));
		this.outputShaderNodeParam = this.outputs.add(new ValueNodeParam("frame", "output"));
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
	deleted(){
		super.deleted();
		this.frameBuffer.delete();
		this.previewShader.delete();
	}
	job(){
		super.job();
		this.outputShaderNodeParam.value.texture = this.frameBuffer.texture;
		if (
			(this.inputs.childs.length !== 1) ||
			(!(this.inputs.childs[0] instanceof ValueNodeParam)) ||
			(this.inputs.childs[0].output === null)
		) return;
		let shader = this.inputs.childs[0].output.value.shader;
		this.frameBuffer.beginDraw();
		let tmp_current_shader = this.graphics.current_shader;
		this.graphics.shader(shader);
		this.graphics.rect(0, this.frameBuffer.height, this.frameBuffer.width, -this.frameBuffer.height);
		this.graphics.shader(tmp_current_shader);
		this.frameBuffer.endDraw();
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
		img.delete();
	}
};

export const TimeNode = class extends Node {
	constructor(name, x, y) {
		super(name, x, y);
		this.outputFloatNodeParam = null;	}
	setup(){
		super.setup();
		this.outputFloatNodeParam = this.outputs.add(new ValueNodeParam("float", "output"));
		this.outputFloatNodeParam.value.x = 0.0;
	}
	job(){
		super.job();
		this.outputFloatNodeParam.value.x += 0.01;
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
		this.graphics.fill(1.0, 0.0, 0.0, 1.0);
		this.graphics.stroke(0.0, 0.0, 0.0, 0.0);
		this.graphics.rect(10, 10, 20, 20);
	}
};
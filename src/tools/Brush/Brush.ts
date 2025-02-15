import * as Color from 'color';
import { InteractionEvent } from 'pixi.js';
import Editor from '../../Editor';
import Cursor from '../../addon/overlays/Cursor';
import Point from '../../Point';
import PluginPauser from '../../util/PluginPauser';
import Tool from '../Tool';
import BrushCursor from './BrushCursor';

export default class Brush extends Tool {
	public name = 'brush';

	public color = new Color(0);
	public alpha = 1;
	public size = 4;

	protected pluginPauser: PluginPauser;

	protected cursor: Cursor;
	protected buttons;
	protected pressed = false;
	protected prevPos = null as Point;

	constructor(
		editor: Editor,
		{ pluginsToDisable = [] as string[], buttons = [] as number[] } = {}
	) {
		super(editor);

		this.pluginPauser = new PluginPauser(...pluginsToDisable);
		this.cursor = this.createCursor();
		this.buttons = buttons;
	}

	createCursor(): Cursor {
		return new BrushCursor({ brush: this });
	}

	onAdded() {
		this.editor.addAddon(this.cursor);
	}
	onRemoved() {
		this.editor.removeAddon(this.cursor);
	}

	getColor() {
		return this.color;
	}

	getAlpha() {
		return this.alpha;
	}

	getSize() {
		return this.size * 2 - 1;
	}

	paintPosition(pos: Point) {
		const size = this.getSize();
		const startPos = pos.add(-size / 2, -size / 2).round();
		
		this.editor.focusedLayer.render((ctx) => {
			ctx.fillStyle = this.getColor().hex();
			ctx.globalAlpha = this.getAlpha();
			ctx.fillRect(startPos.x, startPos.y, size, size);
		});
	}

	paintPositions(pos: Point) {
		if (this.prevPos) {
			const dist = this.prevPos.distance(pos);
			const angle = this.prevPos.angleFrom(pos);
			const size = this.getSize();
			const halfSize = size / 2;

			for (let i = 0 ; i < dist ; i += halfSize) {
				const x = this.prevPos.x + (Math.sin(angle) * i);
  				const y = this.prevPos.y + (Math.cos(angle) * i);

				this.paintPosition(new Point(x, y).floor())
			}
		} else {
			this.paintPosition(pos);
		}
	}

	down(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = true;

		this.pluginPauser.pause(this.editor.viewport.plugins);

		if (this.editor.focusedLayer) {
			const mousePos = this.editor.toCanvas(event).floor();
			this.paintPosition(mousePos);
			this.prevPos = mousePos;
		}

		return true;
	}

	up(event: InteractionEvent): boolean {
		if (this.paused) return false;
		if (!this.buttons.includes(event.data.button)) return false;

		this.pressed = false;
		this.prevPos = null;

		this.pluginPauser.resume(this.editor.viewport.plugins);

		return true;
	}

	move(event: InteractionEvent): boolean {
		if (this.paused) return false;

		const mousePos = this.editor.toCanvas(event).floor();

		if (!this.pressed) return false;

		this.paintPositions(mousePos);
		this.prevPos = mousePos;

		return true;
	}

	destroy(): void {
		this.cursor.destroy();
	}
}

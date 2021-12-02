import { App, Modal } from "obsidian";

const tpl = `
<div>
<div>
Starting hex number: 
<select id="hexvalue">
<option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
<option>6</option><option>7</option><option>8</option><option>9</option><option selected>10</option>
<option>11</option><option>12</option><option>13</option><option>14</option><option>15</option>
<option>16</option><option>17</option><option>18</option><option>19</option>
</select>
</div>
<div id="buttons" class="hfmodalbtns"></div>
</div>
`;

export class ResetModal extends Modal {
	resetFunc: (value: string) => void;

	constructor(app: App, resetFunc: (value: string) => void) {
		super(app);
		this.resetFunc = resetFunc;
	}

	onOpen() {
		const { contentEl } = this;

		this.titleEl.setText("Reset hexflower");
		contentEl.innerHTML = tpl.trim();

		const valEl = contentEl.find("#hexvalue");
		const btns = contentEl.find("#buttons");
		if (btns && valEl) {
			const btn = document.createElement("button");
			btn.setText("Reset");
			btn.onclick = () => {
				if (this.resetFunc) {
					const sel = valEl as HTMLSelectElement;
					this.resetFunc(sel.options.item(sel.selectedIndex).text);
				}
				this.close();
			};
			const btnCancel = document.createElement("button");
			btnCancel.setText("Cancel");
			btnCancel.onclick = () => {
				this.close();
			};
			btns.appendChild(btn);
			btns.appendChild(btnCancel);
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

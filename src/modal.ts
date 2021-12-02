import { App, Modal } from "obsidian";
import { ManualRollModalTemplate, ResetModalTemplate } from "./template";

export class ResetModal extends Modal {
	resetFunc: (value: string) => void;

	constructor(app: App, resetFunc: (value: string) => void) {
		super(app);
		this.resetFunc = resetFunc;
	}

	onOpen() {
		const { contentEl } = this;

		this.titleEl.setText("Reset hexflower");
		contentEl.innerHTML = ResetModalTemplate;

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

export class ManualRollModal extends Modal {
	acceptFunc: (value: string) => void;
	name: string;

	constructor(
		app: App,
		navigationName: string,
		acceptFunc: (value: string) => void
	) {
		super(app);
		this.name = navigationName;
		this.acceptFunc = acceptFunc;
	}

	onOpen() {
		const { contentEl } = this;

		this.titleEl.setText("Manual roll (" + this.name + ")");
		contentEl.innerHTML = ManualRollModalTemplate.trim();
		const btns = contentEl.find("#buttons");
		if (btns) {
			const btn = document.createElement("button");
			btn.setText("Compute");
			btn.onclick = () => {
				const inp = contentEl.find("#dice");
				if (inp) {
					const val = (inp as HTMLInputElement).value;
					if (val.trim() != "") {
						this.acceptFunc(val.trim());
					}
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
}

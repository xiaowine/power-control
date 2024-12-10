import { createApp, Component, h, ref, onMounted, markRaw } from 'vue';
import Dialog from '../components/Dialog.vue';

export interface DialogOptions {
	title?: string;
	content: string | Component;
	width?: string;
	closeOnClickOverlay?: boolean;
	footer?: Component;
	onClose?: () => void;
	onOpen?: () => void;
	className?: string;
}

export interface DialogInstance {
	close: () => void;
	updateContent: (content: string | Component) => void;
	updateTitle: (title: string) => void;
}

export interface DialogState {
	visible: ReturnType<typeof ref<boolean>>;
	title: ReturnType<typeof ref<string>>;
	content: ReturnType<typeof ref<string | Component>>;
	currentDialog?: DialogInstance;
}

export function showDialog(options: DialogOptions): DialogInstance {
	try {
		const {
			title = '提示',
			content = '',
			width = '400px',
			closeOnClickOverlay = true,
			footer = null,
			onClose = () => {},
			onOpen = () => {},
			className = '',
		} = options;

		const mountNode = document.createElement('div');
		className && mountNode.classList.add(className);
		document.body.appendChild(mountNode);

		const dialogState: DialogState = {
			visible: ref<boolean>(true),
			title: ref<string>(title),
			content: ref<string | Component>(typeof content === 'string' ? content : markRaw(content)),
		};

		const cleanup = () => {
			try {
				app.unmount();
				mountNode.remove();
				onClose();
				dialogState.currentDialog = undefined;
			} catch (error) {
				console.error('Dialog cleanup failed:', error);
			}
		};

		const app = createApp({
			setup() {
				onMounted(() => {
					try {
						onOpen();
					} catch (error) {
						console.error('Dialog onOpen callback failed:', error);
					}
				});

				return () =>
					h(Dialog, {
						modelValue: dialogState.visible.value || false,
						'onUpdate:modelValue': (val: boolean) => {
							dialogState.visible.value = val;
							if (!val) cleanup();
						},
						title: dialogState.title.value || '提示',
						width,
						closeOnClickOverlay,
						class: className,
						content: dialogState.content.value,
						footer: footer,
					});
			},
		});

		app.mount(mountNode);

		const instance: DialogInstance = {
			close: () => {
				dialogState.visible.value = false;
				cleanup();
			},
			updateContent: (newContent) => {
				dialogState.content.value = newContent;
			},
			updateTitle: (newTitle) => {
				dialogState.title.value = newTitle;
			},
		};

		dialogState.currentDialog = instance;
		return instance;
	} catch (error) {
		console.error('Failed to create dialog:', error);
		throw new Error('Failed to create dialog');
	}
}

export interface DialogManager {
	dialogs: Set<DialogInstance>;
	add: (dialog: DialogInstance) => void;
	remove: (dialog: DialogInstance) => void;
	closeAll: () => void;
	count: number;
}

export const dialogManager: DialogManager = {
	dialogs: new Set(),

	add(dialog: DialogInstance) {
		this.dialogs.add(dialog);
	},

	remove(dialog: DialogInstance) {
		this.dialogs.delete(dialog);
	},

	closeAll() {
		this.dialogs.forEach((dialog) => dialog.close());
		this.dialogs.clear();
	},

	get count() {
		return this.dialogs.size;
	},
};

export function showAlert(message: string, options: Partial<DialogOptions> = {}): DialogInstance {
	return showDialog({
		title: '警告',
		content: message,
		width: '300px',
		footer: {
			setup() {
				return () =>
					h(
						'button',
						{
							onClick: () => dialogManager.closeAll(),
							style: {
								width: '100%',
								margin: '0',
								backgroundColor: 'var(--error-color)',
								color: 'white',
							},
						},
						'确定'
					);
			},
		},
		className: 'alert-dialog',
		...options,
	});
}

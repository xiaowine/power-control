import { createApp, Component, h, ref, onMounted, markRaw } from 'vue';
import Dialog from '../components/Dialog.vue';

export interface DialogOptions {
	title?: string;
	content: Component;
	closeOnClickOverlay?: boolean;
	footer?: Component;
	onClose?: () => void;
	onOpen?: () => void;
	className?: string;
}

export interface DialogInstance {
	close: () => void;
	updateContent: (content: Component) => void;
	updateTitle: (title: string) => void;
}

export interface DialogState {
	visible: ReturnType<typeof ref<boolean>>;
	title: ReturnType<typeof ref<string>>;
	content: ReturnType<typeof ref<Component>>;
	currentDialog?: DialogInstance;
}

export function showDialog(options: DialogOptions): DialogInstance {
	const {
		title = '提示',
		content = {},
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
		content: ref<Component>(markRaw(content)),
	};

	const cleanup = () => {
		app.unmount();
		mountNode.remove();
		onClose();
		dialogState.currentDialog = undefined;
	};

	const app = createApp({
		setup() {
			onMounted(() => onOpen());

			return () =>
				h(Dialog, {
					modelValue: dialogState.visible.value ?? false,
					'onUpdate:modelValue': (val: boolean) => {
						dialogState.visible.value = val;
						if (!val) cleanup();
					},
					title: dialogState.title.value ?? '',
					closeOnClickOverlay,
					class: className,
					content: dialogState.content.value,
					footer,
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
}

export function showAlert(message: string, options: Partial<DialogOptions> = {}): DialogInstance {
	const instance = showDialog({
		title: '警告',
		content: {
			setup() {
				return () => h('h3', { class: 'data-detail' }, message);
			},
		},
		footer: {
			setup() {
				return () =>
					h('div', { class: 'dialog-footer' }, [
						h(
							'button',
							{
								onClick: () => instance.close(),
								style: {
									backgroundColor: 'var(--error-color)',
									color: 'white',
								},
							},
							'确定'
						),
					]);
			},
		},
		className: 'alert-dialog',
		...options,
	});
	return instance;
}

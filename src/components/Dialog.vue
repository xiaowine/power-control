<template>
	<Transition name="dialog-fade">
		<div
			v-if="modelValue"
			class="dialog-overlay"
			@mousedown="handleMouseDown"
			@mouseup="handleMouseUp"
		>
			<div class="dialog-container" @click.stop>
				<div class="dialog-header">
					<h3>{{ title }}</h3>
					<button class="close-btn" @click="close">×</button>
				</div>
				<div class="dialog-content">
					<component :is="content" @click.stop />
				</div>
				<div class="dialog-footer" v-if="footer">
					<component :is="footer" />
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
	interface DialogProps {
		modelValue: boolean;
		title: string;
		closeOnClickOverlay: boolean;
		content?: any;
		footer?: any;
	}

	const props = withDefaults(defineProps<DialogProps>(), {
		modelValue: false,
		title: '提示',
		closeOnClickOverlay: true,
		content: undefined,
		footer: undefined,
	});

	const emit = defineEmits<{
		'update:modelValue': [value: boolean];
	}>();

	const close = () => {
		emit('update:modelValue', false);
	};

	let mouseDownPosition: { x: number; y: number } | null = null;

	const handleMouseDown = (event: MouseEvent) => {
		mouseDownPosition = { x: event.clientX, y: event.clientY };
	};

	const handleMouseUp = (event: MouseEvent) => {
		if (mouseDownPosition) {
			const dialogContainer = document.querySelector('.dialog-container');
			const rect = dialogContainer?.getBoundingClientRect();

			if (rect) {
				const isMouseDownInside =
					mouseDownPosition.x >= rect.left &&
					mouseDownPosition.x <= rect.right &&
					mouseDownPosition.y >= rect.top &&
					mouseDownPosition.y <= rect.bottom;

				const isMouseUpInside =
					event.clientX >= rect.left &&
					event.clientX <= rect.right &&
					event.clientY >= rect.top &&
					event.clientY <= rect.bottom;

				// 如果按下和松开都不在对话框内，则关闭对话框
				if (!isMouseDownInside && !isMouseUpInside) {
					close();
				}
			}
		}
		mouseDownPosition = null; // 重置位置
	};
</script>

<style>
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
	}

	.dialog-container {
		background: var(--bg-primary);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow-lg);
		width: 400px;
		min-width: 280px;
		max-width: 90vw;
		display: flex;
		flex-direction: column;
		animation: dialog-fade-in 0.2s ease-out;
	}

	.dialog-header {
		padding: 16px;
		/* border-bottom: 1px solid var(--border-color); */
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.dialog-header h3 {
		margin: 0;
		font-size: 1.2em;
		color: var(--text-primary);
		font-weight: 500;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5em;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 4px 8px;
		margin: -4px -8px -4px 0;
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	.close-btn:hover {
		color: var(--text-primary);
		background: var(--bg-secondary);
	}

	.dialog-content {
		padding-right: 16px;
		padding-left: 16px;
	}

	.dialog-footer {
		padding: 0 10px 10px 0;
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	@keyframes dialog-fade-in {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-color-scheme: dark) {
		.dialog-overlay {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	@media (max-width: 768px) {
		.dialog-container {
			width: calc(100vw - 32px) !important;
			margin: 16px;
		}
	}
</style>

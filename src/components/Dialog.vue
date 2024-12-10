<template>
	<Transition name="dialog-fade">
		<div v-if="modelValue" class="dialog-overlay" @click="handleOverlayClick">
			<div class="dialog-container">
				<div class="dialog-header">
					<h3>{{ title }}</h3>
					<button class="close-btn" @click="close">×</button>
				</div>
				<div class="dialog-content">
					<component :is="content" />
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

	const handleOverlayClick = () => {
		if (props.closeOnClickOverlay) {
			close();
		}
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
		border-bottom: 1px solid var(--border-color);
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
		padding: 16px;
	}

	.dialog-footer {
		/* padding: 16px; */
		padding: 0 10px 10px 0;
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	.dialog-input-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.dialog-input {
		flex: 1;
		min-width: 0;
		padding: 8px 12px;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 1.1em;
		background: var(--bg-secondary);
		color: var(--text-primary);
		text-align: center;
	}

	.dialog-input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
	}

	.dialog-unit {
		font-size: 1.1em;
		color: var(--text-secondary);
		padding: 0 4px;
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

	/* 深色模式适配 */
	@media (prefers-color-scheme: dark) {
		.dialog-overlay {
			background: rgba(0, 0, 0, 0.7);
		}
	}

	/* 响应式调整 */
	@media (max-width: 768px) {
		.dialog-container {
			width: calc(100vw - 32px) !important;
			margin: 16px;
		}
	}
</style>

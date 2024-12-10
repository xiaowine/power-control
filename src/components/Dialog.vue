<template>
	<Transition name="dialog-fade">
		<div v-if="modelValue" class="dialog-overlay" @click="handleOverlayClick">
			<div class="dialog-container" :style="{ width }">
				<!-- 标题栏 -->
				<div class="dialog-header">
					<h3>{{ title }}</h3>
					<button class="dialog-close" @click="close">×</button>
				</div>

				<!-- 内容区 -->
				<div class="dialog-content">
					<slot></slot>
				</div>

				<!-- 底部按钮区 -->
				<div class="dialog-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
	interface DialogProps {
		modelValue: boolean;
		title: string;
		width: string;
		closeOnClickOverlay: boolean;
	}

	const props = withDefaults(defineProps<DialogProps>(), {
		modelValue: false,
		title: '提示',
		width: '400px',
		closeOnClickOverlay: true,
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

<style scoped>
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.dialog-container {
		background: var(--bg-primary);
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
		max-width: 90%;
		max-height: 90vh;
	}

	.dialog-header {
		padding: 15px 20px;
		border-bottom: 1px solid var(--border-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.dialog-header h3 {
		margin: 0;
		font-size: 16px;
		color: var(--text-primary);
		border: none;
		padding: 0;
	}

	.dialog-close {
		background: none;
		border: none;
		font-size: 20px;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0;
		margin: 0;
		width: 24px;
		height: 24px;
		line-height: 24px;
		transition: color 0.3s;
	}

	.dialog-close:hover {
		color: var(--text-primary);
		transform: none;
		background: none;
	}

	.dialog-content {
		padding: 20px;
		max-height: calc(90vh - 120px);
		overflow-y: auto;
	}

	.dialog-footer {
		padding: 10px 20px;
		border-top: 1px solid var(--border-color);
		text-align: right;
	}

	/* 动画效果 */
	.dialog-fade-enter-active,
	.dialog-fade-leave-active {
		transition: opacity 0.3s ease;
	}

	.dialog-fade-enter-from,
	.dialog-fade-leave-to {
		opacity: 0;
	}

	.dialog-fade-enter-active .dialog-container {
		animation: dialog-zoom-in 0.3s ease-out forwards;
	}

	.dialog-fade-leave-active .dialog-container {
		animation: dialog-zoom-out 0.3s ease-in forwards;
	}

	@keyframes dialog-zoom-in {
		0% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}

	@keyframes dialog-zoom-out {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0.9);
		}
	}
</style>

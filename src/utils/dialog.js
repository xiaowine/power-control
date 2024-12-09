import { createApp, h, ref, onMounted } from 'vue';
import Dialog from '../components/Dialog.vue';

/**
 * 弹窗配置选项类型定义
 * @typedef {Object} DialogOptions
 * @property {string} [title='提示'] - 弹窗标题
 * @property {string|Object} [content=''] - 弹窗内容
 * @property {string} [width='400px'] - 弹窗宽度
 * @property {boolean} [closeOnClickOverlay=true] - 点击遮罩是否关闭
 * @property {Object} [footer=null] - 底部按钮区域
 * @property {Function} [onClose=()=>{}] - 关闭回调
 * @property {Function} [onOpen=()=>{}] - 打开回调
 * @property {string} [className=''] - 自定义类名
 */

/**
 * 弹窗实例类型定义
 * @typedef {Object} DialogInstance
 * @property {Function} close - 关闭弹窗方法
 * @property {Function} updateContent - 更新内容方法
 * @property {Function} updateTitle - 更新标题方法
 */

/**
 * 显示弹窗的通用方法
 * @param {DialogOptions} options - 弹窗配置选项
 * @returns {DialogInstance} 返回弹窗实例
 * @throws {Error} 当创建弹窗失败时抛出错误
 */
export function showDialog (options = {}) {
  try {
    // 解��置项，设置默认值
    const {
      title = '提示',
      content = '',
      width = '400px',
      closeOnClickOverlay = true,
      footer = null,
      onClose = () => { },
      onOpen = () => { },
      className = '',
    } = options;

    // 创建一个DOM挂载点
    const mountNode = document.createElement('div');
    className && mountNode.classList.add(className);
    document.body.appendChild(mountNode);

    // 创建响应式状态
    const dialogState = {
      visible: ref(true),
      title: ref(title),
      content: ref(content),
    };

    // 清理函数
    const cleanup = () => {
      try {
        app.unmount();
        mountNode.remove();
        onClose();
        dialogState.currentDialog = null;
      } catch (error) {
        console.error('Dialog cleanup failed:', error);
      }
    };

    // 创建Vue应用实例
    const app = createApp({
      setup () {
        // 生命周期钩子
        onMounted(() => {
          try {
            onOpen();
          } catch (error) {
            console.error('Dialog onOpen callback failed:', error);
          }
        });

        // 处理关闭事件
        const handleClose = () => {
          dialogState.visible.value = false;
          cleanup();
        };

        // 渲染函数
        return () =>
          h(Dialog, {
            modelValue: dialogState.visible.value,
            'onUpdate:modelValue': (val) => {
              dialogState.visible.value = val;
              if (!val) cleanup();
            },
            title: dialogState.title.value,
            width,
            closeOnClickOverlay,
            class: className,
          }, {
            default: () =>
              typeof dialogState.content.value === 'string'
                ? dialogState.content.value
                : h(dialogState.content.value),
            ...(footer && { footer: () => h(footer) })
          });
      },
    });

    // 挂载应用
    app.mount(mountNode);

    // 创建弹窗实例
    const instance = {
      // 关闭方法
      close: () => {
        dialogState.visible.value = false;
        cleanup();
      },
      // 更新内容方法
      updateContent: (newContent) => {
        dialogState.content.value = newContent;
      },
      // 更新标题方法
      updateTitle: (newTitle) => {
        dialogState.title.value = newTitle;
      },
    };

    // 保存当前弹窗实例
    dialogState.currentDialog = instance;

    return instance;
  } catch (error) {
    console.error('Failed to create dialog:', error);
    throw new Error('Failed to create dialog');
  }
}

/**
 * 全局弹状���管理
 */
export const dialogManager = {
  // 当前活动的弹窗列表
  dialogs: new Set(),

  /**
   * 添加弹窗实例
   * @param {DialogInstance} dialog - 弹窗实例
   */
  add (dialog) {
    this.dialogs.add(dialog);
  },

  /**
   * 移除弹窗实例
   * @param {DialogInstance} dialog - 弹窗实例
   */
  remove (dialog) {
    this.dialogs.delete(dialog);
  },

  /**
   * 关闭所有弹窗
   */
  closeAll () {
    this.dialogs.forEach(dialog => dialog.close());
    this.dialogs.clear();
  },

  /**
   * 获取当前弹窗数量
   * @returns {number} 弹窗数量
   */
  get count () {
    return this.dialogs.size;
  },
};

/**
 * 显示警告弹窗
 * @param {string} message - 警告信息
 * @param {Object} [options] - 额外配置选项
 * @returns {DialogInstance} 返回弹窗实例
 */
export function showAlert (message, options = {}) {
  return showDialog({
    title: '警告',
    content: message,
    width: '300px',
    footer: {
      setup () {
        return () =>
          h('button', {
            onClick: () => dialogManager.closeAll(),
            style: {
              width: '100%',
              margin: '0',
              backgroundColor: 'var(--error-color)',
              color: 'white',
            },
          }, '确定');
      },
    },
    className: 'alert-dialog',
    ...options,
  });
}
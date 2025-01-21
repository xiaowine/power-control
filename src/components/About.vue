<!-- src/components/About.vue -->
<template>
  <div class="section about">
    <div class="avatar-container">
      <div class="avatar-image"></div>
    </div>
    <a href="https://github.com/xiaowine" target="_blank">
      <div class="github-icon"></div>
    </a>
    <div class="author-name">xiao_wine</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* 主容器样式 */
.section.about {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  background-image: url("../assets/aurora.webp");
  border-radius: var(--border-radius);
  overflow: hidden;
}

.section:last-child::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0.3)
  );
  z-index: 0;
}

/* 头像相关样式 */
.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
  border: 4px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  background: url("../assets/avatar.jpg") center center no-repeat;
  background-size: cover;
  transition: transform 0.3s ease;
}

.avatar-container:hover .avatar-image {
  transform: scale(1.1);
}

/* GitHub 图标样式 */
.github-icon {
  width: 32px;
  height: 32px;
  margin: 20px auto;
  background: url("../assets/github.svg") center center no-repeat;
  background-size: contain;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.github-icon:hover {
  transform: scale(1.2);
}

/* 作者名称样式 */
.author-name {
  margin-top: 15px;
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: rgb-text 8s linear infinite;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

/* 动画定义 */
@keyframes rgb-text {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .author-name {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  .author-name:hover {
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .section:last-child {
    min-height: 250px;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
    margin: 15px auto;
  }

  .github-icon {
    width: 28px;
    height: 28px;
    margin: 15px auto;
  }

  .author-name {
    font-size: 1.3em;
  }
}
</style>

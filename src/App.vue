<template>
  <div class="container" v-if="!isLoginPage">
    <NavigationBar></NavigationBar>
    <div class="content">
      <div class="header">
        <div class="header-info">
          <span class="info-label">></span>
          <span class="info-value">{{ currentRouteName }}</span>
        </div>
        <div class="header-tabs">
          <div class="tab" @click="router.back()">返回</div>
        </div>
      </div>
      <div class="router-content" :class="{ 'login-content': isLoginPage }">
        <router-view v-slot="{ Component, route: currentRoute }">
          <transition name="fade" mode="out-in">
            <!-- 只有第一层 router-view 进行强制重新渲染 -->
            <component :is="Component" :key="'/' + currentRoute.path.split('/')[0]" />
          </transition>
        </router-view>
      </div>
    </div>
    <Footer></Footer>
    <div class="watermark">
      <img src="/svg/无锡学院-logo.svg"></img>
    </div>
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from './router'
import NavigationBar from './components/NavigationBar.vue';
import Footer from './components/Footer.vue';

const route = useRoute()

// 获取当前路由名称用于显示
const currentRouteName = computed(() => {
  const name = route.name?.toString() || 'home'
  return name.replace(/_/g, ' ')
})

const isLoginPage = computed(() => route.path === '/')
</script>

<style scoped>
/* router-view 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  /* transform: translateY(10px); */
}

.fade-leave-to {
  opacity: 0;
  /* transform: translateY(-10px); */
}

.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    background-color: #6f2b75;
    height: 40px;
    z-index: 99;

    .header-info {
      display: flex;
      gap: 10px;
      flex-direction: row;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      padding: 5px 10px;
      margin-left: 100px;
    }

    .header-tabs {
      display: flex;
      gap: 10px;
      flex-direction: row;
      align-items: center;
      padding: 5px 10px;

      .tab {
        cursor: pointer;
        color: #fff;
      }
    }
  }

  .router-content {
    padding-left: 100px;
  }

  .router-content.login-content {
    padding-left: 0;
  }
}

.watermark { 
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  opacity: 0.1;
  transform: translate(-50%, -50%);
}
</style>

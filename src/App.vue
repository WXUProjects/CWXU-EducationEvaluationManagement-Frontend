<template>
  <ToastNotification />
  <div class="container">
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
      <div class="router-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
      <Footer></Footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from './router'
import NavigationBar from './components/NavigationBar.vue';
import ToastNotification from './components/ToastNotification.vue';
import Footer from './components/Footer.vue';

const route = useRoute()

// 获取当前路由名称用于显示
const currentRouteName = computed(() => {
  const name = route.name?.toString() || 'home'
  return name.replace(/_/g, ' ')
})
</script>

<style scoped>
/* router-view 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
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

    .header-info {
      display: flex;
      gap: 10px;
      flex-direction: row;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      padding: 5px 10px;
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
    flex: 1;
  }
}
</style>

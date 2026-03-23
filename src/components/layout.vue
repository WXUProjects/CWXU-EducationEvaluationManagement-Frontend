<template>
    <div class="rvcontainer">
        <router-view v-slot="{ Component, route }">
            <transition name="fadeb" mode="out-in">
                <keep-alive>
                    <component :is="Component" :key="route.name"></component>
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>

<style scoped>
/* router-view 过渡动画 */
.fadeb-enter-active,
.fadeb-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fadeb-enter-from {
    opacity: 0;
    transform: translateX(10px);
}

.fadeb-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}


.rvcontainer {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px 10px 0 0;
    width: calc(100% - 20px);
}

.rvcontent{
    width: 100%;
}
</style>
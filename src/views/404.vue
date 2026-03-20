<template>
    <div class="nf-container">
        <div class="code">404</div>
        <div class="text">页面未找到</div>
        <div class="back" @click="handleBack">返回上一页</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const handleBack = () => {
    router.back()
}
</script>

<style scoped>
.nf-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 40px);
    width: 100%;

    .code {
        padding: 10px 80px;
        font-size: 5rem;
        font-weight: bold;
        color: #fff;
        background-color: #6f2b75;
    }

    .text {
        font-size: 1.5rem;
        font-weight: 500;
        color: #6f2b75;
    }

    .back {
        position: relative;
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 1rem;
        font-weight: 500;
        color: #fff;
        background-color: #6f2b75;
        border-radius: 14px;
        padding-left: 30px;

        &::before {
            content: '<';
            left: 15px;
            position: absolute;
            transition: all 0.2s ease-in-out;
        }


        &:hover&::before {
            content: '<';
            left: 10px;
            position: absolute;
        }

        &:hover {
            cursor: pointer;
            background-color: #5f2b75;
        }
    }
}
</style>
<template>
    <div>
        <div>这是一个示例页面</div>
        <button @click="info">测试Toast插件 信息</button>
        <button @click="success">测试Toast插件 成功</button>
        <button @click="warn">测试Toast插件 警告</button>
        <button @click="error">测试Toast插件 错误</button>
    </div>
</template>

<script setup lang="ts">
import Toast from '@/utils/toast';

const info = () => {
    Toast.info('测试Toast插件 信息');
};
const success = () => {
    Toast.success('测试Toast插件 成功');
};
const warn = () => {
    Toast.warn('测试Toast插件 警告');
};
const error = () => {
    Toast.error('测试Toast插件 错误');
};
</script>
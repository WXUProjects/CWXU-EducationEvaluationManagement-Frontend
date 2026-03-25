<script setup lang="ts">
import router from '@/router';
</script>

<template>
    <div class="HomeContainer">
        <el-card class="progress-card">
            <template #header>
                <span>评教任务</span>
            </template>
            <el-row :gutter="20" class="progress-stats">
                <el-col :span="8">
                    <div class="stat-item">
                        <div class="stat-value complete">1</div>
                        <div class="stat-label">进行中</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="stat-item">
                        <div class="stat-value uncomplete">1</div>
                        <div class="stat-label">已结束</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="stat-item">
                        <div class="stat-value total">1</div>
                        <div class="stat-label">未开始</div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="actions-card">
            <template #header>
                <span>快捷入口</span>
            </template>
            <el-button size="large" type="primary" @click="router.push('/evaluations')">管理评教任务</el-button>
            <el-button size="large" type="primary" @click="router.push('/teaching-classes')">管理教学班级</el-button>
            <el-button size="large" type="primary" @click="router.push('/teachers')">管理教师</el-button>
            <el-button size="large" type="primary" @click="router.push('/students')">管理学生</el-button>
        </el-card>
    </div>
</template>

<style scoped>
.HomeContainer {
    display: flex;
    flex-direction: column;
    width: calc(100% - 20px);
    padding: 20px 0;
}

.progress-card,
.actions-card {
    margin-bottom: 20px;
}

.progress-stats {
    margin-bottom: 20px;
}

.stat-item {
    text-align: center;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
}

.stat-value {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
}

.stat-value.complete {
    color: #67c23a;
}

.stat-value.uncomplete {
    color: #e6a23c;
}

.stat-value.total {
    color: #409eff;
}

.stat-label {
    font-size: 14px;
    color: #666;
}
</style>
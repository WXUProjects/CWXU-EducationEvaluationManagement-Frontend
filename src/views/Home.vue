<script setup lang="ts">
import { api } from '@/api';
import router from '@/router';
import { onMounted, ref } from 'vue';
const data = ref({
    notStarted: 0,
    finished: 0,
    inProgress: 0
})

const fetchTaskList = async () => {
    const result = await api.task.getTaskList({ status: '-1' })

    // 统计状态 0->未开始 1->进行中 2->已结束
    data.value.notStarted = 0;
    data.value.finished = 0;
    data.value.inProgress = 0;

    result.data.tasks.forEach(task => {
        if (task.status === 0) {
            data.value.notStarted++;
        } else if (task.status === 1) {
            data.value.inProgress++;
        } else if (task.status === 2) {
            data.value.finished++;
        }
    });
}

onMounted(() => {
    fetchTaskList();
})
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
                        <div class="stat-value complete">{{ data.inProgress }}</div>
                        <div class="stat-label">进行中</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="stat-item">
                        <div class="stat-value uncomplete">{{ data.finished }}</div>
                        <div class="stat-label">已结束</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="stat-item">
                        <div class="stat-value total">{{ data.notStarted }}</div>
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
            <el-button size="large" type="primary" @click="router.push('/teaching-courses')">管理教学班级</el-button>
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
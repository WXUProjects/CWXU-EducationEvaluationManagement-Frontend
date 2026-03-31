<template>
    <div class="edit-evaluation-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>{{ taskDetail.name || '评教任务详情' }}</h2>
            <div class="header-actions">
                <el-button @click="handleCancel">返回</el-button>
                <el-button type="primary" @click="handleChangeStatus" :loading="statusLoading">
                    {{ getStatusActionText() }}
                </el-button>
                <el-button type="primary" @click="handleExport" :loading="exportLoading">导出结果</el-button>
            </div>
        </div>

        <!-- 任务信息卡片 -->
        <el-card class="info-card">
            <template #header>
                <span>任务信息</span>
            </template>
            <el-form :model="formData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="任务名称">
                            <el-input v-model="formData.name" placeholder="请输入任务名称" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务状态">
                            <el-tag :type="getStatusTagType(formData.status)" size="large">
                                {{ getStatusText(formData.status) }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <!-- 进度统计卡片 -->
        <el-card class="progress-card" v-if="taskDetail.course && taskDetail.course.length > 0">
            <template #header>
                <span>评价进度统计</span>
            </template>
            <el-row :gutter="20" class="progress-stats">
                <el-col :span="6">
                    <div class="stat-item">
                        <div class="stat-value total">{{ totalStudents }}</div>
                        <div class="stat-label">总学生数</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item">
                        <div class="stat-value complete">{{ totalEvaluated }}</div>
                        <div class="stat-label">已评价数</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item">
                        <div class="stat-value uncomplete">{{ totalStudents - totalEvaluated }}</div>
                        <div class="stat-label">未评价数</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item">
                        <div class="stat-value" :class="getCompletionRateClass()">
                            {{ completionRate }}%
                        </div>
                        <div class="stat-label">完成率</div>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <!-- 班级列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>查看详情 ({{ taskDetail.course ? taskDetail.course.length : 0 }})</span>
                </div>
            </template>
            <el-table :data="taskDetail.course" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="课程ID" width="100" />
                <el-table-column prop="name" label="课程名称" min-width="200" />
                <el-table-column label="评价进度" width="120">
                    <template #default="{ row }">
                        <el-progress
                            :percentage="row.totalNum > 0 ? Math.round((row.evaluationNum / row.totalNum) * 100) : 0"
                            :stroke-width="10" :color="row.evaluationNum === row.totalNum ? '#67c23a' : '#409eff'" />
                    </template>
                </el-table-column>
                <el-table-column label="评价统计" width="180">
                    <template #default="{ row }">
                        <div style="font-size: 12px;">
                            <div>已评价: <span style="color: #67c23a; font-weight: bold;">{{ row.evaluationNum }}</span>
                            </div>
                            <div>未评价: <span style="color: #e6a23c; font-weight: bold;">{{ row.totalNum -
                                row.evaluationNum }}</span></div>
                            <div>总人数: <span style="color: #409eff; font-weight: bold;">{{ row.totalNum }}</span></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluationScore" label="平均得分" width="100">
                    <template #default="{ row }">
                        <span v-if="row.evaluationNum > 0" style="color: #f56c6c; font-weight: bold;">
                            {{ (row.evaluationScore / row.evaluationNum).toFixed(1) }}
                        </span>
                        <span v-else style="color: #909399;">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleViewCourse(row)" :disabled="true">
                            查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '@/api'
import type { TaskDetailResponse, CourseEvaluationStats } from '@/api/task'

const route = useRoute()
const router = useRouter()

// 路由参数
const taskId = ref(route.params.id as string)

// 加载状态
const loading = ref(false)
const statusLoading = ref(false)
const exportLoading = ref(false)

// 任务详情数据
const taskDetail = ref<TaskDetailResponse>({
    id: '',
    name: '',
    status: 0,
    course: []
})

// 表单数据（用于显示）
const formData = reactive({
    name: '',
    status: 0
})

// 获取状态文本
const getStatusText = (status: number) => {
    switch (status) {
        case 0: return '未开始'
        case 1: return '进行中'
        case 2: return '已结束'
        default: return '未知'
    }
}

// 获取状态标签类型
const getStatusTagType = (status: number) => {
    switch (status) {
        case 0: return 'info'
        case 1: return 'success'
        case 2: return 'warning'
        default: return 'info'
    }
}

// 获取状态操作文本
const getStatusActionText = () => {
    switch (formData.status) {
        case 0: return '开始任务'
        case 1: return '结束任务'
        case 2: return '重新开始'
        default: return '修改状态'
    }
}

// 计算统计信息
const totalStudents = computed(() => {
    if (!taskDetail.value.course) return 0
    return taskDetail.value.course.reduce((sum, course) => sum + course.totalNum, 0)
})

const totalEvaluated = computed(() => {
    if (!taskDetail.value.course) return 0
    return taskDetail.value.course.reduce((sum, course) => sum + course.evaluationNum, 0)
})

const completionRate = computed(() => {
    if (totalStudents.value === 0) return 0
    return Math.round((totalEvaluated.value / totalStudents.value) * 100)
})

const getCompletionRateClass = () => {
    if (completionRate.value >= 90) return 'complete'
    if (completionRate.value >= 50) return 'uncomplete'
    return 'total'
}

// 获取任务详情
const fetchTaskDetail = async () => {
    loading.value = true
    try {
        const response = await api.task.getTaskDetail(taskId.value)
        taskDetail.value = response
        formData.name = response.name
        formData.status = response.status
    } catch (error) {
        console.error('获取任务详情失败:', error)
        ElMessage.error('获取任务详情失败')
    } finally {
        loading.value = false
    }
}

// 修改任务状态
const handleChangeStatus = async () => {
    let newStatus = 0
    let confirmMessage = ''

    switch (formData.status) {
        case 0: // 未开始 -> 进行中
            newStatus = 1
            confirmMessage = '确定要开始这个评教任务吗？开始后学生将可以提交评价。'
            break
        case 1: // 进行中 -> 已结束
            newStatus = 2
            confirmMessage = '确定要结束这个评教任务吗？结束后学生将不能再提交评价。'
            break
        case 2: // 已结束 -> 重新开始（设为未开始）
            newStatus = 0
            confirmMessage = '确定要重新开始这个评教任务吗？任务状态将重置为未开始。'
            break
    }

    try {
        await ElMessageBox.confirm(confirmMessage, '提示', {
            type: 'warning'
        })

        statusLoading.value = true
        await api.task.changeTaskStatus({
            id: parseInt(taskId.value),
            status: newStatus
        })

        formData.status = newStatus
        taskDetail.value.status = newStatus
        ElMessage.success('状态修改成功')

        // 重新获取最新数据
        await fetchTaskDetail()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('状态修改失败')
        }
    } finally {
        statusLoading.value = false
    }
}

// 导出评教结果
const handleExport = () => {
    ElMessage('导出功能开发中...')
}

// 查看班级详情
const handleViewCourse = (course: CourseEvaluationStats) => {
    ElMessage.info(`查看班级详情功能开发中: ${course.name}`)
}

// 返回任务列表
const handleCancel = () => {
    router.push('/evaluations')
}

// 监听路由变化
watch(
    () => route.params.id,
    (newId) => {
        taskId.value = newId as string
        fetchTaskDetail()
    }
)

// 初始化加载
onMounted(() => {
    fetchTaskDetail()
})
</script>

<style scoped>
.edit-evaluation-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.info-card,
.progress-card,
.table-card {
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

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 功能说明样式 */
.table-card ul {
    padding-left: 20px;
    margin: 10px 0;
}

.table-card li {
    margin-bottom: 5px;
}

.table-card p {
    margin: 10px 0;
    color: #606266;
}

/* 状态标签 */
.el-tag {
    margin-right: 5px;
}
</style>
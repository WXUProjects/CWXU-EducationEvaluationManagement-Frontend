<template>
    <div class="edit-evaluation-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>新建评教任务</h2>
            <div class="header-actions">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
            </div>
        </div>

        <!-- 任务信息卡片 -->
        <el-card class="info-card">
            <template #header>
                <span>任务信息</span>
            </template>
            <el-form :model="formData" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="任务名称">
                            <el-input v-model="formData.name" placeholder="请输入任务名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <!-- 班级列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>班级列表</span>
                </div>
            </template>
            <el-table :data="courseList" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="className" label="班级名称" />
                <el-table-column label="任课教师" width="200">
                    <template #default="{ row }">
                        <div class="tag-container">
                            <el-tag v-for="(teacher, index) in row.teacherList" :key="index" size="small" class="tag">
                                {{ teacher.name }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="studentList.length" label="学生总数" width="100" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleViewCourse(row)">
                            查看班级
                        </el-button>
                        <el-button link type="danger" @click="handleRemoveCourse(row)">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 编辑评教问题 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>编辑评教问题</span>
                    <div class="table-header-acions">
                        <el-button type="primary" size="small" @click="handleImportQuestions" disabled>
                            导入评教问题
                        </el-button>
                        <el-button type="primary" size="small" @click="handleUseDefaultQuestions" disabled>
                            使用默认评教问题
                        </el-button>
                    </div>
                </div>
            </template>
            <div style="padding: 20px; text-align: center; color: #999;">
                评教问题管理功能开发中
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import type { Course } from '@/types/type'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 表单数据
const formData = reactive({
    name: '',
    courseIds: [] as number[]
})

// 课程列表
const courseList = ref<Course[]>([])
// 表格选中的课程
const selectedCourses = ref<Course[]>([])

// 获取课程列表
const fetchCourseList = async () => {
    try {
        const response = await api.course.getCourseList()
        courseList.value = response.data
    } catch (error) {
        console.error('获取课程列表失败:', error)
        ElMessage.error('获取课程列表失败')
    }
}

// 表格选择变化
const handleSelectionChange = (selection: Course[]) => {
    selectedCourses.value = selection
    formData.courseIds = selection.map(course => course.id)
}

// 提交表单
const handleSubmit = async () => {
    if (!formData.name.trim()) {
        ElMessage.warning('请输入任务名称')
        return
    }
    if (formData.courseIds.length === 0) {
        ElMessage.warning('请至少选择一个课程')
        return
    }

    loading.value = true
    try {
        await api.task.createTask({
            name: formData.name,
            courseIds: formData.courseIds
        })
        ElMessage.success('创建成功')
        router.push('/evaluations')
    } catch (error) {
        ElMessage.error('创建失败')
    } finally {
        loading.value = false
    }
}

// 取消操作
const handleCancel = () => {
    router.push('/evaluations')
}

// 查看班级详情
const handleViewCourse = (course: Course) => {
    ElMessage.info(`查看班级 ${course.className} 详情功能开发中`)
}

// 移除已选课程
const handleRemoveCourse = (course: Course) => {
    selectedCourses.value = selectedCourses.value.filter(c => c.id !== course.id)
    formData.courseIds = formData.courseIds.filter(id => id !== course.id)
    ElMessage.success(`已移除班级 ${course.className}`)
}

// 导入评教问题
const handleImportQuestions = () => {
    ElMessage.info('导入评教问题功能开发中')
}

// 使用默认评教问题
const handleUseDefaultQuestions = () => {
    ElMessage.info('使用默认评教问题功能开发中')
}

// 初始化加载课程列表
onMounted(() => {
    fetchCourseList()
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

.tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
    margin-top: 10px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.tag {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
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
                    <div class="search-filters">
                        <el-input v-model="searchQuery" placeholder="按班级名称搜索" clearable
                            style="width: 200px; margin-right: 10px;" @clear="currentPage = 1" />
                        <el-input v-model="teacherQuery" placeholder="按教师姓名搜索" clearable
                            style="width: 200px; margin-right: 10px;" @clear="currentPage = 1" />
                    </div>
                </div>
            </template>
            <el-table ref="courseTableRef" :data="paginatedCourses" border style="width: 100%" row-key="id"
                @selection-change="handleSelectionChange" :reserve-selection="true">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="className" label="班级名称" />
                <el-table-column prop="teacherList" label="任课教师" width="200">
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
            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 50]" :total="filteredCourses.length"
                    layout="total, sizes, prev, pager, next, jumper" background @size-change="currentPage = 1" />
            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, nextTick, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { api } from '@/api'
import type { Course } from '@/types/type'

const router = useRouter()

// 刷新父级侧边栏任务列表
const refreshTaskList = inject<() => Promise<void>>('refreshTaskList')

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
// 表格引用
const courseTableRef = ref()
// 恢复选择状态标志
const isRestoringSelection = ref(false)

// 分页和筛选相关
const searchQuery = ref('')
const teacherQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 计算属性：筛选后的课程列表
const filteredCourses = computed(() => {
    return courseList.value.filter(course => {
        const isActive = course.status !== 2
        const matchesClassName = searchQuery.value === '' ||
            course.className.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesTeacher = teacherQuery.value === '' ||
            (course.teacherList && course.teacherList.some(teacher =>
                teacher.name.toLowerCase().includes(teacherQuery.value.toLowerCase())
            ))
        return isActive && matchesClassName && matchesTeacher
    })
})

// 计算属性：分页后的课程列表
const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredCourses.value.slice(start, end)
})

// 监听搜索条件变化，重置页码
watch([searchQuery, teacherQuery], () => {
    currentPage.value = 1
})

// 监听分页数据变化，恢复选择状态
watch(paginatedCourses, () => {
    restoreSelection()
})

// 获取课程列表
const fetchCourseList = async () => {
    try {
        const response = await api.course.getCourseList({ page: -1 })
        courseList.value = response.data
    } catch (error) {
        console.error('获取课程列表失败:', error)
        ElMessage.error('获取课程列表失败')
    }
}

// 恢复选择状态
const restoreSelection = () => {
    isRestoringSelection.value = true
    nextTick(() => {
        if (!courseTableRef.value) {
            isRestoringSelection.value = false
            return
        }

        const table = courseTableRef.value
        // 清除当前页的选择状态
        paginatedCourses.value.forEach(row => {
            table.toggleRowSelection(row, false)
        })

        // 根据formData.courseIds恢复选择
        paginatedCourses.value.forEach(row => {
            if (formData.courseIds.includes(row.id)) {
                table.toggleRowSelection(row, true)
            }
        })

        // 恢复完成
        nextTick(() => {
            isRestoringSelection.value = false
        })
    })
}

// 表格选择变化
const handleSelectionChange = (selection: Course[]) => {
    // 如果是恢复选择过程中触发的事件，跳过处理
    if (isRestoringSelection.value) return

    // selection只包含当前页选中的行
    // 我们需要更新formData.courseIds: 保留之前选中但不在当前页的课程，加上当前页的选择
    const currentPageIds = new Set(paginatedCourses.value.map(course => course.id))
    const previousSelection = formData.courseIds.filter(id => !currentPageIds.has(id))
    const newSelection = selection.map(course => course.id)
    formData.courseIds = [...previousSelection, ...newSelection]

    // 更新selectedCourses（所有选中的课程对象）
    selectedCourses.value = courseList.value.filter(course =>
        formData.courseIds.includes(course.id)
    )
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
        refreshTaskList?.()
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
    router.push(`/teaching-courses/students/${course.id}`)
}

// 移除已选课程
const handleRemoveCourse = (course: Course) => {
    // 从选中列表中移除
    formData.courseIds = formData.courseIds.filter(id => id !== course.id)
    selectedCourses.value = selectedCourses.value.filter(c => c.id !== course.id)

    // 如果该课程在当前页显示，更新表格选择状态
    if (paginatedCourses.value.some(c => c.id === course.id)) {
        nextTick(() => {
            if (courseTableRef.value) {
                const row = paginatedCourses.value.find(c => c.id === course.id)
                if (row) {
                    courseTableRef.value.toggleRowSelection(row, false)
                }
            }
        })
    }

    ElMessage.success(`已移除班级 ${course.className}`)
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

.search-filters {
    display: flex;
    align-items: center;
}

.pagination-container {
    margin-top: 20px;
    text-align: right;
}
</style>
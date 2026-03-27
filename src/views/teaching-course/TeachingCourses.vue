<template>
    <div class="rvcontent">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>教学班级管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddCourse">添加教学班级</el-button>
                <el-button type="primary" @click="handleImportCourse">导入教学班级</el-button>
            </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :model="filterForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="班级名称">
                            <el-input v-model="filterForm.name" placeholder="请输入教学班级名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="授课教师">
                            <el-select v-model="filterForm.teachers" multiple placeholder="请选择授课教师" clearable>
                                <el-option v-for="teacher in teacherOptions" :key="teacher" :label="teacher"
                                    :value="teacher" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="班级状态">
                            <el-select v-model="filterForm.status" placeholder="请选择班级状态" clearable>
                                <el-option label="活跃" value="active"></el-option>
                                <el-option label="已结课" value="graduated"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <div class="filter-buttons">
                            <el-button type="primary" @click="handleSearch">搜索</el-button>
                            <el-button @click="handleReset">重置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <!-- 班级列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>教学班级列表</span>
                    <div class="table-header-actions">
                        <el-button type="primary" size="small" @click="handleExport">导出</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="filteredCourses" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="name" label="班级名称" />
                <el-table-column prop="teachers" label="授课教师" width="200">
                    <template #default="{ row }">
                        <div class="tag-container">
                            <el-tag v-for="(teacher, index) in row.teachers" :key="index" size="small" class="tag">
                                {{ teacher }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
                            {{ row.status === 1 ? '活跃' : '已结课' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleViewStudents(row)">管理班级学生</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 添加/编辑班级对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
            <el-form :model="courseForm" :rules="courseRules" ref="courseFormRef" label-width="100px">
                <el-form-item label="班级名称" prop="name">
                    <el-input v-model="courseForm.name" placeholder="请输入教学班级名称" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="courseForm.status">
                        <el-radio label="active">活跃</el-radio>
                        <el-radio label="graduated">已结课</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import type { Course } from '@/types/type'
import { useRouter } from 'vue-router'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 筛选表单
const filterForm = reactive({
    name: '',
    teachers: [] as string[],
    status: ''
})

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const courseFormRef = ref<FormInstance>()
const courseForm = reactive({
    id: 0,
    name: '',
    status: 'active' // active 或 graduated
})

// 表单验证规则
const courseRules = {
    name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 临时班级数据（教学班级）
const coursesData = ref<Course[]>([
    { id: 1, name: '高等数学-2021级-A班', teachers: ['Alex', 'Tom'], status: 1, students: [] },
    { id: 2, name: '大学英语-2022级-B班', teachers: ['Alex', 'Tom'], status: 1, students: [] },
    { id: 3, name: '数据结构-2020级-C班', teachers: ['Alex', 'Tom'], status: 0, students: [] },
    { id: 4, name: '计算机网络-2021级-A班', teachers: ['Alex', 'Tom'], status: 1, students: [] },
    { id: 5, name: '软件工程-2022级-B班', teachers: ['Alex', 'Tom'], status: 1, students: [] },
    { id: 6, name: '数据库系统-2020级-A班', teachers: ['Alex', 'Tom'], status: 0, students: [] },
    { id: 7, name: '操作系统-2021级-B班', teachers: ['Alex', 'Tom'], status: 1, students: [] },
    { id: 8, name: '人工智能导论-2022级-A班', teachers: ['Alex', 'Tom'], status: 1, students: [] }
])

// 教师选项（临时数据，实际应从API获取）
const teacherOptions = ref<string[]>([
    'Alex', 'Tom', 'John', 'Alice', 'Bob', 'Eve'
])

// 过滤后的班级数据
const filteredCourses = computed(() => {
    let filtered = coursesData.value

    // 按班级名称过滤
    if (filterForm.name) {
        filtered = filtered.filter(item => item.name.includes(filterForm.name))
    }

    // 按授课教师过滤（多选）
    if (filterForm.teachers.length > 0) {
        filtered = filtered.filter(item =>
            item.teachers.some(teacher => filterForm.teachers.includes(teacher))
        )
    }

    // 按状态过滤
    if (filterForm.status) {
        // 将字符串状态转换为数字：active -> 1, graduated -> 0
        const statusValue = filterForm.status === 'active' ? 1 : 0
        filtered = filtered.filter(item => item.status === statusValue)
    }

    // 更新分页总数
    pagination.total = filtered.length

    // 分页处理
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filtered.slice(start, end)
})

// 搜索
const handleSearch = () => {
    pagination.currentPage = 1
    loading.value = true
    // 模拟API调用延迟
    setTimeout(() => {
        loading.value = false
    }, 300)
}

// 重置筛选
const handleReset = () => {
    filterForm.name = ''
    filterForm.teachers = []
    filterForm.status = ''
    pagination.currentPage = 1
    handleSearch()
}

// 添加教学班级
const handleAddCourse = () => {
    dialogTitle.value = '添加教学班级'
    Object.assign(courseForm, {
        id: 0,
        name: '',
        status: 'active'
    })
    dialogVisible.value = true
}

// 导入教学班级
const handleImportCourse = () => {
    ElMessage.info('导入功能开发中...')
}

// 编辑教学班级
const handleEdit = (row: Course) => {
    dialogTitle.value = '编辑教学班级'
    Object.assign(courseForm, {
        id: row.id,
        name: row.name,
        // 将数字状态转换为字符串：1 -> 'active', 0 -> 'graduated'
        status: row.status === 1 ? 'active' : 'graduated'
    })
    dialogVisible.value = true
}

// 查看/管理班级学生
const handleViewStudents = (row: Course) => {
    router.push(`/teaching-courses/students/${row.id}`);
}

// 删除教学班级
const handleDelete = (row: Course) => {
    ElMessageBox.confirm(`确定要删除教学班级 "${row.name}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const index = coursesData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
            coursesData.value.splice(index, 1)
            ElMessage.success('删除成功')
            handleSearch()
        }
    }).catch(() => { })
}

// 导出
const handleExport = () => {
    ElMessage.success('导出功能开发中...')
}

// 分页大小改变
const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
}

// 当前页改变
const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
}

// 对话框关闭
const handleDialogClose = () => {
    if (courseFormRef.value) {
        courseFormRef.value.resetFields()
    }
}

// 表单提交
const handleSubmit = async () => {
    if (!courseFormRef.value) return

    try {
        await courseFormRef.value.validate()

        // 将字符串状态转换为数字
        const statusValue = courseForm.status === 'active' ? 1 : 0

        if (courseForm.id === 0) {
            // 添加新班级
            const newId = Math.max(...coursesData.value.map(item => item.id)) + 1
            coursesData.value.push({
                id: newId,
                name: courseForm.name,
                status: statusValue,
                teachers: [], // 默认空教师数组，实际可以添加教师选择功能
                students: []
            })
            ElMessage.success('添加成功')
        } else {
            // 更新班级
            const index = coursesData.value.findIndex(item => item.id === courseForm.id)
            if (index !== -1) {
                coursesData.value[index] = {
                    ...coursesData.value[index],
                    name: courseForm.name,
                    status: statusValue
                }
            }
            ElMessage.success('更新成功')
        }

        dialogVisible.value = false
        handleSearch()
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}

// 初始化加载数据
onMounted(() => {
    pagination.total = coursesData.value.length
    handleSearch()
})
</script>

<style scoped>
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

.filter-card,
.table-card {
    margin-bottom: 20px;
}

.filter-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-header-actions {
    display: flex;
    gap: 10px;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.courses-management {
    width: calc(100% - 40px);
    padding: 20px;
    flex-grow: 1;
}

.student-management {
    z-index: 10;
    width: 100%;
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
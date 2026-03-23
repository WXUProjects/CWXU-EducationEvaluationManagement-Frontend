<template>
    <div class="rvcontent">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>行政班级管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddClass">添加行政班级</el-button>
            </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :model="filterForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="班级名称">
                            <el-input v-model="filterForm.name" placeholder="请输入行政班级名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入学年份">
                            <el-date-picker v-model="filterForm.enrollmentYear" type="year" placeholder="选择入学年份"
                                value-format="YYYY" clearable style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="专业">
                            <el-input v-model="filterForm.major" placeholder="请输入专业" clearable />
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

        <!-- 行政班级列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>行政班级列表</span>
                    <div class="table-header-actions">
                        <el-button type="primary" size="small" @click="handleExport">导出</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="filteredClasses" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="name" label="班级名称" />
                <el-table-column prop="enrollmentYear" label="入学年份" width="120" align="center">
                    <template #default="{ row }">
                        {{ row.enrollmentYear }}级
                    </template>
                </el-table-column>
                <el-table-column prop="major" label="专业" />
                <el-table-column prop="counselor" label="辅导员" width="120" />
                <el-table-column prop="headteacher" label="班主任" width="120" />
                <el-table-column prop="studentCount" label="学生人数" width="100" align="center" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                            {{ row.status === 'active' ? '活跃' : '已毕业' }}
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

        <!-- 添加/编辑行政班级对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
            <el-form :model="classForm" :rules="classRules" ref="classFormRef" label-width="100px">
                <el-form-item label="班级名称" prop="name">
                    <el-input v-model="classForm.name" placeholder="请输入行政班级名称" />
                </el-form-item>
                <el-form-item label="入学年份" prop="enrollmentYear">
                    <el-date-picker v-model="classForm.enrollmentYear" type="year" placeholder="选择入学年份"
                        value-format="YYYY" style="width: 100%" />
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-input v-model="classForm.major" placeholder="请输入专业" />
                </el-form-item>
                <el-form-item label="辅导员" prop="counselor">
                    <el-input v-model="classForm.counselor" placeholder="请输入辅导员姓名" />
                </el-form-item>
                <el-form-item label="学生人数" prop="studentCount">
                    <el-input-number v-model="classForm.studentCount" :min="0" :max="200" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="classForm.status">
                        <el-radio label="active">活跃</el-radio>
                        <el-radio label="graduated">已毕业</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="classForm.description" type="textarea" :rows="3" placeholder="请输入班级描述" />
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
import router from '@/router'

// 加载状态
const loading = ref(false)
// 筛选表单
const filterForm = reactive({
    name: '',
    enrollmentYear: '',
    major: ''
})

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 临时行政班级数据
const classesData = ref([
    { id: 1, name: '计算机科学与技术2021级1班', enrollmentYear: '2021', major: '计算机科学与技术', studentCount: 45, counselor: '张老师', headteacher: '张老师', status: 'active', description: '2021级计算机科学与技术1班' },
    { id: 2, name: '软件工程2022级2班', enrollmentYear: '2022', major: '软件工程', studentCount: 42, counselor: '李老师', headteacher: '李老师', status: 'active', description: '2022级软件工程2班' },
    { id: 3, name: '网络工程2020级1班', enrollmentYear: '2020', major: '网络工程', studentCount: 38, counselor: '王老师', headteacher: '王老师', status: 'graduated', description: '2020级网络工程1班，已毕业' },
    { id: 4, name: '人工智能2021级1班', enrollmentYear: '2021', major: '人工智能', studentCount: 40, counselor: '赵老师', headteacher: '赵老师', status: 'active', description: '2021级人工智能1班' },
    { id: 5, name: '数据科学2022级1班', enrollmentYear: '2022', major: '数据科学', studentCount: 35, counselor: '孙老师', headteacher: '孙老师', status: 'active', description: '2022级数据科学1班' },
    { id: 6, name: '信息安全2020级1班', enrollmentYear: '2020', major: '信息安全', studentCount: 36, counselor: '周老师', headteacher: '周老师', status: 'graduated', description: '2020级信息安全1班，已毕业' },
    { id: 7, name: '物联网工程2021级1班', enrollmentYear: '2021', major: '物联网工程', studentCount: 41, counselor: '吴老师', headteacher: '吴老师', status: 'active', description: '2021级物联网工程1班' },
    { id: 8, name: '数字媒体技术2022级1班', enrollmentYear: '2022', major: '数字媒体技术', studentCount: 39, counselor: '郑老师', headteacher: '郑老师', status: 'active', description: '2022级数字媒体技术1班' },
    { id: 1, name: '计算机科学与技术2021级1班', enrollmentYear: '2021', major: '计算机科学与技术', studentCount: 45, counselor: '张老师', headteacher: '张老师', status: 'active', description: '2021级计算机科学与技术1班' },
    { id: 2, name: '软件工程2022级2班', enrollmentYear: '2022', major: '软件工程', studentCount: 42, counselor: '李老师', headteacher: '李老师', status: 'active', description: '2022级软件工程2班' },
    { id: 3, name: '网络工程2020级1班', enrollmentYear: '2020', major: '网络工程', studentCount: 38, counselor: '王老师', headteacher: '王老师', status: 'graduated', description: '2020级网络工程1班，已毕业' },
    { id: 4, name: '人工智能2021级1班', enrollmentYear: '2021', major: '人工智能', studentCount: 40, counselor: '赵老师', headteacher: '赵老师', status: 'active', description: '2021级人工智能1班' },
    { id: 5, name: '数据科学2022级1班', enrollmentYear: '2022', major: '数据科学', studentCount: 35, counselor: '孙老师', headteacher: '孙老师', status: 'active', description: '2022级数据科学1班' },
    { id: 6, name: '信息安全2020级1班', enrollmentYear: '2020', major: '信息安全', studentCount: 36, counselor: '周老师', headteacher: '周老师', status: 'graduated', description: '2020级信息安全1班，已毕业' },
    { id: 7, name: '物联网工程2021级1班', enrollmentYear: '2021', major: '物联网工程', studentCount: 41, counselor: '吴老师', headteacher: '吴老师', status: 'active', description: '2021级物联网工程1班' },
    { id: 8, name: '数字媒体技术2022级1班', enrollmentYear: '2022', major: '数字媒体技术', studentCount: 39, counselor: '郑老师', headteacher: '郑老师', status: 'active', description: '2022级数字媒体技术1班' }
])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const classFormRef = ref<FormInstance>()
const classForm = reactive({
    id: 0,
    name: '',
    enrollmentYear: '',
    major: '',
    studentCount: 0,
    counselor: '',
    headteacher: '',
    status: 'active',
    description: ''
})

// 表单验证规则
const classRules = {
    name: [{ required: true, message: '请输入行政班级名称', trigger: 'blur' }],
    enrollmentYear: [{ required: true, message: '请选择入学年份', trigger: 'change' }],
    major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
    studentCount: [{ required: true, message: '请输入学生人数', trigger: 'blur' }],
    counselor: [{ required: true, message: '请输入辅导员姓名', trigger: 'blur' }]
}

// 过滤后的班级数据
const filteredClasses = computed(() => {
    let filtered = classesData.value

    // 按名称过滤
    if (filterForm.name) {
        filtered = filtered.filter(item => item.name.includes(filterForm.name))
    }

    // 按入学年份过滤
    if (filterForm.enrollmentYear) {
        filtered = filtered.filter(item => item.enrollmentYear === filterForm.enrollmentYear)
    }

    // 按专业过滤
    if (filterForm.major) {
        filtered = filtered.filter(item => item.major.includes(filterForm.major))
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
    filterForm.enrollmentYear = ''
    filterForm.major = ''
    pagination.currentPage = 1
    handleSearch()
}

// 添加行政班级
const handleAddClass = () => {
    dialogTitle.value = '添加行政班级'
    Object.assign(classForm, {
        id: 0,
        name: '',
        enrollmentYear: '',
        major: '',
        studentCount: 0,
        counselor: '',
        headteacher: '',
        status: 'active',
        description: ''
    })
    dialogVisible.value = true
}

// 编辑行政班级
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑行政班级'
    Object.assign(classForm, { ...row })
    dialogVisible.value = true
}

// 查看学生
const handleViewStudents = (row: any) => {
    router.push(`/administrative-classes/students/${row.id}`)
}

// 删除行政班级
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定要删除行政班级 "${row.name}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const index = classesData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
            classesData.value.splice(index, 1)
            ElMessage.success('删除成功')
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
    if (classFormRef.value) {
        classFormRef.value.resetFields()
    }
}

// 表单提交
const handleSubmit = async () => {
    if (!classFormRef.value) return

    try {
        await classFormRef.value.validate()

        if (classForm.id === 0) {
            // 添加新班级
            const newId = Math.max(...classesData.value.map(item => item.id)) + 1
            classesData.value.push({
                ...classForm,
                id: newId
            })
            ElMessage.success('添加成功')
        } else {
            // 更新班级
            const index = classesData.value.findIndex(item => item.id === classForm.id)
            if (index !== -1) {
                classesData.value[index] = { ...classForm }
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
    pagination.total = classesData.value.length
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
</style>
<template>
    <div class="students-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>学生管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddStudent">添加学生</el-button>
                <el-button type="primary" @click="handleBatchImport">批量导入</el-button>
            </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :model="filterForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="学生姓名">
                            <el-input v-model="filterForm.name" placeholder="请输入学生姓名" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="学号">
                            <el-input v-model="filterForm.studentNo" placeholder="请输入学号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="身份证号">
                            <el-input v-model="filterForm.idCardNo" placeholder="请输入身份证号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="性别">
                            <el-select v-model="filterForm.sex" placeholder="请选择性别" clearable>
                                <el-option label="男" value="male" />
                                <el-option label="女" value="female" />
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

        <!-- 学生列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>学生列表</span>
                    <div class="table-header-actions">
                        <el-button type="primary" size="small" @click="handleExport">导出</el-button>
                        <el-button type="primary" size="small" @click="handleBatchExport">批量导出</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="filteredStudents" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="studentNo" label="学号" width="120" />
                <el-table-column prop="idCardNo" label="身份证号" width="300" />
                <el-table-column prop="sex" label="性别" width="80" align="center">
                    <template #default="{ row }">
                        {{ row.sex === 'male' ? '男' : '女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" />
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 批量操作 -->
            <div v-if="selectedStudents.length > 0" class="batch-actions">
                <span class="batch-count">已选择 {{ selectedStudents.length }} 个学生</span>
                <el-button type="primary" size="small" @click="handleBatchAssignCourse">批量分配班级</el-button>
                <el-button type="danger" size="small" @click="handleBatchDelete">批量删除</el-button>
            </div>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 添加/编辑学生对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
            <el-form :model="studentForm" :rules="studentRules" ref="studentFormRef" label-width="100px">
                <el-form-item label="学号" prop="studentNo">
                    <el-input v-model="studentForm.studentNo" placeholder="请输入学号" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="studentForm.name" placeholder="请输入学生姓名" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="studentForm.sex">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证号" prop="major">
                    <el-input v-model="studentForm.idCardNo" placeholder="请输入身份证号" />
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

// 加载状态
const loading = ref(false)

// 筛选表单
const filterForm = reactive({
    name: '',
    studentNo: '',
    idCardNo: '',
    sex: '',
})

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 选中的学生
const selectedStudents = ref<any[]>([])

// 班级列表（教学班级，临时数据，实际应从API获取）
const courses = ref([
    { id: 1, name: '高等数学-2021级-A班', courseCode: 'MATH101', courseName: '高等数学' },
    { id: 2, name: '大学英语-2022级-B班', courseCode: 'ENG201', courseName: '大学英语' },
    { id: 3, name: '数据结构-2020级-C班', courseCode: 'CS301', courseName: '数据结构' },
    { id: 4, name: '计算机网络-2021级-A班', courseCode: 'CS402', courseName: '计算机网络' },
    { id: 5, name: '软件工程-2022级-B班', courseCode: 'CS501', courseName: '软件工程' },
    { id: 6, name: '数据库系统-2020级-A班', courseCode: 'CS302', courseName: '数据库系统' },
    { id: 7, name: '操作系统-2021级-B班', courseCode: 'CS401', courseName: '操作系统' },
    { id: 8, name: '人工智能导论-2022级-A班', courseCode: 'CS601', courseName: '人工智能导论' }
])

// 行政班级列表（临时数据，实际应从API获取）
const administrativeCourses = ref([
    { id: 1, name: '计算机科学与技术2021级1班', enrollmentYear: '2021', major: '计算机科学与技术', counselor: '张老师' },
    { id: 2, name: '软件工程2022级2班', enrollmentYear: '2022', major: '软件工程', counselor: '李老师' },
    { id: 3, name: '网络工程2020级1班', enrollmentYear: '2020', major: '网络工程', counselor: '王老师' },
    { id: 4, name: '人工智能2021级1班', enrollmentYear: '2021', major: '人工智能', counselor: '赵老师' },
    { id: 5, name: '数据科学2022级1班', enrollmentYear: '2022', major: '数据科学', counselor: '孙老师' },
    { id: 6, name: '信息安全2020级1班', enrollmentYear: '2020', major: '信息安全', counselor: '周老师' },
    { id: 7, name: '物联网工程2021级1班', enrollmentYear: '2021', major: '物联网工程', counselor: '吴老师' },
    { id: 8, name: '数字媒体技术2022级1班', enrollmentYear: '2022', major: '数字媒体技术', counselor: '郑老师' }
])

// 临时学生数据（一个学生可以有多个教学班级，但只有一个行政班级）
const studentsData = ref([
    { id: 1, studentNo: '20210001', idCardNo: '130000000000000001', name: '张三', sex: 'male', },
    { id: 2, studentNo: '20210002', idCardNo: '130000000000000001', name: '李四', sex: 'female', },
    { id: 3, studentNo: '20210003', idCardNo: '130000000000000001', name: '王五', sex: 'male', },
    { id: 4, studentNo: '20210004', idCardNo: '130000000000000001', name: '赵六', sex: 'male', },
    { id: 5, studentNo: '20200005', idCardNo: '130000000000000001', name: '钱七', sex: 'female', },
    { id: 6, studentNo: '20210006', idCardNo: '130000000000000001', name: '孙八', sex: 'male', },
    { id: 7, studentNo: '20210007', idCardNo: '130000000000000001', name: '周九', sex: 'female', },
    { id: 8, studentNo: '20200008', idCardNo: '130000000000000001', name: '吴十', sex: 'male', },
    { id: 1, studentNo: '20210001', idCardNo: '130000000000000001', name: '张三', sex: 'male', },
    { id: 2, studentNo: '20210002', idCardNo: '130000000000000001', name: '李四', sex: 'female', },
    { id: 3, studentNo: '20210003', idCardNo: '130000000000000001', name: '王五', sex: 'male', },
    { id: 4, studentNo: '20210004', idCardNo: '130000000000000001', name: '赵六', sex: 'male', },
    { id: 5, studentNo: '20200005', idCardNo: '130000000000000001', name: '钱七', sex: 'female', },
    { id: 6, studentNo: '20210006', idCardNo: '130000000000000001', name: '孙八', sex: 'male', },
    { id: 7, studentNo: '20210007', idCardNo: '130000000000000001', name: '周九', sex: 'female', },
    { id: 8, studentNo: '20200008', idCardNo: '130000000000000001', name: '吴十', sex: 'male', }
])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const studentFormRef = ref<FormInstance>()
const studentForm = reactive({
    id: 0,
    studentNo: '',
    idCardNo: '',
    name: '',
    sex: 'male',
})

// 表单验证规则
const studentRules = {
    studentNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    idCardNo: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
}

// 过滤后的学生数据
const filteredStudents = computed(() => {
    let filtered = studentsData.value

    // 按姓名过滤
    if (filterForm.name) {
        filtered = filtered.filter(item => item.name.includes(filterForm.name))
    }

    // 按学号过滤
    if (filterForm.studentNo) {
        filtered = filtered.filter(item => item.studentNo.includes(filterForm.studentNo))
    }

    // 按身份证过滤
    if (filterForm.idCardNo) {
        filtered = filtered.filter(item => item.idCardNo.includes(filterForm.idCardNo))
    }

    // 按性别过滤
    if (filterForm.sex) {
        filtered = filtered.filter(item => item.sex === filterForm.sex)
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
    filterForm.studentNo = ''
    filterForm.sex = ''
    filterForm.idCardNo = ''
    pagination.currentPage = 1
    handleSearch()
}

// 添加学生
const handleAddStudent = () => {
    dialogTitle.value = '添加学生'
    Object.assign(studentForm, {
        id: 0,
        studentNo: '',
        idCardNo: '',
        name: '',
        sex: 'male',
    })
    dialogVisible.value = true
}

// 编辑学生
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑学生'
    Object.assign(studentForm, {
        ...row,
    })
    dialogVisible.value = true
}

// 查看详情
const handleViewDetail = (row: any) => {
    ElMessage.info(`查看学生 ${row.name} 的详细信息`)
    // 在实际应用中，这里可以跳转到学生详情页面
}

// 删除学生
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定要删除学生 "${row.name}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const index = studentsData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
            studentsData.value.splice(index, 1)
            ElMessage.success('删除成功')
        }
    }).catch(() => { })
}

// 批量导入
const handleBatchImport = () => {
    ElMessage.info('批量导入功能开发中...')
}

// 导出
const handleExport = () => {
    ElMessage.success('导出功能开发中...')
}

// 批量导出
const handleBatchExport = () => {
    if (selectedStudents.value.length === 0) {
        ElMessage.warning('请先选择要导出的学生')
        return
    }
    ElMessage.success(`批量导出 ${selectedStudents.value.length} 个学生的数据（开发中）`)
}

// 批量分配班级
const handleBatchAssignCourse = () => {
    if (selectedStudents.value.length === 0) {
        ElMessage.warning('请先选择要分配班级的学生')
        return
    }
    ElMessage.info(`批量分配班级功能开发中，已选择 ${selectedStudents.value.length} 个学生`)
}

// 批量删除
const handleBatchDelete = () => {
    if (selectedStudents.value.length === 0) {
        ElMessage.warning('请先选择要删除的学生')
        return
    }

    ElMessageBox.confirm(`确定要删除选中的 ${selectedStudents.value.length} 个学生吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const selectedIds = selectedStudents.value.map(item => item.id)
        studentsData.value = studentsData.value.filter(item => !selectedIds.includes(item.id))
        selectedStudents.value = []
        ElMessage.success('批量删除成功')
        handleSearch()
    }).catch(() => { })
}

// 选择变化
const handleSelectionChange = (selection: any[]) => {
    selectedStudents.value = selection
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
    if (studentFormRef.value) {
        studentFormRef.value.resetFields()
    }
}

// 表单提交
const handleSubmit = async () => {
    if (!studentFormRef.value) return

    try {
        await studentFormRef.value.validate()

        if (studentForm.id === 0) {
            // 添加新学生
            const newId = Math.max(...studentsData.value.map(item => item.id)) + 1
            studentsData.value.push({
                ...studentForm,
                id: newId,
            })
            ElMessage.success('添加成功')
        } else {
            // 更新学生
            const index = studentsData.value.findIndex(item => item.id === studentForm.id)
            if (index !== -1) {
                studentsData.value[index] = {
                    ...studentForm,
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
    pagination.total = studentsData.value.length
    handleSearch()
})
</script>

<style scoped>
.students-container {
    padding: 20px 10px 0 0;
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

.batch-actions {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
}

.batch-count {
    font-size: 14px;
    color: #606266;
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

.course-names {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.course-tag {
    margin-right: 4px;
}
</style>
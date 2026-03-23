<template>
    <div class="rvcontent">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>教师管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddTeacher">添加教师</el-button>
            </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :model="filterForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="教师姓名">
                            <el-input v-model="filterForm.name" placeholder="请输入教师姓名" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="教师工号">
                            <el-input v-model="filterForm.teacherId" placeholder="请输入教师工号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="职称">
                            <el-select v-model="filterForm.title" placeholder="请选择职称" clearable>
                                <el-option label="助教" value="assistant" />
                                <el-option label="讲师" value="lecturer" />
                                <el-option label="副教授" value="associate_professor" />
                                <el-option label="教授" value="professor" />
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

        <!-- 教师列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>教师列表</span>
                    <div class="table-header-actions">
                        <el-button type="primary" size="small" @click="handleExport">导出</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="filteredTeachers" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="teacherId" label="工号" width="120" />
                <el-table-column prop="name" label="姓名" width="120" />
                <el-table-column prop="gender" label="性别" width="80" align="center">
                    <template #default="{ row }">
                        {{ row.gender === 'male' ? '男' : '女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="职称" width="120">
                    <template #default="{ row }">
                        {{ getTitleLabel(row.title) }}
                    </template>
                </el-table-column>
                <el-table-column prop="department" label="院系" />
                <el-table-column prop="phone" label="联系电话" width="150" />
                <el-table-column prop="email" label="邮箱" width="200" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
                            {{ row.status === 'active' ? '在职' : '离职' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="primary" size="small" @click="handleViewCourses(row)">查看班级</el-button>
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

        <!-- 添加/编辑教师对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
            <el-form :model="teacherForm" :rules="teacherRules" ref="teacherFormRef" label-width="100px">
                <el-form-item label="工号" prop="teacherId">
                    <el-input v-model="teacherForm.teacherId" placeholder="请输入教师工号" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="teacherForm.name" placeholder="请输入教师姓名" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="teacherForm.gender">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="职称" prop="title">
                    <el-select v-model="teacherForm.title" placeholder="请选择职称">
                        <el-option label="助教" value="assistant" />
                        <el-option label="讲师" value="lecturer" />
                        <el-option label="副教授" value="associate_professor" />
                        <el-option label="教授" value="professor" />
                    </el-select>
                </el-form-item>
                <el-form-item label="院系" prop="department">
                    <el-input v-model="teacherForm.department" placeholder="请输入所属院系" />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="teacherForm.phone" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="teacherForm.email" placeholder="请输入邮箱地址" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="teacherForm.status">
                        <el-radio label="active">在职</el-radio>
                        <el-radio label="inactive">离职</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="teacherForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import router from '@/router'
import { useRoute } from 'vue-router'

// 加载状态
const loading = ref(false)
const rvhidden = ref(false)
const route = useRoute()

// 根据路由显示/隐藏 router-view
watch(() => route.path, (newPath) => {
    rvhidden.value = newPath.includes('/classes')
}, { immediate: true })

// 筛选表单
const filterForm = reactive({
    name: '',
    teacherId: '',
    title: ''
})

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 临时教师数据
const teachersData = ref([
    { id: 1, teacherId: 'T2021001', name: '张教授', gender: 'male', title: 'professor', department: '计算机科学与技术学院', phone: '13800138001', email: 'zhang@university.edu.cn', status: 'active', remark: '博士生导师，研究方向：人工智能' },
    { id: 2, teacherId: 'T2021002', name: '李老师', gender: 'female', title: 'lecturer', department: '软件工程学院', phone: '13800138002', email: 'li@university.edu.cn', status: 'active', remark: '主讲软件工程课程' },
    { id: 3, teacherId: 'T2021003', name: '王副教授', gender: 'male', title: 'associate_professor', department: '网络工程学院', phone: '13800138003', email: 'wang@university.edu.cn', status: 'active', remark: '研究方向：网络安全' },
    { id: 4, teacherId: 'T2021004', name: '赵助教', gender: 'female', title: 'assistant', department: '信息安全学院', phone: '13800138004', email: 'zhao@university.edu.cn', status: 'active', remark: '新入职教师' },
    { id: 5, teacherId: 'T2021005', name: '孙教授', gender: 'male', title: 'professor', department: '人工智能学院', phone: '13800138005', email: 'sun@university.edu.cn', status: 'active', remark: '学院院长，研究方向：机器学习' },
    { id: 6, teacherId: 'T2021006', name: '周讲师', gender: 'male', title: 'lecturer', department: '数据科学学院', phone: '13800138006', email: 'zhou@university.edu.cn', status: 'active', remark: '主讲数据挖掘课程' },
    { id: 7, teacherId: 'T2021007', name: '吴老师', gender: 'female', title: 'lecturer', department: '物联网工程学院', phone: '13800138007', email: 'wu@university.edu.cn', status: 'inactive', remark: '已离职' },
    { id: 8, teacherId: 'T2021008', name: '郑副教授', gender: 'male', title: 'associate_professor', department: '数字媒体学院', phone: '13800138008', email: 'zheng@university.edu.cn', status: 'active', remark: '研究方向：计算机图形学' },
    { id: 1, teacherId: 'T2021001', name: '张教授', gender: 'male', title: 'professor', department: '计算机科学与技术学院', phone: '13800138001', email: 'zhang@university.edu.cn', status: 'active', remark: '博士生导师，研究方向：人工智能' },
    { id: 2, teacherId: 'T2021002', name: '李老师', gender: 'female', title: 'lecturer', department: '软件工程学院', phone: '13800138002', email: 'li@university.edu.cn', status: 'active', remark: '主讲软件工程课程' },
    { id: 3, teacherId: 'T2021003', name: '王副教授', gender: 'male', title: 'associate_professor', department: '网络工程学院', phone: '13800138003', email: 'wang@university.edu.cn', status: 'active', remark: '研究方向：网络安全' },
    { id: 4, teacherId: 'T2021004', name: '赵助教', gender: 'female', title: 'assistant', department: '信息安全学院', phone: '13800138004', email: 'zhao@university.edu.cn', status: 'active', remark: '新入职教师' },
    { id: 5, teacherId: 'T2021005', name: '孙教授', gender: 'male', title: 'professor', department: '人工智能学院', phone: '13800138005', email: 'sun@university.edu.cn', status: 'active', remark: '学院院长，研究方向：机器学习' },
    { id: 6, teacherId: 'T2021006', name: '周讲师', gender: 'male', title: 'lecturer', department: '数据科学学院', phone: '13800138006', email: 'zhou@university.edu.cn', status: 'active', remark: '主讲数据挖掘课程' },
    { id: 7, teacherId: 'T2021007', name: '吴老师', gender: 'female', title: 'lecturer', department: '物联网工程学院', phone: '13800138007', email: 'wu@university.edu.cn', status: 'inactive', remark: '已离职' },
    { id: 8, teacherId: 'T2021008', name: '郑副教授', gender: 'male', title: 'associate_professor', department: '数字媒体学院', phone: '13800138008', email: 'zheng@university.edu.cn', status: 'active', remark: '研究方向：计算机图形学' }
])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const teacherFormRef = ref<FormInstance>()
const teacherForm = reactive({
    id: 0,
    teacherId: '',
    name: '',
    gender: 'male',
    title: 'lecturer',
    department: '',
    phone: '',
    email: '',
    status: 'active',
    remark: ''
})

// 表单验证规则
const teacherRules = {
    teacherId: [{ required: true, message: '请输入教师工号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
    title: [{ required: true, message: '请选择职称', trigger: 'change' }],
    department: [{ required: true, message: '请输入所属院系', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
}

// 职称标签映射
const getTitleLabel = (title: string) => {
    const map: Record<string, string> = {
        'assistant': '助教',
        'lecturer': '讲师',
        'associate_professor': '副教授',
        'professor': '教授'
    }
    return map[title] || title
}

// 过滤后的教师数据
const filteredTeachers = computed(() => {
    let filtered = teachersData.value

    // 按姓名过滤
    if (filterForm.name) {
        filtered = filtered.filter(item => item.name.includes(filterForm.name))
    }

    // 按工号过滤
    if (filterForm.teacherId) {
        filtered = filtered.filter(item => item.teacherId.includes(filterForm.teacherId))
    }

    // 按职称过滤
    if (filterForm.title) {
        filtered = filtered.filter(item => item.title === filterForm.title)
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
    filterForm.teacherId = ''
    filterForm.title = ''
    pagination.currentPage = 1
    handleSearch()
}

// 添加教师
const handleAddTeacher = () => {
    dialogTitle.value = '添加教师'
    Object.assign(teacherForm, {
        id: 0,
        teacherId: '',
        name: '',
        gender: 'male',
        title: 'lecturer',
        department: '',
        phone: '',
        email: '',
        status: 'active',
        remark: ''
    })
    dialogVisible.value = true
}

// 编辑教师
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑教师'
    Object.assign(teacherForm, { ...row })
    dialogVisible.value = true
}

// 查看课程
const handleViewCourses = (row: any) => {
    router.push(`/teachers/classes/${row.id}`)
}

// 删除教师
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定要删除教师 "${row.name}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        const index = teachersData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
            teachersData.value.splice(index, 1)
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
    if (teacherFormRef.value) {
        teacherFormRef.value.resetFields()
    }
}

// 表单提交
const handleSubmit = async () => {
    if (!teacherFormRef.value) return

    try {
        await teacherFormRef.value.validate()

        if (teacherForm.id === 0) {
            // 添加新教师
            const newId = Math.max(...teachersData.value.map(item => item.id)) + 1
            teachersData.value.push({
                ...teacherForm,
                id: newId
            })
            ElMessage.success('添加成功')
        } else {
            // 更新教师
            const index = teachersData.value.findIndex(item => item.id === teacherForm.id)
            if (index !== -1) {
                teachersData.value[index] = { ...teacherForm }
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
    pagination.total = teachersData.value.length
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
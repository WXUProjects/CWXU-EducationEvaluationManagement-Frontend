<template>
    <div class="teachers-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>教师管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleImport">导入教师</el-button>
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
                            <el-input v-model="filterForm.workNo" placeholder="请输入教师工号" clearable />
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
                </div>
            </template>
            <el-table :data="teachersData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="60" align="center" />
                <el-table-column prop="workNo" label="工号" width="100" />
                <el-table-column prop="name" label="姓名" width="140" />
                <el-table-column prop="sex" label="性别" width="60" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" />
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
                <el-form-item label="工号" prop="workNo">
                    <el-input v-model="teacherForm.workNo" placeholder="请输入教师工号" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="teacherForm.name" placeholder="请输入教师姓名" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="teacherForm.sex">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="teacherForm.email" placeholder="请输入邮箱地址" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 导入教师对话框 -->
        <el-dialog v-model="importDialogVisible" title="导入教师" width="500px" @close="handleImportDialogClose">
            <el-upload class="upload-demo" drag :show-file-list="false" :before-upload="beforeUpload"
                :on-change="handleFileChange" :auto-upload="false" action="/api/upload" name="file" :multiple="false"
                accept=".xlsx,.xls">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    拖拽文件到此处或 <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        请上传Excel文件（.xlsx 或 .xls 格式）
                    </div>
                </template>
            </el-upload>

            <!-- 显示选中的文件 -->
            <div class="selected-file" v-if="uploadFile">
                <el-tag type="success" closable @close="handleRemoveFile">
                    <el-icon>
                        <Document />
                    </el-icon>
                    <span>{{ uploadFile.name }}</span>
                </el-tag>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="importDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleImportConfirm" :loading="importLoading">开始导入</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type UploadProps } from 'element-plus'
import { UploadFilled, Document } from '@element-plus/icons-vue'
import { api } from '@/api'
import type { Teacher } from '@/types/type'

// 加载状态
const loading = ref(false)

// 筛选表单
const filterForm = reactive({
    name: '',
    workNo: '',
})

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 教师数据
const teachersData = ref<Teacher[]>([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const teacherFormRef = ref<FormInstance>()
const teacherForm = reactive({
    id: 0,
    workNo: '',
    name: '',
    sex: '男',
    email: '',
})

// 导入相关状态
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadFile = ref<File | null>(null)

// 表单验证规则
const teacherRules = {
    workNo: [{ required: true, message: '请输入教师工号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
}

// 搜索
const handleSearch = () => {
    pagination.currentPage = 1
    fetchTeacherList()
}

// 重置筛选
const handleReset = () => {
    filterForm.name = ''
    filterForm.workNo = ''
    pagination.currentPage = 1
    handleSearch()
}

const fetchTeacherList = async () => {
    loading.value = true
    try {
        const params = { page: pagination.currentPage, pageSize: pagination.pageSize, ...filterForm };
        const result = await api.baseInfo.getTeacherList(params);
        teachersData.value = result.data;
        pagination.total = Number(result.total);
        console.log('教师列表:', result.data);
        console.log('总数:', result.total);
    } catch (error) {
        console.error('获取教师列表失败:', error);
    }
    loading.value = false
}

// 导入教师
const handleImport = () => {
    importDialogVisible.value = true
    uploadFile.value = null
}

// 上传前的验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    console.log('beforeUpload called:', file.name, file.type, file.size)

    // 检查文件扩展名，不只是MIME类型
    const fileName = file.name.toLowerCase()
    const isExcelByExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
    const isExcelByType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/excel' ||
        file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12' ||
        file.type === ''

    const isExcel = isExcelByExtension || isExcelByType
    const isLt10M = file.size / 1024 / 1024 < 10

    console.log('File validation:', { isExcelByExtension, isExcelByType, isExcel, isLt10M })

    if (!isExcel) {
        ElMessage.error('只能上传Excel文件 (.xlsx 或 .xls 格式)!')
        return false
    }
    if (!isLt10M && false) {
        // 暂时不考虑大小验证
        ElMessage.error('文件大小不能超过10MB!')
        return false
    }

    uploadFile.value = file
    ElMessage.success(`文件"${file.name}"已选择，点击"开始导入"按钮开始导入`)
    return false // 返回false阻止自动上传，我们将手动触发
}

// 文件变化处理
const handleFileChange: UploadProps['onChange'] = (uploadFileObj) => {
    console.log('handleFileChange called:', uploadFileObj.name, uploadFileObj.status, uploadFileObj.raw)

    // 当文件被选择时（状态为'ready'），保存文件引用
    if (uploadFileObj.raw && uploadFileObj.status === 'ready') {
        uploadFile.value = uploadFileObj.raw
        console.log('File saved to uploadFile:', uploadFile.value?.name)

        // 验证文件
        const fileName = uploadFileObj.name.toLowerCase()
        const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
        const isLt10M = uploadFileObj.size ? uploadFileObj.size / 1024 / 1024 < 10 : true

        if (!isExcel) {
            ElMessage.warning('文件格式不正确，请上传Excel文件 (.xlsx 或 .xls 格式)')
            uploadFile.value = null
        } else if (!isLt10M && false) {
            // 暂时不考虑大小验证
            ElMessage.warning('文件大小不能超过10MB!')
            uploadFile.value = null
        } else {
            ElMessage.success(`文件"${uploadFileObj.name}"已选择，点击"开始导入"按钮开始导入`)
        }
    }
}

// 确认导入
const handleImportConfirm = async () => {
    if (!uploadFile.value) {
        ElMessage.warning('请先选择文件')
        return
    }

    try {
        importLoading.value = true
        const result = await api.baseInfo.importTeachers(uploadFile.value, { showSuccess: true })
        importDialogVisible.value = false
        fetchTeacherList() // 刷新列表
    } catch (error: any) {
        ElMessage.error(`导入失败: ${error.message || '未知错误'}`)
    } finally {
        importLoading.value = false
    }
}

// 移除已选择的文件
const handleRemoveFile = () => {
    uploadFile.value = null
    ElMessage.info('已清除选择的文件')
}

// 关闭导入对话框
const handleImportDialogClose = () => {
    uploadFile.value = null
}

// 添加教师
const handleAddTeacher = () => {
    dialogTitle.value = '添加教师'
    Object.assign(teacherForm, {
        id: 0,
        workNo: '',
        name: '',
        sex: '男',
        email: '',
    })
    dialogVisible.value = true
}

// 编辑教师
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑教师'
    Object.assign(teacherForm, {
        ...row,
    })
    dialogVisible.value = true
}

const updateTeacher = async (t: Teacher) => {
    try {
        const result = await api.baseInfo.updateTeacher(t, { showSuccess: true });
        console.log('更新成功:', result.data);
    } catch (error) {
        console.error('更新失败:', error);
    }
    fetchTeacherList();
}

const deleteTeacher = async (id: number) => {
    try {
        const result = await api.baseInfo.deleteTeacher(id, { showSuccess: true });
        console.log('删除成功:', result.message);
    } catch (error) {
        console.error('删除失败:', error);
    }
    fetchTeacherList();
}

// 删除教师
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定要删除教师 "${row.name}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        deleteTeacher(row.id);
    }).catch(() => { })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    fetchTeacherList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    fetchTeacherList()
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
            const newId = Math.max(...teachersData.value.map(item => item.id)) + 1
            teachersData.value.push({
                ...teacherForm,
                id: newId,
            })
            ElMessage.success('添加成功')
        } else {
            updateTeacher(teacherForm)
        }
        dialogVisible.value = false
        handleSearch()
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}

// 初始化加载数据
onMounted(() => {
    fetchTeacherList()
})
</script>

<style scoped>
.teachers-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
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

/* 上传样式 */
.upload-demo {
    width: 100%;
}

.upload-demo .el-upload {
    width: 100%;
}

.upload-demo .el-upload-dragger {
    width: 100%;
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.el-upload__tip {
    margin-top: 10px;
    color: #666;
    font-size: 12px;
}

.selected-file {
    margin-top: 15px;
    text-align: center;
}

.selected-file .el-tag {
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    font-size: 14px;
}

.selected-file .el-tag .el-icon {
    font-size: 16px;
}
</style>

<style>
.selected-file .el-tag .el-tag__content {
    display: flex;
    flex-direction: row;
}
</style>
<template>
    <div class="questions-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>问题管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddQuestion">添加问题</el-button>
                <el-button type="primary" @click="handleImport">导入问题</el-button>
            </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :model="filterForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="问题内容">
                            <el-input v-model="filterForm.content" placeholder="请输入问题内容关键词" clearable />
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

        <!-- 问题列表表格 -->
        <el-card class="table-card">
            <template #header>
                <div class="table-header">
                    <span>问题列表</span>
                </div>
            </template>
            <el-table :data="questionsData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="60" align="center" />
                <el-table-column prop="content" label="问题内容" min-width="300" />
                <el-table-column prop="score" label="分值" width="80" align="center" />
                <el-table-column prop="sort" label="排序" width="80" align="center" />
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

        <!-- 添加/编辑问题对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
            <el-form :model="questionForm" :rules="questionRules" ref="questionFormRef" label-width="100px">
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 导入问题对话框 -->
        <el-dialog v-model="importDialogVisible" title="导入问题" width="500px" @close="handleImportDialogClose">
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
import type { Question } from '@/types/type'

// 加载状态
const loading = ref(false)

// 筛选表单（预留，目前问题列表不需要筛选）
const filterForm = reactive({
    content: '',
})

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 问题数据
const questionsData = ref<Question[]>([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const questionFormRef = ref<FormInstance>()
const questionForm = reactive({
    id: 0,
    content: '',
    score: 10,
    sort: 1,
})

// 导入相关状态
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadFile = ref<File | null>(null)

// 表单验证规则
const questionRules = {
    content: [{ required: true, message: '请输入问题内容', trigger: 'blur' }],
    score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
    sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
}

// 搜索
const handleSearch = () => {
    fetchQuestionList()
}

// 重置筛选
const handleReset = () => {
    filterForm.content = ''
    pagination.currentPage = 1
    handleSearch()
}

const fetchQuestionList = async () => {
    loading.value = true
    try {
        const result = await api.question.getQuestionList();
        questionsData.value = result.data;
        pagination.total = result.data.length;
        console.log('问题列表:', result.data);
    } catch (error) {
        console.error('获取问题列表失败:', error);
    }
    loading.value = false
}

// 导入问题
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
        fetchQuestionList() // 刷新列表
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

// 添加问题
const handleAddQuestion = () => {
    dialogTitle.value = '添加问题'
    Object.assign(questionForm, {
        id: 0,
        content: '',
        score: 10,
        sort: 1,
    })
    dialogVisible.value = true
}

// 编辑问题
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑问题'
    Object.assign(questionForm, {
        ...row,
    })
    dialogVisible.value = true
}

const updateQuestion = async (q: Question) => {
    try {
        // 注意：这里需要调用问题更新API，但目前API只支持批量更新
        // 暂时先获取列表，然后更新整个列表
        const result = await api.question.getQuestionList();
        const questions = result.data;
        const index = questions.findIndex(item => item.id === q.id);
        if (index !== -1) {
            questions[index] = q;
            // 调用批量更新API
            await api.question.updateQuestions({ questions });
            ElMessage.success('更新成功');
        }
    } catch (error) {
        console.error('更新失败:', error);
    }
    fetchQuestionList();
}

const deleteQuestion = async (id: number) => {
    try {
        // 注意：问题API没有单独的删除接口，需要获取列表后过滤，然后批量更新
        const result = await api.question.getQuestionList();
        const questions = result.data.filter(item => item.id !== id);
        await api.question.updateQuestions({ questions });
        ElMessage.success('删除成功');
    } catch (error) {
        console.error('删除失败:', error);
    }
    fetchQuestionList();
}

// 删除问题
const handleDelete = (row: any) => {
    ElMessageBox.confirm(`确定要删除问题 "${row.content}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then(() => {
        deleteQuestion(row.id);
    }).catch(() => { })
}

// 查看班级（预留）
const handleViewCourses = (row: any) => {
    ElMessage.info('此功能对问题管理不适用')
}

// 导出
const handleExport = () => {
    ElMessage.success('导出功能开发中...')
}

// 分页大小改变
const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    fetchQuestionList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    fetchQuestionList()
}

// 对话框关闭
const handleDialogClose = () => {
    if (questionFormRef.value) {
        questionFormRef.value.resetFields()
    }
}

// 表单提交
const handleSubmit = async () => {
    if (!questionFormRef.value) return

    try {
        await questionFormRef.value.validate()

        if (questionForm.id === 0) {
            // 添加新问题：获取最大ID
            const newId = questionsData.value.length > 0
                ? Math.max(...questionsData.value.map(item => item.id)) + 1
                : 1;
            const newQuestion = { ...questionForm, id: newId };
            const updatedQuestions = [...questionsData.value, newQuestion];
            await api.question.updateQuestions({ questions: updatedQuestions });
            ElMessage.success('添加成功');
        } else {
            updateQuestion(questionForm);
        }
        dialogVisible.value = false;
        fetchQuestionList();
    } catch (error) {
        console.error('表单验证失败:', error);
    }
}

// 初始化加载数据
onMounted(() => {
    fetchQuestionList()
})
</script>

<style scoped>
.questions-container {
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
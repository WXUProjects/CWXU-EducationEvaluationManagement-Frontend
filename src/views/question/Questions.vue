<template>
    <div class="questions-container">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>问题管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleAddQuestion">添加问题</el-button>
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
                    <span>问题列表 ({{ filteredQuestions.length }})</span>
                </div>
            </template>
            <el-table :data="paginatedQuestions" border style="width: 100%" v-loading="loading">
                <el-table-column label="排序" width="100" align="center">
                    <template #default="{ $index }">
                        <div class="sort-buttons">
                            <el-button link type="primary" :disabled="$index === 0 && currentPageStartIndex === 0"
                                @click="moveQuestion($index, -1)">
                                <font-awesome-icon icon="fa-solid fa-arrow-up" />
                            </el-button>
                            <el-button link type="primary"
                                :disabled="$index === paginatedQuestions.length - 1 && currentPageStartIndex + $index === filteredQuestions.length - 1"
                                @click="moveQuestion($index, 1)">
                                <font-awesome-icon icon="fa-solid fa-arrow-down" />
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="序号" width="60" align="center">
                    <template #default="{ $index }">
                        {{ currentPageStartIndex + $index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="问题内容" min-width="300" />
                <el-table-column label="操作" width="150" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="filteredQuestions.length"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 添加/编辑问题对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" @close="handleDialogClose">
            <el-form :model="questionForm" :rules="questionRules" ref="questionFormRef" label-width="100px">
                <el-form-item label="问题内容" prop="content">
                    <el-input v-model="questionForm.content" type="textarea" :rows="4" placeholder="请输入问题内容" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { api } from '@/api'
import type { Question } from '@/types/type'

const loading = ref(false)
const submitLoading = ref(false)

const filterForm = reactive({ content: '' })
const filterActive = ref(false)

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
})

// 问题数据（完整列表）
const questionsData = ref<Question[]>([])

// 筛选后的问题列表
const filteredQuestions = computed(() => {
    if (!filterActive.value || !filterForm.content.trim()) {
        return questionsData.value
    }
    const keyword = filterForm.content.trim().toLowerCase()
    return questionsData.value.filter(q => q.content.toLowerCase().includes(keyword))
})

const currentPageStartIndex = computed(() => {
    return (pagination.currentPage - 1) * pagination.pageSize
})

const paginatedQuestions = computed(() => {
    const start = currentPageStartIndex.value
    return filteredQuestions.value.slice(start, start + pagination.pageSize)
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const questionFormRef = ref<FormInstance>()
const questionForm = reactive({ id: 0, content: '' })
const isEditing = ref(false)

const questionRules = {
    content: [{ required: true, message: '请输入问题内容', trigger: 'blur' }],
}

// 搜索 / 重置
const handleSearch = () => {
    filterActive.value = true
    pagination.currentPage = 1
}

const handleReset = () => {
    filterForm.content = ''
    filterActive.value = false
    pagination.currentPage = 1
}

// 获取问题列表
const fetchQuestionList = async () => {
    loading.value = true
    try {
        const result = await api.question.getQuestionList()
        questionsData.value = result.data
    } catch (error) {
        console.error('获取问题列表失败:', error)
    } finally {
        loading.value = false
    }
}

// 批量更新（自动重算 sort 值）
const batchUpdateQuestions = async (questions: Question[]) => {
    const updatedList = questions.map((q, index) => ({
        content: q.content,
        score: 10,
        sort: index + 1,
    }))
    await api.question.updateQuestions({ questions: updatedList })
}

// 排序：始终对 questionsData（完整列表）操作
const moveQuestion = async (pageRowIndex: number, direction: number) => {
    const filteredIdx = currentPageStartIndex.value + pageRowIndex
    const filtered = filteredQuestions.value
    const targetIdx = filteredIdx + direction
    if (targetIdx < 0 || targetIdx >= filtered.length) return

    // 在完整列表中找到这两条对应的项并交换
    const itemA = filtered[filteredIdx]!
    const itemB = filtered[targetIdx]!
    const idxA = questionsData.value.indexOf(itemA)
    const idxB = questionsData.value.indexOf(itemB)
    if (idxA === -1 || idxB === -1) return

    const list = [...questionsData.value]
    list[idxA] = itemB
    list[idxB] = itemA
    questionsData.value = list

    loading.value = true
    try {
        await batchUpdateQuestions(list)
        ElMessage.success('排序已更新')
    } catch (error) {
        console.error('更新排序失败:', error)
        ElMessage.error('更新排序失败')
        await fetchQuestionList()
    } finally {
        loading.value = false
    }
}

// 添加问题
const handleAddQuestion = () => {
    dialogTitle.value = '添加问题'
    isEditing.value = false
    questionForm.id = 0
    questionForm.content = ''
    dialogVisible.value = true
}

// 编辑问题
const handleEdit = (row: Question) => {
    dialogTitle.value = '编辑问题'
    isEditing.value = true
    questionForm.id = row.id
    questionForm.content = row.content
    dialogVisible.value = true
}

// 删除问题
const handleDelete = (row: Question) => {
    ElMessageBox.confirm(`确定要删除问题 "${row.content}" 吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(async () => {
        loading.value = true
        try {
            const list = questionsData.value.filter(q => q.id !== row.id)
            await batchUpdateQuestions(list)
            ElMessage.success('删除成功')
            await fetchQuestionList()
        } catch (error) {
            console.error('删除失败:', error)
            ElMessage.error('删除失败')
        } finally {
            loading.value = false
        }
    }).catch(() => {})
}

// 对话框关闭
const handleDialogClose = () => {
    questionFormRef.value?.resetFields()
}

// 表单提交
const handleSubmit = async () => {
    if (!questionFormRef.value) return

    try {
        await questionFormRef.value.validate()
        submitLoading.value = true

        let list: Question[]
        if (!isEditing.value) {
            // 添加：追加到末尾
            list = [...questionsData.value, {
                id: 0,
                content: questionForm.content,
                score: 10,
                sort: questionsData.value.length + 1,
            }]
        } else {
            // 编辑：替换对应项的 content
            list = questionsData.value.map(q =>
                q.id === questionForm.id ? { ...q, content: questionForm.content } : q
            )
        }

        await batchUpdateQuestions(list)
        ElMessage.success(isEditing.value ? '修改成功' : '添加成功')
        dialogVisible.value = false
        await fetchQuestionList()
    } catch (error) {
        console.error('操作失败:', error)
    } finally {
        submitLoading.value = false
    }
}

// 分页
const handleSizeChange = () => {
    pagination.currentPage = 1
}

const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
}

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

.sort-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
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

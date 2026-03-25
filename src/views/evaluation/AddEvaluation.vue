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
                            <el-input v-model="formData.title" placeholder="请输入任务名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开始时间">
                            <el-date-picker v-model="formData.startDate" type="datetime" placeholder="选择开始时间"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间">
                            <el-date-picker v-model="formData.endDate" type="datetime" placeholder="选择结束时间"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="任务描述">
                            <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入任务描述" />
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
                    <div class="table-header-acions">
                        <el-button type="primary" size="small" @click="handleAddClass">
                            添加班级
                        </el-button>
                        <el-button type="primary" size="small" @click="handleAddClass">
                            添加全部教学班级
                        </el-button>
                        <el-button type="primary" size="small" @click="handleAddClass">
                            添加全部行政班级
                        </el-button>
                    </div>
                </div>
            </template>
            <el-table :data="data.classes" border style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="班级名称" />
                <el-table-column prop="teacher" label="被评价教师" width="100" />
                <el-table-column prop="total" label="学生总数" width="100" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="handleToClass(row)">
                            查看班级
                        </el-button>
                        <el-button link type="danger" @click="handleDeleteClass(row)">
                            删除
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
                        <el-button type="primary" size="small" @click="handleAddClass">
                            导入评教问题
                        </el-button>
                        <el-button type="primary" size="small" @click="handleAddClass">
                            使用默认评教问题
                        </el-button>
                    </div>
                </div>
            </template>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 路由参数
let id = ref(route.params.id)

// 加载状态
const loading = ref(false)

// 表单数据
const formData = reactive({
    title: '评教任务 1',
    status: 1,
    startDate: '',
    endDate: '',
    description: ''
})

// 页面数据
const data = ref({
    id: id.value,
    title: '评教任务 1',
    description: '这是任务描述',
    complete: 98 * 5,
    uncomplete: 2 * 5,
    total: 100 * 5,
    status: 1,
    startDate: 1000000000,
    endDate: 1000000000,
    classes: [
        { id: 1, name: '班级 1', complete: 0, incomplete: 100, total: 100, teacher: "张教授" },
        { id: 2, name: '班级 2', complete: 0, incomplete: 100, total: 100, teacher: "李教授" },
        { id: 3, name: '班级 3', complete: 0, incomplete: 100, total: 100, teacher: "王教授" },
        { id: 4, name: '班级 4', complete: 0, incomplete: 100, total: 100, teacher: "张教授" },
        { id: 5, name: '班级 5', complete: 0, incomplete: 100, total: 100, teacher: "孙教授" }
    ]
})

// 计算完成率
const completionRate = computed(() => {
    return data.value.total > 0
        ? Math.round((data.value.complete / data.value.total) * 100)
        : 0
})

// 计算单行进度
const calculateProgress = (row: any) => {
    return row.total > 0
        ? Math.round((row.complete / row.total) * 100)
        : 0
}

// 监听路由变化
watch(
    () => route.params.id,
    (newId) => {
        id.value = newId
        fetchData()
    }
)

// 获取数据
const fetchData = async () => {
    loading.value = true
    try {
        // TODO: 调用 API 获取评教任务详情
        // const res = await getEvaluationDetail(id.value)
        // data.value = res.data
        console.log('获取任务详情:', id.value)
    } catch (error) {
        ElMessage.error('获取数据失败')
    } finally {
        loading.value = false
    }
}

// 提交保存
const handleSubmit = async () => {
    loading.value = true
    try {
        // TODO: 调用 API 保存评教任务
        // await saveEvaluation({ id: id.value, ...formData })
        ElMessage.success('保存成功')
        router.back()
    } catch (error) {
        ElMessage.error('保存失败')
    } finally {
        loading.value = false
    }
}

// 取消操作
const handleCancel = () => {
    router.back()
}

// 添加班级
const handleAddClass = () => { }

// 转到班级页面
const handleToClass = (row: any) => {
}

// 删除班级
const handleDeleteClass = (row: any) => {
    ElMessageBox.confirm('确定要删除该班级吗？', '提示', {
        type: 'warning'
    }).then(() => {
        data.value.classes = data.value.classes.filter((item) => item.id !== row.id)
        ElMessage.success('删除成功')
    }).catch(() => { })
}

// 初始化加载
fetchData()
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
</style>
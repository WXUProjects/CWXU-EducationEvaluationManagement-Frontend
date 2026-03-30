<template>
    <div class="rvcontent">
        <!-- 页面标题 -->
        <div class="page-header">
            <h2>教学班级管理</h2>
            <div class="header-actions">
                <el-button type="primary" @click="handleImportCourse">导入教学班级</el-button>
                <el-button type="primary" @click="handleExportCourse">导出教学班级</el-button>
            </div>
        </div>

        <!-- 搜索和筛选区域 -->
        <el-card class="filter-card">
            <el-form :model="filterForm" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="班级名称">
                            <el-input v-model="filterForm.className" placeholder="请输入教学班级名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="课程名称">
                            <el-input v-model="filterForm.courseName" placeholder="请输入课程名称" clearable />
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
                </div>
            </template>
            <el-table :data="filteredCourses" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="courseName" label="课程名称" width="200" />
                <el-table-column prop="className" label="班级名称" />
                <el-table-column prop="teacherList" label="授课教师" width="200">
                    <template #default="{ row }">
                        <div class="tag-container">
                            <el-tag v-for="(teacher, index) in row.teacherList" :key="index" size="small" class="tag">
                                {{ teacher.name }}
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
                <el-form-item label="课程名称" prop="courseName">
                    <el-input v-model="courseForm.courseName" placeholder="请输入课程名称" />
                </el-form-item>
                <el-form-item label="班级名称" prop="className">
                    <el-input v-model="courseForm.className" placeholder="请输入班级名称" />
                </el-form-item>
                <el-form-item label="授课教师" prop="teacherIds">
                    <el-select v-model="courseForm.teacherIds" multiple placeholder="请选择授课教师" style="width: 100%">
                        <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name"
                            :value="teacher.id" />
                    </el-select>
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

        <!-- 导入教学班级对话框 -->
        <el-dialog v-model="importDialogVisible" title="导入教学班级" width="500px" @close="handleImportDialogClose">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type UploadProps } from 'element-plus'
import { UploadFilled, Document } from '@element-plus/icons-vue'
import type { Course } from '@/types/type'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 筛选表单
const filterForm = reactive({
    className: '',
    courseName: '',
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
    courseName: '',
    className: '',
    teacherIds: [] as number[],
    status: 'active' // active 或 graduated
})

// 导入相关状态
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadFile = ref<File | null>(null)

// 表单验证规则
const courseRules = {
    courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
    className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 班级数据（从API获取）
const coursesData = ref<Course[]>([])

// 教师列表（从API获取）
const teacherList = ref<any[]>([])

// 教师选项（用于筛选下拉框）
const teacherOptions = computed(() => {
    return teacherList.value.map(teacher => teacher.name)
})

// 过滤后的班级数据（前端筛选，仅对当前页数据生效）
const filteredCourses = computed(() => {
    let filtered = coursesData.value

    // 按班级名称过滤
    if (filterForm.className) {
        filtered = filtered.filter(item => item.className.includes(filterForm.className))
    }

    // 按课程名称过滤
    if (filterForm.courseName) {
        filtered = filtered.filter(item => item.courseName.includes(filterForm.courseName))
    }

    // 按授课教师过滤（多选）
    if (filterForm.teachers.length > 0) {
        filtered = filtered.filter(item =>
            item.teacherList.some(teacher => filterForm.teachers.includes(teacher.name))
        )
    }

    // 按状态过滤
    if (filterForm.status) {
        // 将字符串状态转换为数字：active -> 1 (上课中), graduated -> 2 (已结课)
        const statusValue = filterForm.status === 'active' ? 1 : 2
        filtered = filtered.filter(item => item.status === statusValue)
    }

    return filtered
})

// 获取课程列表
const fetchCourseList = async () => {
    loading.value = true
    try {
        const params = { page: pagination.currentPage, pageSize: pagination.pageSize }
        const result = await api.course.getCourseList(params)
        coursesData.value = result.data
        console.log('课程列表:', result.data)
        pagination.total = Number(result.total)
    } catch (error) {
        console.error('获取课程列表失败:', error)
        ElMessage.error('获取课程列表失败')
    }
    loading.value = false
}

// 获取教师列表
const fetchTeacherList = async () => {
    try {
        const result = await api.baseInfo.getTeacherList({ page: 1, pageSize: 1000 })
        teacherList.value = result.data
    } catch (error) {
        console.error('获取教师列表失败:', error)
    }
}

// 搜索
const handleSearch = () => {
    pagination.currentPage = 1
    fetchCourseList()
}

// 重置筛选
const handleReset = () => {
    filterForm.className = ''
    filterForm.courseName = ''
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
        courseName: '',
        className: '',
        teacherIds: [],
        status: 'active'
    })
    dialogVisible.value = true
}

// 导入教学班级
const handleImportCourse = () => {
    importDialogVisible.value = true
    uploadFile.value = null
}

// 导出教学班级
const handleExportCourse = () => {
    ElMessage("导出功能开发中...");
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
        const result = await api.course.importCourses(uploadFile.value, { showSuccess: true })
        importDialogVisible.value = false
        fetchCourseList() // 刷新列表
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

// 编辑教学班级
const handleEdit = (row: Course) => {
    dialogTitle.value = '编辑教学班级'
    let courseName = row.courseName;
    let className = row.className;
    // 将教师名称数组转换为ID数组
    const teacherIds: number[] = []
    row.teacherList.forEach(teacher => {
        const found = teacherList.value.find(t => t.name === teacher.name)
        if (found) teacherIds.push(found.id)
    })
    Object.assign(courseForm, {
        id: row.id,
        courseName,
        className,
        teacherIds,
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
    ElMessage("删除功能开发中...");
}

// 分页大小改变
const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    fetchCourseList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    fetchCourseList()
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

        // 将字符串状态转换为数字：active -> 1 (上课中), graduated -> 2 (已结课)
        const statusValue = courseForm.status === 'active' ? 1 : 2
        try {
            const editData = {
                courseId: courseForm.id,
                courseName: courseForm.courseName,
                className: courseForm.className,
                teacherIds: courseForm.teacherIds,
                status: statusValue
            }
            const result = await api.course.editCourse(editData, { showSuccess: true })
            ElMessage.success('更新成功')
            // 更新本地数据
            const index = coursesData.value.findIndex(item => item.id === courseForm.id)
            if (index !== -1) {
                coursesData.value[index] = {
                    id: courseForm.id,
                    className: courseForm.className,
                    courseName: courseForm.courseName,
                    status: statusValue,
                    teacherList: teacherList.value.filter(t => courseForm.teacherIds.includes(t.id)).map(t => t.name),
                    studentList: coursesData.value[index]?.studentList || [], // 保留原有学生
                }
            }
        } catch (error) {
            ElMessage.error('更新失败')
            console.error('更新课程失败:', error)
            return
        }


        dialogVisible.value = false
        fetchCourseList() // 刷新列表
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}

// 初始化加载数据
onMounted(() => {
    fetchCourseList()
    fetchTeacherList()
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
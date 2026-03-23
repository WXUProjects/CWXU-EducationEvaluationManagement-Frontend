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
                            <el-input v-model="filterForm.studentId" placeholder="请输入学号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="教学班级">
                            <el-select v-model="filterForm.classIds" placeholder="请选择教学班级" multiple clearable>
                                <el-option v-for="classItem in classes" :key="classItem.id" :label="classItem.name"
                                    :value="classItem.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="行政班级">
                            <el-select v-model="filterForm.administrativeClassId" placeholder="请选择行政班级" clearable>
                                <el-option v-for="classItem in administrativeClasses" :key="classItem.id"
                                    :label="classItem.name" :value="classItem.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别">
                            <el-select v-model="filterForm.gender" placeholder="请选择性别" clearable>
                                <el-option label="男" value="male" />
                                <el-option label="女" value="female" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="状态">
                            <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
                                <el-option label="在读" value="studying" />
                                <el-option label="休学" value="suspended" />
                                <el-option label="毕业" value="graduated" />
                                <el-option label="退学" value="dropped" />
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
            <el-table :data="filteredStudents" border style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="studentId" label="学号" width="120" />
                <el-table-column prop="name" label="姓名" width="120" />
                <el-table-column prop="gender" label="性别" width="80" align="center">
                    <template #default="{ row }">
                        {{ row.gender === 'male' ? '男' : '女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="classNames" label="教学班级">
                    <template #default="{ row }">
                        <div class="class-names">
                            <el-tag v-for="(className, index) in row.classNames" :key="index" size="small" class="class-tag">
                                {{ className }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班级" />
                <el-table-column prop="major" label="专业" />
                <el-table-column prop="phone" label="联系电话" width="150" />
                <el-table-column prop="email" label="邮箱" width="200" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="getStatusTagType(row.status)" size="small">
                            {{ getStatusLabel(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>
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
                <el-button type="primary" size="small" @click="handleBatchAssignClass">批量分配班级</el-button>
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
                <el-form-item label="学号" prop="studentId">
                    <el-input v-model="studentForm.studentId" placeholder="请输入学号" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="studentForm.name" placeholder="请输入学生姓名" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="studentForm.gender">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="教学班级" prop="classIds">
                    <el-select v-model="studentForm.classIds" placeholder="请选择教学班级" multiple>
                        <el-option v-for="classItem in classes" :key="classItem.id" :label="classItem.name"
                            :value="classItem.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="行政班级" prop="administrativeClassId">
                    <el-select v-model="studentForm.administrativeClassId" placeholder="请选择行政班级">
                        <el-option v-for="classItem in administrativeClasses" :key="classItem.id"
                            :label="classItem.name" :value="classItem.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="major">
                    <el-input v-model="studentForm.major" placeholder="请输入专业" />
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="studentForm.phone" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="studentForm.email" placeholder="请输入邮箱地址" />
                </el-form-item>
                <el-form-item label="入学年份" prop="enrollmentYear">
                    <el-date-picker v-model="studentForm.enrollmentYear" type="year" placeholder="选择入学年份"
                        value-format="YYYY" style="width: 100%" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="studentForm.status">
                        <el-radio label="studying">在读</el-radio>
                        <el-radio label="suspended">休学</el-radio>
                        <el-radio label="graduated">毕业</el-radio>
                        <el-radio label="dropped">退学</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="studentForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
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
    studentId: '',
    classIds: [] as number[],
    administrativeClassId: '' as string | number,
    gender: '',
    status: ''
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
const classes = ref([
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
const administrativeClasses = ref([
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
    { id: 1, studentId: '20210001', name: '张三', gender: 'male', classIds: [1, 2], classNames: ['高等数学-2021级-A班', '大学英语-2022级-B班'], className: '高等数学-2021级-A班', administrativeClassId: 1, administrativeClassName: '计算机科学与技术2021级1班', major: '计算机科学与技术', phone: '13800138001', email: 'zhangsan@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '优秀学生' },
    { id: 2, studentId: '20210002', name: '李四', gender: 'female', classIds: [1, 3], classNames: ['高等数学-2021级-A班', '数据结构-2020级-C班'], className: '高等数学-2021级-A班', administrativeClassId: 1, administrativeClassName: '计算机科学与技术2021级1班', major: '计算机科学与技术', phone: '13800138002', email: 'lisi@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '班干部' },
    { id: 3, studentId: '20210003', name: '王五', gender: 'male', classIds: [2, 4], classNames: ['大学英语-2022级-B班', '计算机网络-2021级-A班'], className: '大学英语-2022级-B班', administrativeClassId: 2, administrativeClassName: '软件工程2022级2班', major: '软件工程', phone: '13800138003', email: 'wangwu@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '' },
    { id: 4, studentId: '20210004', name: '赵六', gender: 'male', classIds: [2, 5], classNames: ['大学英语-2022级-B班', '软件工程-2022级-B班'], className: '大学英语-2022级-B班', administrativeClassId: 2, administrativeClassName: '软件工程2022级2班', major: '软件工程', phone: '13800138004', email: 'zhaoliu@student.edu.cn', enrollmentYear: '2021', status: 'suspended', remark: '因病休学' },
    { id: 5, studentId: '20200005', name: '钱七', gender: 'female', classIds: [3, 6], classNames: ['数据结构-2020级-C班', '数据库系统-2020级-A班'], className: '数据结构-2020级-C班', administrativeClassId: 3, administrativeClassName: '网络工程2020级1班', major: '网络工程', phone: '13800138005', email: 'qianqi@student.edu.cn', enrollmentYear: '2020', status: 'graduated', remark: '已毕业' },
    { id: 6, studentId: '20210006', name: '孙八', gender: 'male', classIds: [4, 7], classNames: ['计算机网络-2021级-A班', '操作系统-2021级-B班'], className: '计算机网络-2021级-A班', administrativeClassId: 4, administrativeClassName: '人工智能2021级1班', major: '信息安全', phone: '13800138006', email: 'sunba@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '' },
    { id: 7, studentId: '20210007', name: '周九', gender: 'female', classIds: [5, 8], classNames: ['软件工程-2022级-B班', '人工智能导论-2022级-A班'], className: '软件工程-2022级-B班', administrativeClassId: 5, administrativeClassName: '数据科学2022级1班', major: '人工智能', phone: '13800138007', email: 'zhoujiu@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '竞赛获奖' },
    { id: 8, studentId: '20200008', name: '吴十', gender: 'male', classIds: [3, 6, 7], classNames: ['数据结构-2020级-C班', '数据库系统-2020级-A班', '操作系统-2021级-B班'], className: '数据结构-2020级-C班', administrativeClassId: 3, administrativeClassName: '网络工程2020级1班', major: '网络工程', phone: '13800138008', email: 'wushi@student.edu.cn', enrollmentYear: '2020', status: 'dropped', remark: '已退学' },
    { id: 1, studentId: '20210001', name: '张三', gender: 'male', classIds: [1, 2], classNames: ['高等数学-2021级-A班', '大学英语-2022级-B班'], className: '高等数学-2021级-A班', administrativeClassId: 1, administrativeClassName: '计算机科学与技术2021级1班', major: '计算机科学与技术', phone: '13800138001', email: 'zhangsan@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '优秀学生' },
    { id: 2, studentId: '20210002', name: '李四', gender: 'female', classIds: [1, 3], classNames: ['高等数学-2021级-A班', '数据结构-2020级-C班'], className: '高等数学-2021级-A班', administrativeClassId: 1, administrativeClassName: '计算机科学与技术2021级1班', major: '计算机科学与技术', phone: '13800138002', email: 'lisi@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '班干部' },
    { id: 3, studentId: '20210003', name: '王五', gender: 'male', classIds: [2, 4], classNames: ['大学英语-2022级-B班', '计算机网络-2021级-A班'], className: '大学英语-2022级-B班', administrativeClassId: 2, administrativeClassName: '软件工程2022级2班', major: '软件工程', phone: '13800138003', email: 'wangwu@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '' },
    { id: 4, studentId: '20210004', name: '赵六', gender: 'male', classIds: [2, 5], classNames: ['大学英语-2022级-B班', '软件工程-2022级-B班'], className: '大学英语-2022级-B班', administrativeClassId: 2, administrativeClassName: '软件工程2022级2班', major: '软件工程', phone: '13800138004', email: 'zhaoliu@student.edu.cn', enrollmentYear: '2021', status: 'suspended', remark: '因病休学' },
    { id: 5, studentId: '20200005', name: '钱七', gender: 'female', classIds: [3, 6], classNames: ['数据结构-2020级-C班', '数据库系统-2020级-A班'], className: '数据结构-2020级-C班', administrativeClassId: 3, administrativeClassName: '网络工程2020级1班', major: '网络工程', phone: '13800138005', email: 'qianqi@student.edu.cn', enrollmentYear: '2020', status: 'graduated', remark: '已毕业' },
    { id: 6, studentId: '20210006', name: '孙八', gender: 'male', classIds: [4, 7], classNames: ['计算机网络-2021级-A班', '操作系统-2021级-B班'], className: '计算机网络-2021级-A班', administrativeClassId: 4, administrativeClassName: '人工智能2021级1班', major: '信息安全', phone: '13800138006', email: 'sunba@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '' },
    { id: 7, studentId: '20210007', name: '周九', gender: 'female', classIds: [5, 8], classNames: ['软件工程-2022级-B班', '人工智能导论-2022级-A班'], className: '软件工程-2022级-B班', administrativeClassId: 5, administrativeClassName: '数据科学2022级1班', major: '人工智能', phone: '13800138007', email: 'zhoujiu@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '竞赛获奖' },
    { id: 8, studentId: '20200008', name: '吴十', gender: 'male', classIds: [3, 6, 7], classNames: ['数据结构-2020级-C班', '数据库系统-2020级-A班', '操作系统-2021级-B班'], className: '数据结构-2020级-C班', administrativeClassId: 3, administrativeClassName: '网络工程2020级1班', major: '网络工程', phone: '13800138008', email: 'wushi@student.edu.cn', enrollmentYear: '2020', status: 'dropped', remark: '已退学' }
])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const studentFormRef = ref<FormInstance>()
const studentForm = reactive({
    id: 0,
    studentId: '',
    name: '',
    gender: 'male',
    classIds: [] as number[],
    classNames: [] as string[],
    administrativeClassId: '',
    major: '',
    phone: '',
    email: '',
    enrollmentYear: '',
    status: 'studying',
    remark: ''
})

// 表单验证规则
const studentRules = {
    studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
    classIds: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if (!value || value.length === 0) {
                    callback(new Error('请选择至少一个教学班级'))
                } else {
                    callback()
                }
            },
            trigger: 'change'
        }
    ],
    administrativeClassId: [{ required: true, message: '请选择行政班级', trigger: 'change' }],
    major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    enrollmentYear: [{ required: true, message: '请选择入学年份', trigger: 'change' }]
}

// 状态标签类型映射
const getStatusTagType = (status: string) => {
    const map: Record<string, string> = {
        'studying': 'success',
        'suspended': 'warning',
        'graduated': 'info',
        'dropped': 'danger'
    }
    return map[status] || 'info'
}

// 状态标签文本映射
const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
        'studying': '在读',
        'suspended': '休学',
        'graduated': '毕业',
        'dropped': '退学'
    }
    return map[status] || status
}

// 根据班级ID获取班级名称
const getClassNameById = (classId: number) => {
    const classItem = classes.value.find(item => item.id === classId)
    return classItem ? classItem.name : ''
}

// 根据行政班级ID获取行政班级名称
const getAdministrativeClassNameById = (classId: number) => {
    const classItem = administrativeClasses.value.find(item => item.id === classId)
    return classItem ? classItem.name : ''
}

// 过滤后的学生数据
const filteredStudents = computed(() => {
    let filtered = studentsData.value

    // 按姓名过滤
    if (filterForm.name) {
        filtered = filtered.filter(item => item.name.includes(filterForm.name))
    }

    // 按学号过滤
    if (filterForm.studentId) {
        filtered = filtered.filter(item => item.studentId.includes(filterForm.studentId))
    }

    // 按教学班级过滤
    if (filterForm.classIds && filterForm.classIds.length > 0) {
        filtered = filtered.filter(item => item.classIds.some(classId => filterForm.classIds.includes(classId)))
    }

    // 按行政班级过滤
    if (filterForm.administrativeClassId) {
        filtered = filtered.filter(item => item.administrativeClassId.toString() === filterForm.administrativeClassId.toString())
    }

    // 按性别过滤
    if (filterForm.gender) {
        filtered = filtered.filter(item => item.gender === filterForm.gender)
    }

    // 按状态过滤
    if (filterForm.status) {
        filtered = filtered.filter(item => item.status === filterForm.status)
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
    filterForm.studentId = ''
    filterForm.classIds = []
    filterForm.administrativeClassId = ''
    filterForm.gender = ''
    filterForm.status = ''
    pagination.currentPage = 1
    handleSearch()
}

// 添加学生
const handleAddStudent = () => {
    dialogTitle.value = '添加学生'
    Object.assign(studentForm, {
        id: 0,
        studentId: '',
        name: '',
        gender: 'male',
        classIds: [] as number[],
        classNames: [] as string[],
        administrativeClassId: '',
        major: '',
        phone: '',
        email: '',
        enrollmentYear: '',
        status: 'studying',
        remark: ''
    })
    dialogVisible.value = true
}

// 编辑学生
const handleEdit = (row: any) => {
    dialogTitle.value = '编辑学生'
    Object.assign(studentForm, {
        ...row,
        classIds: row.classIds || [],
        classNames: row.classNames || [],
        administrativeClassId: row.administrativeClassId || ''
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
const handleBatchAssignClass = () => {
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

        // 获取教学班级名称数组和行政班级名称
        const classNames = studentForm.classIds.map(id => getClassNameById(id))
        const administrativeClassName = getAdministrativeClassNameById(Number(studentForm.administrativeClassId))
        // 保留className为第一个班级名称（兼容性）
        const className = (classNames.length > 0 ? classNames[0] : '') as string;

        if (studentForm.id === 0) {
            // 添加新学生
            const newId = Math.max(...studentsData.value.map(item => item.id)) + 1
            studentsData.value.push({
                ...studentForm,
                id: newId,
                classIds: studentForm.classIds,
                classNames: classNames,
                administrativeClassId: Number(studentForm.administrativeClassId),
                administrativeClassName: administrativeClassName,
                className: className
            })
            ElMessage.success('添加成功')
        } else {
            // 更新学生
            const index = studentsData.value.findIndex(item => item.id === studentForm.id)
            if (index !== -1) {
                studentsData.value[index] = {
                    ...studentForm,
                    classIds: studentForm.classIds,
                    classNames: classNames,
                    administrativeClassId: Number(studentForm.administrativeClassId),
                    administrativeClassName: administrativeClassName,
                    className: className
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

.class-names {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.class-tag {
    margin-right: 4px;
}
</style>
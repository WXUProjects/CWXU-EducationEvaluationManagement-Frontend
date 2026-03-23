<template>
    <div class="edit-class-container">
        <div class="header">
            <div class="title">管理教师班级</div>
            <div class="name">{{ teacherData.name }}</div>
        </div>
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="title">教学班级</div>
                    <div class="actions">
                        <el-button @click="handleBack">返回</el-button>
                        <el-button>导入班级</el-button>
                        <el-button>添加单个班级</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="teachingClassData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="name" label="班级名称" />
                <el-table-column prop="enrollmentYear" label="入学年份" width="120" align="center">
                    <template #default="{ row }">
                        {{ row.enrollmentYear }}级
                    </template>
                </el-table-column>
                <el-table-column prop="courseName" label="课程名称" />
                <el-table-column prop="teacherName" label="授课教师" width="120" />
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
        </el-card>
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="title">教学班级</div>
                    <div class="actions">
                        <el-button @click="handleBack">返回</el-button>
                        <el-button>导入班级</el-button>
                        <el-button>添加单个班级</el-button>
                    </div>
                </div>
            </template>
            <el-table :data="administrativeClassData" border style="width: 100%" v-loading="loading">
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
        </el-card>
    </div>
</template>

<script setup lang="ts">
//获取id参数
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let id = route.params.id

const teacherData = ref(
    { id: 1, teacherId: 'T2021001', name: '张教授', gender: 'male', title: 'professor', department: '计算机科学与技术学院', phone: '13800138001', email: 'zhang@university.edu.cn', status: 'active', remark: '博士生导师，研究方向：人工智能' }
)

const teachingClassData = ref([
    { id: 1, name: '高等数学-2021级-A班', enrollmentYear: '2021', courseCode: 'MATH101', courseName: '高等数学', studentCount: 45, teacherName: '张教授', status: 'active', description: '2021级高等数学A班' },
    { id: 2, name: '大学英语-2022级-B班', enrollmentYear: '2022', courseCode: 'ENG201', courseName: '大学英语', studentCount: 42, teacherName: '李教授', status: 'active', description: '2022级大学英语B班' },
    { id: 3, name: '数据结构-2020级-C班', enrollmentYear: '2020', courseCode: 'CS301', courseName: '数据结构', studentCount: 38, teacherName: '王教授', status: 'graduated', description: '2020级数据结构C班，已结课' },
    { id: 4, name: '计算机网络-2021级-A班', enrollmentYear: '2021', courseCode: 'CS402', courseName: '计算机网络', studentCount: 40, teacherName: '赵教授', status: 'active', description: '2021级计算机网络A班' },
    { id: 5, name: '软件工程-2022级-B班', enrollmentYear: '2022', courseCode: 'CS501', courseName: '软件工程', studentCount: 35, teacherName: '孙教授', status: 'active', description: '2022级软件工程B班' },
    { id: 6, name: '数据库系统-2020级-A班', enrollmentYear: '2020', courseCode: 'CS302', courseName: '数据库系统', studentCount: 36, teacherName: '周教授', status: 'graduated', description: '2020级数据库系统A班，已结课' },
    { id: 7, name: '操作系统-2021级-B班', enrollmentYear: '2021', courseCode: 'CS401', courseName: '操作系统', studentCount: 41, teacherName: '吴教授', status: 'active', description: '2021级操作系统B班' },
    { id: 8, name: '人工智能导论-2022级-A班', enrollmentYear: '2022', courseCode: 'CS601', courseName: '人工智能导论', studentCount: 39, teacherName: '郑教授', status: 'active', description: '2022级人工智能导论A班' }
])

const administrativeClassData = ref([
    { id: 1, name: '计算机科学与技术2021级1班', enrollmentYear: '2021', major: '计算机科学与技术', studentCount: 45, counselor: '张老师', headteacher: '张老师', status: 'active', description: '2021级计算机科学与技术1班' },
    { id: 2, name: '软件工程2022级2班', enrollmentYear: '2022', major: '软件工程', studentCount: 42, counselor: '李老师', headteacher: '李老师', status: 'active', description: '2022级软件工程2班' },
    { id: 3, name: '网络工程2020级1班', enrollmentYear: '2020', major: '网络工程', studentCount: 38, counselor: '王老师', headteacher: '王老师', status: 'graduated', description: '2020级网络工程1班，已毕业' },
    { id: 4, name: '人工智能2021级1班', enrollmentYear: '2021', major: '人工智能', studentCount: 40, counselor: '赵老师', headteacher: '赵老师', status: 'active', description: '2021级人工智能1班' },
    { id: 5, name: '数据科学2022级1班', enrollmentYear: '2022', major: '数据科学', studentCount: 35, counselor: '孙老师', headteacher: '孙老师', status: 'active', description: '2022级数据科学1班' },
    { id: 6, name: '信息安全2020级1班', enrollmentYear: '2020', major: '信息安全', studentCount: 36, counselor: '周老师', headteacher: '周老师', status: 'graduated', description: '2020级信息安全1班，已毕业' },
    { id: 7, name: '物联网工程2021级1班', enrollmentYear: '2021', major: '物联网工程', studentCount: 41, counselor: '吴老师', headteacher: '吴老师', status: 'active', description: '2021级物联网工程1班' },
    { id: 8, name: '数字媒体技术2022级1班', enrollmentYear: '2022', major: '数字媒体技术', studentCount: 39, counselor: '郑老师', headteacher: '郑老师', status: 'active', description: '2022级数字媒体技术1班' }
])

const handleBack = () => {
    router.back()
}

watch(route, () => {
    id = route.params.id
})
</script>

<style scoped>
.edit-class-container {
    width: calc(100% - 40px);
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f5f7fa;

    >.header {
        display: flex;
        flex-direction: column;

        >.title {
            font-size: 20px;
            font-weight: bold;
        }
    }

    >.list {
        flex: 1;
        overflow-y: auto;
    }
}

.card-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    >.title {
        font-size: 16px;
        font-weight: bold;
    }

    >.actions {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
}
</style>
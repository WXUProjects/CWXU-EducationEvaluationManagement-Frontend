<template>
    <div class="edit-class-students-container">
        <div class="header">
            <div class="title">管理班级学生</div>
            <div class="name">{{ classData.name }}</div>
        </div>
        <div class="actions">
            <el-button @click="handleBack">返回</el-button>
            <el-button>导入学生</el-button>
            <el-button>添加单个学生</el-button>
            <el-button>从班级添加学生</el-button>
        </div>
        <el-card>
            <el-table :data="studentsData" border style="width: 100%">
                <el-table-column prop="studentId" label="学号" width="120" />
                <el-table-column prop="name" label="姓名" width="120" />
                <el-table-column prop="gender" label="性别" width="80" align="center">
                    <template #default="{ row }">
                        {{ row.gender === 'male' ? '男' : '女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="administrativeClassName" label="行政班级" />
                <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small">详情</el-button>
                        <el-button link type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div class="pagination">
            <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
//获取id参数
import { watch, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let id = route.params.id

const classData = ref(
    { id: 1, name: '高等数学-2021级-A班', enrollmentYear: '2021', courseCode: 'MATH101', courseName: '高等数学', studentCount: 45, teacherName: '张教授', status: 'active', description: '2021级高等数学A班' }
)

const studentsData = ref([
    { id: 1, studentId: '20210001', name: '张三', gender: 'male', classIds: [1, 2], classNames: ['高等数学-2021级-A班', '大学英语-2022级-B班'], className: '高等数学-2021级-A班', administrativeClassId: 1, administrativeClassName: '计算机科学与技术2021级1班', major: '计算机科学与技术', phone: '13800138001', email: 'zhangsan@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '优秀学生' },
    { id: 2, studentId: '20210002', name: '李四', gender: 'female', classIds: [1, 3], classNames: ['高等数学-2021级-A班', '数据结构-2020级-C班'], className: '高等数学-2021级-A班', administrativeClassId: 1, administrativeClassName: '计算机科学与技术2021级1班', major: '计算机科学与技术', phone: '13800138002', email: 'lisi@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '班干部' },
    { id: 3, studentId: '20210003', name: '王五', gender: 'male', classIds: [2, 4], classNames: ['大学英语-2022级-B班', '计算机网络-2021级-A班'], className: '大学英语-2022级-B班', administrativeClassId: 2, administrativeClassName: '软件工程2022级2班', major: '软件工程', phone: '13800138003', email: 'wangwu@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '' },
    { id: 4, studentId: '20210004', name: '赵六', gender: 'male', classIds: [2, 5], classNames: ['大学英语-2022级-B班', '软件工程-2022级-B班'], className: '大学英语-2022级-B班', administrativeClassId: 2, administrativeClassName: '软件工程2022级2班', major: '软件工程', phone: '13800138004', email: 'zhaoliu@student.edu.cn', enrollmentYear: '2021', status: 'suspended', remark: '因病休学' },
    { id: 5, studentId: '20200005', name: '钱七', gender: 'female', classIds: [3, 6], classNames: ['数据结构-2020级-C班', '数据库系统-2020级-A班'], className: '数据结构-2020级-C班', administrativeClassId: 3, administrativeClassName: '网络工程2020级1班', major: '网络工程', phone: '13800138005', email: 'qianqi@student.edu.cn', enrollmentYear: '2020', status: 'graduated', remark: '已毕业' },
    { id: 6, studentId: '20210006', name: '孙八', gender: 'male', classIds: [4, 7], classNames: ['计算机网络-2021级-A班', '操作系统-2021级-B班'], className: '计算机网络-2021级-A班', administrativeClassId: 4, administrativeClassName: '人工智能2021级1班', major: '信息安全', phone: '13800138006', email: 'sunba@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '' },
    { id: 7, studentId: '20210007', name: '周九', gender: 'female', classIds: [5, 8], classNames: ['软件工程-2022级-B班', '人工智能导论-2022级-A班'], className: '软件工程-2022级-B班', administrativeClassId: 5, administrativeClassName: '数据科学2022级1班', major: '人工智能', phone: '13800138007', email: 'zhoujiu@student.edu.cn', enrollmentYear: '2021', status: 'studying', remark: '竞赛获奖' },
    { id: 8, studentId: '20200008', name: '吴十', gender: 'male', classIds: [3, 6, 7], classNames: ['数据结构-2020级-C班', '数据库系统-2020级-A班', '操作系统-2021级-B班'], className: '数据结构-2020级-C班', administrativeClassId: 3, administrativeClassName: '网络工程2020级1班', major: '网络工程', phone: '13800138008', email: 'wushi@student.edu.cn', enrollmentYear: '2020', status: 'dropped', remark: '已退学' }
])

// 分页配置
const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
})

// 分页大小改变
const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
}

// 当前页改变
const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
}

const handleBack = () => {
    router.back()
}

watch(route, () => {
    id = route.params.id
})
</script>

<style scoped>
.edit-class-students-container {
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

    >.actions {
        display: flex;
    }

    >.list {
        flex: 1;
        overflow-y: auto;
    }

    .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
}
</style>
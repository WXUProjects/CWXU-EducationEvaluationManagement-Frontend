<template>
    <div class="edit-course-container">
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
            <el-table :data="filteredTeachingCourseData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="ID" width="80" align="center" />
                <el-table-column prop="name" label="班级名称" />
                <el-table-column prop="teachers" label="授课教师" width="200">
                    <template #default="{ row }">
                        <div class="tag-container">
                            <el-tag v-for="(teacher, index) in row.teachers" :key="index" size="small" class="tag">
                                {{ teacher }}
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
                        <el-button link type="primary" size="small">编辑</el-button>
                        <el-button link type="primary" size="small" @click="viewCourseStudents(row)">管理班级学生</el-button>
                        <el-button link type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="navigation">
                <el-pagination v-model:current-page="teachingPagination.currentPage"
                    v-model:page-size="teachingPagination.pageSize" :page-sizes="[5, 10]"
                    :total="teachingPagination.total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleTeachingSizeChange" @current-change="handleTeachingCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
//获取id参数
import type { Course, Teacher } from '@/utils/type';
import { computed, reactive } from 'vue';
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let id = route.params.id

const teacherData = ref<Teacher>(
    { id: 1, workNo: 'T2021001', name: '张教授', sex: 'male', email: 'zhang@university.edu.cn', }
)

const teachingCourseData = ref<Course[]>([
    { id: 1, name: '高等数学-2021级-A班', teachers: ['张教授'], status: 1, students: [] },
    { id: 2, name: '大学英语-2022级-B班', teachers: ['李教授'], status: 1, students: [] },
    { id: 3, name: '数据结构-2020级-C班', teachers: ['王教授'], status: 0, students: [] },
    { id: 4, name: '计算机网络-2021级-A班', teachers: ['赵教授'], status: 1, students: [] },
    { id: 5, name: '软件工程-2022级-B班', teachers: ['孙教授'], status: 1, students: [] },
    { id: 6, name: '数据库系统-2020级-A班', teachers: ['周教授'], status: 0, students: [] },
    { id: 7, name: '操作系统-2021级-B班', teachers: ['吴教授'], status: 1, students: [] },
    { id: 8, name: '人工智能导论-2022级-A班', teachers: ['郑教授'], status: 1, students: [] }
])

const filteredTeachingCourseData = computed(() => {
    let filtered = teachingCourseData.value

    teachingPagination.total = filtered.length

    const start = (teachingPagination.currentPage - 1) * teachingPagination.pageSize
    const end = start + teachingPagination.pageSize
    return filtered.slice(start, end)
})

// 分页配置
const teachingPagination = reactive({
    currentPage: 1,
    pageSize: 5,
    total: 0
})

// 分页大小改变
const handleTeachingSizeChange = (val: number) => {
    teachingPagination.pageSize = val
    teachingPagination.currentPage = 1
}

// 当前页改变
const handleTeachingCurrentChange = (val: number) => {
    teachingPagination.currentPage = val
}

const viewCourseStudents = (row: Course) => {
    router.push(`/teaching-courses/students/${row.id}`) 
}

const handleBack = () => {
    router.back()
}

watch(route, () => {
    id = route.params.id
})
</script>

<style scoped>
.edit-course-container {
    width: calc(100% - 40px);
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;

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

.navigation {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 0;
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
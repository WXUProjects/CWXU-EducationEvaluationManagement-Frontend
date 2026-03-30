<template>
    <div class="edit-course-students-container">
        <div class="header">
            <div class="title">管理班级学生</div>
            <div class="name">{{ courseData.className }}</div>
        </div>
        <div class="actions">
            <el-button @click="handleBack">返回</el-button>
            <!-- <el-button>导入学生</el-button> -->
            <!-- <el-button>添加单个学生</el-button> -->
        </div>
        <el-card>
            <el-table :data="filteredStudents" border style="width: 100%">
                <el-table-column prop="studentNo" label="学号" width="120" />
                <el-table-column prop="sex" label="性别" width="80" align="center" />
                <el-table-column prop="name" label="姓名" />
                <!-- <el-table-column label="操作" width="200" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small">详情</el-button>
                        <el-button link type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column> -->
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
import { api } from '@/api';
import type { Course } from '@/types/type';
import { watch, ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let id = route.params.id || '0'

const courseData = ref<Course>({
    id: 0,
    courseName: '',
    className: '',
    status: 0,
    teacherList: [],
    studentList: []
})

const fetchCourse = async (id: string) => {
    // 从当前页面返回，监听到参数变化，id变为0，又执行了一次fetchCourse，导致错误请求
    if(id === '0'){
        return
    }
    const result = await api.course.getCourseDetail(id, { showLoading: true });
    courseData.value = result.data;
    console.log("班级详情:", result.data);

}

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

const filteredStudents = computed(() => {
    let filtered = courseData.value.studentList

    // 更新分页总数
    pagination.total = filtered.length

    // 分页处理
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filtered.slice(start, end)
})

const handleBack = () => {
    router.back()
}

const watchIns = watch(route, () => {
    id = route.params.id || '0';
    fetchCourse(id.toString())
})

onMounted(() => {
    pagination.total = courseData.value.studentList.length
    fetchCourse(id.toString())
})
</script>

<style scoped>
.edit-course-students-container {
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
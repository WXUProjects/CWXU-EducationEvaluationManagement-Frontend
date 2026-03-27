<template>
    <div class="edit-course-students-container">
        <div class="header">
            <div class="title">管理班级学生</div>
            <div class="name">{{ courseData.name }}</div>
        </div>
        <div class="actions">
            <el-button @click="handleBack">返回</el-button>
            <el-button>导入学生</el-button>
            <el-button>添加单个学生</el-button>
        </div>
        <el-card>
            <el-table :data="filteredStudents" border style="width: 100%">
                <el-table-column prop="studentNo" label="学号" width="120" />
                <el-table-column prop="idCardNo" label="身份证号" width="200" />
                <el-table-column prop="sex" label="性别" width="80" align="center">
                    <template #default="{ row }">
                        {{ row.sex === 'male' ? '男' : '女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" />
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
import type { Course } from '@/types/type';
import { watch, ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
let id = route.params.id

const courseData = ref<Course>({
    id: 1,
    name: '高等数学-2021级-A班',
    teachers: ['张三'],
    status: 1,
    students: [
        { id: 1, studentNo: '20210001', idCardNo: '130000000000000001', name: '张三', sex: 'male' },
        { id: 2, studentNo: '20210002', idCardNo: '130000000000000001', name: '李四', sex: 'female' },
        { id: 3, studentNo: '20210003', idCardNo: '130000000000000001', name: '王五', sex: 'male' },
        { id: 4, studentNo: '20210004', idCardNo: '130000000000000001', name: '赵六', sex: 'male' },
        { id: 5, studentNo: '20200005', idCardNo: '130000000000000001', name: '钱七', sex: 'female' },
        { id: 6, studentNo: '20210006', idCardNo: '130000000000000001', name: '孙八', sex: 'male' },
        { id: 7, studentNo: '20210007', idCardNo: '130000000000000001', name: '周九', sex: 'female' },
        { id: 8, studentNo: '20200008', idCardNo: '130000000000000001', name: '吴十', sex: 'male' },
        { id: 1, studentNo: '20210001', idCardNo: '130000000000000001', name: '张三', sex: 'male' },
        { id: 2, studentNo: '20210002', idCardNo: '130000000000000001', name: '李四', sex: 'female' },
        { id: 3, studentNo: '20210003', idCardNo: '130000000000000001', name: '王五', sex: 'male' },
        { id: 4, studentNo: '20210004', idCardNo: '130000000000000001', name: '赵六', sex: 'male' },
        { id: 5, studentNo: '20200005', idCardNo: '130000000000000001', name: '钱七', sex: 'female' },
        { id: 6, studentNo: '20210006', idCardNo: '130000000000000001', name: '孙八', sex: 'male' },
        { id: 7, studentNo: '20210007', idCardNo: '130000000000000001', name: '周九', sex: 'female' },
        { id: 8, studentNo: '20200008', idCardNo: '130000000000000001', name: '吴十', sex: 'male' },
    ]
}
)

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
    let filtered = courseData.value.students

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

watch(route, () => {
    id = route.params.id
})

onMounted(() => {
    pagination.total = courseData.value.students.length
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
<template>
    <div class="EvaContainer">
        <!-- 左侧侧边栏 -->
        <aside class="sidebar">
            <!-- 搜索区域 -->
            <div class="search-section">
                <div class="search-box">
                    <input type="search" placeholder="搜索评教任务..." v-model="searchKeyword">
                    <button class="search-btn">
                        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
                    </button>
                </div>
            </div>

            <!-- 筛选区域 -->
            <div class="filter-section">
                <h3 class="section-title">筛选选项</h3>
                <div class="filter-items">
                    <label class="filter-item" v-for="status in filterOptions" :key="status.value">
                        <input type="checkbox" :value="status.value" v-model="selectedFilters">
                        <span>{{ status.label }}</span>
                        <span class="count">{{ status.count }}</span>
                    </label>
                </div>
            </div>

            <!-- 任务列表 -->
            <div class="task-list">
                <h3 class="section-title">评教任务</h3>
                <div class="task-items" v-if="filteredData.length != 0">
                    <div class="task-item" v-for="(item, index) in filteredData" :key="index"
                        :class="{ active: currentTask === index }" @click="selectTask(index)">
                        <div class="task-header">
                            <span class="task-title">{{ item.title }}</span>
                            <span class="task-status" :class="item.statue">{{ item.statue }}</span>
                        </div>
                        <div class="task-info">
                            <div class="info-row">
                                <span class="label">总人数</span>
                                <span class="value">{{ item.total }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">已完成</span>
                                <span class="value">{{ item.complete }}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">未完成</span>
                                <span class="value">{{ item.uncomplete }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no-task" v-else>暂无数据</div>
            </div>

            <!-- 新建按钮 -->
            <div class="new-task-btn" @click="createNewTask">
                <span class="btn-icon">+</span>
                <span class="btn-text">新建评教任务</span>
            </div>
        </aside>

        <!-- 右侧内容区 -->
        <main class="evaContent">
            <router-view></router-view>
        </main>
    </div>
</template>

<style scoped>
.EvaContainer {
    display: flex;
    height: calc(100vh - 40px);
    background-color: #f5f7fa;
}

/* 侧边栏样式 */
.sidebar {
    width: 320px;
    min-width: 320px;
    background: #fff;
    border: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 搜索区域 */
.search-section {
    padding: 15px 20px;
    border-bottom: 1px solid #e4e7ed;
}

.search-box {
    display: flex;
    gap: 8px;

    input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s;

        &:focus {
            border-color: #6f2b75;
        }
    }

    .search-btn {
        padding: 8px 12px;
        background: #6f2b75;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
            background: #5f2b75;
        }
    }
}

/* 筛选区域 */
.filter-section {
    padding: 15px 20px;
    border-bottom: 1px solid #e4e7ed;
}

.section-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
}

.filter-items {
    display: flex;
    flex-direction: column;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    cursor: pointer;
    font-size: 14px;
    color: #606266;

    input {
        cursor: pointer;
    }

    .count {
        margin-left: auto;
        font-size: 12px;
        color: #909399;
        background: #f5f7fa;
        padding: 2px 6px;
        border-radius: 10px;
    }
}

/* 任务列表 */
.task-list {
    flex: 1;
    padding: 15px 20px;
    overflow-y: auto;
}

.task-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-item {
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
        background: #f6ecff;
        border-color: #6f2b75;
    }

    &.active {
        background: #f6ecff;
        border-color: #6f2b75;
    }

    .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .task-title {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
        }

        .task-status {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 10px;

            &.已结束,
            &.未开始 {
                background: #f4f4f5;
                color: #909399;
            }

            &.进行中 {
                background: #d4ffd2;
                color: #67c23a;
            }
        }
    }

    .task-info {
        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #606266;
            margin-bottom: 4px;

            .label {
                color: #909399;
            }

            .value {
                font-weight: 500;
            }
        }
    }
}

.no-task {
    text-align: center;
    font-size: 14px;
    color: #909399;
}

/* 新建按钮 */
.new-task-btn {
    margin: 20px;
    padding: 12px;
    background: #6f2b75;
    color: #fff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: 500;

    &:hover {
        box-shadow: 0 4px 12px rgba(188, 64, 255, 0.4);
    }

    .btn-icon {
        font-size: 18px;
        font-weight: bold;
    }
}

/* 右侧内容区 */
.evaContent {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background: #f5f7fa;
}
</style>

<script setup lang="ts">
import router from '@/router';
import { ref, computed } from 'vue';

// 搜索关键词
const searchKeyword = ref('');

// 筛选选项
const filterOptions = ref([
    { value: '未开始', label: '未开始', count: 1 },
    { value: '进行中', label: '进行中', count: 1 },
    { value: '已结束', label: '已结束', count: 1 }
]);

// 选中的筛选条件
const selectedFilters = ref<string[]>([]);

// 当前选中的任务
const currentTask = ref<number | null>(null);

const data = ref([
    {
        id: 1,
        title: '评教任务1',
        statue: '进行中',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 2,
        title: '评教任务2',
        statue: '已结束',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 3,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 4,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 5,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 6,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 7,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 8,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 9,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 10,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 11,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    },
    {
        id: 12,
        title: '评教任务3',
        statue: '未开始',
        complete: 98,
        uncomplete: 2,
        total: 100
    }
])

// 筛选后的数据
const filteredData = computed(() => {
    return data.value.filter(item => {
        // 搜索过滤
        const matchSearch = item.title.includes(searchKeyword.value);
        // 筛选过滤
        const matchFilter = selectedFilters.value.length === 0 ||
            selectedFilters.value.includes(item.statue);
        return matchSearch && matchFilter;
    });
});

// 选择任务
const selectTask = (index: number) => {
    currentTask.value = index;
    router.push(`/evaluations/edit/${index}`);
};

// 新建任务
const createNewTask = () => {
    currentTask.value = null;
    router.push('/evaluations/add');
};
</script>
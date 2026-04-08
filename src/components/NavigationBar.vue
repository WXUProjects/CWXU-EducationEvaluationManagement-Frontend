<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
    try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        userStore.logout()
        router.push('/')
    } catch {
        // 用户取消
    }
}
</script>

<template>
    <div class="NavBarContainer">
        <div class="items">
            <router-link to="/home" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-home" class="icon" />
                <div class="title">首页</div>
            </router-link>
            <router-link to="/questions" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-clipboard-question" class="icon" />
                <div class="title">问题管理</div>
            </router-link>
            <router-link to="/students" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-person" class="icon" />
                <div class="title">学生管理</div>
            </router-link>
            <router-link to="/teachers" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-chalkboard-teacher" class="icon" />
                <div class="title">教师管理</div>
            </router-link>
            <router-link to="/teaching-courses" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-people-group" class="icon" />
                <div class="title">教学班级</div>
            </router-link>
            <router-link to="/evaluations" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-list-check" class="icon" />
                <div class="title">评教任务</div>
            </router-link>
            <router-link to="/settings" class="item" active-class="active-item">
                <font-awesome-icon icon="fa-solid fa-gear" class="icon" />
                <div class="title">设置</div>
            </router-link>
            <a class="item" @click="handleLogout">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="icon" />
                <div class="title">退出</div>
            </a>
        </div>
        <div class="icon">
            <img src="/svg/无锡学院-reverse-logo.svg"></img>
        </div>
    </div>
</template>

<style scoped>
.NavBarContainer {
    height: 90%;
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    padding: 5px;
    background-color: #6f2b75;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 24px;
    border: 10px solid #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 100;

    transition: box-shadow 0.1s ease-in-out;

    .items {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;

        .item {
            display: flex;
            width: 28px;
            height: 28px;
            padding: 10px;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-radius: 18px;
            gap: 4px;
            color: #fff;
            text-decoration: none;
            transform: scale(0.95);
            cursor: pointer;

            transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;

            &.active-item {
                background-color: #eee;
                color: #333;
                transform: scale(1);
            }

            &:first-child {
                margin-top: 10px;
            }

            &:hover {
                color: #333;
                background-color: #eee;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                transform: scale(1);
            }

            &:hover .title {
                opacity: 1;
                transform: translateX(0px);
            }

            .icon {
                font-size: 18px;
            }

            .title {
                position: absolute;
                width: 30px;
                bottom: -20px;
                padding: 2px 5px;
                width: 100px;
                color: #fff;
                text-align: center;
                font-size: 12px;
                opacity: 0;

                transition: opacity 0.1s ease-in-out;
            }
        }
    }

    .icon {
        width: 50px;

        img {
            user-select: none;
            width: 100%;
        }
    }
}
</style>
<template>
    <div class="settings-container">
        <!-- 个人信息 -->
        <el-card>
            <template #header>
                <div class="setting-header">
                    <span>个人信息</span>
                </div>
            </template>
            <div class="user-info">
                <div class="info-item">
                    <span class="label">用户名：</span>
                    <span class="value">{{ username || '未获取' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">用户角色：</span>
                    <span class="value">{{ roleLabel }}</span>
                </div>
                <div class="info-item">
                    <span class="label">用户ID：</span>
                    <span class="value">{{ userId || '未获取' }}</span>
                </div>
            </div>
        </el-card>

        <!-- 修改密码 -->
        <el-card>
            <template #header>
                <div class="setting-header">
                    <span>修改密码</span>
                </div>
            </template>
            <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :loading="changingPassword" @click="handleChangePassword">修改密码</el-button>
                    <el-button @click="resetPasswordForm">清空输入</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 账户操作 -->
        <el-card>
            <template #header>
                <div class="setting-header">
                    <span>账户操作</span>
                </div>
            </template>
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { api } from '@/api';

const router = useRouter();
const userStore = useUserStore();

// 用户信息
const username = computed(() => userStore.username);
const userId = computed(() => userStore.userId);
const role = computed(() => userStore.role);
const roleLabel = computed(() => {
    switch (role.value) {
        case 'admin': return '管理员';
        default: return role.value || '未知';
    }
});

// 密码表单
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const changingPassword = ref(false);

// 密码验证规则
const validateOldPassword = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('请输入旧密码'));
    } else {
        callback();
    }
};
const validateNewPassword = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('请输入新密码'));
    } else if (value === passwordForm.oldPassword) {
        callback(new Error('新密码不能与旧密码相同'));
    } else {
        callback();
    }
};
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
    if (!value) {
        callback(new Error('请确认新密码'));
    } else if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入的新密码不一致'));
    } else {
        callback();
    }
};
const passwordRules: FormRules = {
    oldPassword: [{ validator: validateOldPassword, trigger: 'blur' }],
    newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
};

// 修改密码
const handleChangePassword = async () => {
    if (!passwordFormRef.value) return;

    try {
        await passwordFormRef.value.validate();
    } catch (error) {
        return;
    }

    changingPassword.value = true;
    try {
        const username = userStore.username;
        if (!username) {
            ElMessage.error('无法获取用户名，请重新登录');
            return;
        }

        const response = await api.auth.adminChangePassword({
            username,
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword,
        });

        if (response.message === '密码修改成功') {
            ElMessage.success('密码修改成功');
            resetPasswordForm();
        } else {
            ElMessage.error(response.message || '修改密码失败');
        }
    } catch (error: any) {
        console.error('修改密码失败:', error);
        ElMessage.error(error.response?.data?.message || '修改密码失败，请检查网络连接');
    } finally {
        changingPassword.value = false;
    }
};

// 重置密码表单
const resetPasswordForm = () => {
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    if (passwordFormRef.value) {
        passwordFormRef.value.clearValidate();
    }
};

// 退出登录
const handleLogout = () => {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        userStore.logout();
        ElMessage.success('已退出登录');
        router.push('/');
    }).catch(() => {
        // 用户取消
    });
};
</script>

<style scoped>
.settings-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: calc(100% - 20px);
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px 20px 0;
}

.setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-item {
    display: flex;
    align-items: center;
}

.label {
    font-weight: 500;
    min-width: 80px;
    color: #606266;
}

.value {
    color: #303133;
}
</style>
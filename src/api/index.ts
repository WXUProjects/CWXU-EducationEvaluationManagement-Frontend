import { ApiClient } from './api-client';

// 导出各模块 API 实例
import { BaseInfoApi } from './baseInfo';
import { courseApi } from './course';
import { taskApi } from './task';
import { authApi } from './auth';

// 创建 API 实例
export const baseInfoApi = new BaseInfoApi();

// 统一 API 入口
export const api = {
  baseInfo: baseInfoApi,
  course: courseApi,
  task: taskApi,
  auth: authApi,
};

// 默认导出 ApiClient 类
export default ApiClient;
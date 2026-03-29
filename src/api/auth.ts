import { ApiClient } from './api-client';

/**
 * 管理员登录请求参数
 */
export interface AdminLoginRequest {
  username: string;
  password: string;
}

/**
 * 管理员登录响应数据
 */
export interface AdminLoginResponse {
  message: string;
}

/**
 * 认证模块API
 */
export class AuthApi {
  private api: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.api = apiClient || new ApiClient();
  }

  /**
   * 管理员登录
   * @param data 登录数据
   * @param config 请求配置
   */
  adminLogin(data: AdminLoginRequest, config?: any) {
    return this.api.post<AdminLoginResponse>(
      '/api/v1/auth/admin/login',
      data,
      config
    );
  }
}

// 导出默认实例
export const authApi = new AuthApi();
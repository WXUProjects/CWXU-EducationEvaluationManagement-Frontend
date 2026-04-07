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
  token: string;
}

/**
 * 管理员修改密码请求参数
*/
export interface AdminChangePasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

/**
 * 管理员修改密码响应数据
 */
export interface AdminChangePasswordResponse {
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

  /**
   * 管理员修改密码
   * @param data 修改密码数据
   * @param config 配置项
   */
  adminChangePassword(data: AdminChangePasswordRequest, config?: any) {
    return this.api.post<AdminChangePasswordResponse>(
      '/api/v1/auth/admin/change-password',
      data,
      config
    );
  }
}

// 导出默认实例
export const authApi = new AuthApi();
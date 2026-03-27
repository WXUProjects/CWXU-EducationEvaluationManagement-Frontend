import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import type { MessageOptions } from 'element-plus';

// 扩展AxiosRequestConfig，添加自定义配置
declare module 'axios' {
  interface AxiosRequestConfig {
    // 是否静默请求（不显示错误消息）
    silent?: boolean;
    // 是否显示成功消息
    showSuccess?: boolean;
    // 自定义成功消息
    successMessage?: string;
  }
}

/**
 * API客户端基类
 * 封装axios实例，提供统一的错误处理和消息提示
 */
export class ApiClient {
  protected instance: AxiosInstance;
  protected baseURL: string;

  constructor(baseURL?: string) {
    // 开发环境下，优先使用空字符串，让请求通过本地开发服务器代理
    // 生产环境下使用环境变量 VITE_API_URL
    if (baseURL !== undefined) {
      this.baseURL = baseURL;
    } else if (import.meta.env.DEV) {
      // 开发环境：使用空字符串，请求发送到当前域，由vite代理转发
      this.baseURL = '';
    } else {
      // 生产环境：使用环境变量配置的API地址
      this.baseURL = import.meta.env.VITE_API_URL || '';
    }

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 可以在这里添加token等认证信息
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config;
        const data = response.data;

        // 规范化响应数据：将msg字段复制到message（如果不存在）
        if (data && typeof data === 'object') {
          if (data.msg !== undefined && data.message === undefined) {
            data.message = data.msg;
          }
        }

        // 如果配置了显示成功消息，则显示
        if (config.showSuccess && data.message) {
          const msg = config.successMessage || data.message;
          this.showSuccess(msg);
        }

        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 处理错误
   */
  protected handleError(error: any) {
    // 如果请求配置了silent，则不显示错误消息
    if (error.config?.silent) {
      return;
    }

    let message = '请求失败，请稍后重试';

    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;

      // 获取错误消息，优先使用message，其次使用msg
      const errorMessage = data?.message || data?.msg;

      switch (status) {
        case 400:
          message = errorMessage || '请求参数错误';
          break;
        case 401:
          message = errorMessage || '登录已过期，请重新登录';
          // 可以在这里触发登出逻辑
          break;
        case 403:
          message = errorMessage || '没有权限执行此操作';
          break;
        case 404:
          message = errorMessage || '请求的资源不存在';
          break;
        case 500:
          message = errorMessage || '服务器内部错误';
          break;
        default:
          message = errorMessage || `服务器错误 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message = '网络连接失败，请检查网络设置';
    } else {
      // 请求配置出错
      message = error.message || '请求配置错误';
    }

    this.showError(message);
  }

  /**
   * 显示错误消息
   */
  protected showError(message: string, options?: MessageOptions) {
    ElMessage({
      message,
      type: 'error',
      duration: 5000,
      showClose: true,
      ...options,
    });
  }

  /**
   * 显示成功消息
   */
  protected showSuccess(message: string, options?: MessageOptions) {
    ElMessage({
      message,
      type: 'success',
      duration: 3000,
      showClose: true,
      ...options,
    });
  }

  /**
   * 通用请求方法
   */
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config).then(response => response.data);
  }

  /**
   * GET请求
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  /**
   * POST请求
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  /**
   * PUT请求
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  /**
   * DELETE请求
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  /**
   * 上传文件（FormData）
   */
  public upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const uploadConfig: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    };
    return this.request<T>(uploadConfig);
  }
}
import type { Question } from '@/types/type';
import { ApiClient } from './api-client';

/**
 * 更新问题请求参数
 */
export interface UpdateQuestionsRequest {
  questions: Array<{
    content: string;
    score: number;
    sort: number;
  }>;
}

/**
 * 更新问题响应数据
 */
export interface UpdateQuestionsResponse {
  message: string;
}

/**
 * 问题列表响应数据
 */
export interface QuestionListResponse {
  message: string;
  data: Question[];
}

/**
 * 问题管理模块API
 */
export class QuestionApi {
  private api: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.api = apiClient || new ApiClient();
  }

  /**
   * 获取问题列表
   * @param config 请求配置
   */
  getQuestionList(config?: any) {
    return this.api.get<QuestionListResponse>(
      '/api/v1/question/list',
      config
    );
  }

  /**
   * 更新问题
   * @param data 问题列表
   * @param config 请求配置
   */
  updateQuestions(data: UpdateQuestionsRequest, config?: any) {
    return this.api.post<UpdateQuestionsResponse>(
      '/api/v1/question/update',
      data,
      config
    );
  }
}

// 导出默认实例
export const questionApi = new QuestionApi();
import { ApiClient } from './api-client';
import type { Student, Teacher } from '../types/type';

/**
 * 导出任务请求参数
 */
export interface ExportTaskParams {
  taskId?: string;
}

/**
 * 导出任务响应数据
 */
export interface ExportTaskResponse {
  message: string;
  filePath: string;
}

/**
 * 创建评教任务请求参数
 */
export interface CreateTaskRequest {
  name: string;
  courseIds: number[];
}

/**
 * 创建评教任务响应数据
 */
export interface CreateTaskResponse {
  message: string;
  id: string;
}

/**
 * 课程评价统计信息
 */
export interface CourseEvaluationStats {
  id: string;
  name: string;
  evaluationScore: number;
  evaluationNum: number;
  totalNum: number;
}

/**
 * 评教任务详情查询参数
 */
export interface TaskDetailParams {
  id?: string;
}

/**
 * 评教任务详情响应数据
 */
export interface TaskDetailResponse {
  id: string;
  name: string;
  status: number;
  course: CourseEvaluationStats[];
}

/**
 * 评教任务列表查询参数
 */
export interface TaskListParams {
  status?: string;  // -1代表全部
  page?: string;
  pageSize?: string;
}

/**
 * 评教任务项
 */
export interface TaskItem {
  id: string;
  name: string;
  status: number;
  course: any[];
}

/**
 * 评教任务列表响应数据
 */
export interface TaskListResponse {
  tasks: TaskItem[];
  total: string;
}

/**
 * 修改评教状态请求参数
 */
export interface ChangeTaskStatusRequest {
  id: number;
  status: number;
}

/**
 * 修改评教状态响应数据
 */
export interface ChangeTaskStatusResponse {
  message: string;
}

/**
 * 学生端任务详情查询参数
 */
export interface StudentTaskDetailParams {
  taskId?: string;
  stuNo?: string;
}

/**
 * 教师评价状态
 */
export interface TeacherEvaluationStatus {
  id: string;
  name: string;
  hasEvaluation: boolean;
}

/**
 * 学生端课程详情
 */
export interface StudentCourseDetail {
  id: string;
  name: string;
  evaluationScore: number;
  evaluationNum: number;
  totalNum: number;
  teacher: TeacherEvaluationStatus[];
}

/**
 * 学生端任务详情响应数据
 */
export interface StudentTaskDetailResponse {
  message: string;
  course: StudentCourseDetail[];
}

/**
 * 提交评价请求参数
 */
export interface SubmitEvaluationRequest {
  taskId: number;
  courseId: number;
  teacherId: number;
  stuNo: string;
  detailScore: string;  // JSON字符串，如"[5,5,5,5,5,5,5,5,5,5]"
  score: number;
  comment: string;
}

/**
 * 提交评价响应数据
 */
export interface SubmitEvaluationResponse {
  message: string;
}

/**
 * 评教任务模块API
 */
export class TaskApi {
  private api: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.api = apiClient || new ApiClient();
  }

  /**
   * 导出评教结果
   * @param params 查询参数
   * @param config 请求配置
   */
  exportTask(params?: ExportTaskParams, config?: any) {
    return this.api.get<ExportTaskResponse>(
      '/api/v1/task/export',
      { params, ...config }
    );
  }

  /**
   * 创建评教任务
   * @param data 任务数据
   * @param config 请求配置
   */
  createTask(data: CreateTaskRequest, config?: any) {
    return this.api.post<CreateTaskResponse>(
      '/api/v1/task/create',
      data,
      config
    );
  }

  /**
   * 获取评教任务详情
   * @param taskId 任务ID
   * @param config 请求配置
   */
  getTaskDetail(taskId: string, config?: any) {
    return this.api.get<TaskDetailResponse>(
      '/api/v1/task/detail',
      { params: { id: taskId }, ...config }
    );
  }

  /**
   * 获取评教任务列表
   * @param params 查询参数
   * @param config 请求配置
   */
  getTaskList(params?: TaskListParams, config?: any) {
    return this.api.get<TaskListResponse>(
      '/api/v1/task/list',
      { params, ...config }
    );
  }

  /**
   * 修改评教状态
   * @param data 状态数据
   * @param config 请求配置
   */
  changeTaskStatus(data: ChangeTaskStatusRequest, config?: any) {
    return this.api.post<ChangeTaskStatusResponse>(
      '/api/v1/task/change_status',
      data,
      config
    );
  }

  /**
   * 学生端获取任务详情
   * @param params 查询参数
   * @param config 请求配置
   */
  getStudentTaskDetail(params: StudentTaskDetailParams, config?: any) {
    return this.api.get<StudentTaskDetailResponse>(
      '/api/v1/task/student_task_detail',
      { params, ...config }
    );
  }

  /**
   * 提交学生评价
   * @param data 评价数据
   * @param config 请求配置
   */
  submitEvaluation(data: SubmitEvaluationRequest, config?: any) {
    return this.api.post<SubmitEvaluationResponse>(
      '/api/v1/task/submit_evaluation',
      data,
      config
    );
  }
}

// 导出默认实例
export const taskApi = new TaskApi();
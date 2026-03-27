import { ApiClient } from './api-client';
import type { Student, Teacher } from '../types/type';

/**
 * 学生列表查询参数
 */
export interface StudentListParams {
  page: number;
  pageSize: number;
  name?: string;
  studentNo?: string;
}

/**
 * 学生列表响应数据
 */
export interface StudentListResponse {
  message: string;
  data: Student[];
  total: number;
}

/**
 * 教师列表查询参数
 */
export interface TeacherListParams {
  page: number;
  pageSize: number;
  name?: string;
  workNo?: string;
}

/**
 * 教师列表响应数据
 */
export interface TeacherListResponse {
  message: string;
  data: Teacher[];
  total: string;
}

/**
 * 删除学生/教师请求参数
 */
export interface DeleteRequest {
  id: number;
}

/**
 * 更新学生信息请求参数
 */
export interface UpdateStudentRequest {
  id: number;
  name: string;
  sex: string;
  idCardNo: string;
}

/**
 * 更新教师信息请求参数
 */
export interface UpdateTeacherRequest {
  id: number;
  name: string;
  sex: string;
  email: string;
}

/**
 * 基础信息模块API
 */
export class BaseInfoApi {
  private api: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.api = apiClient || new ApiClient();
  }

  /**
   * 导入学生信息
   * @param file 文件对象
   * @param config 请求配置
   */
  importStudents(file: File, config?: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<{ message: string }>(
      '/api/v1/base-info/student/import',
      formData,
      config
    );
  }

  /**
   * 导入教师信息
   * @param file 文件对象
   * @param config 请求配置
   */
  importTeachers(file: File, config?: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<{ message: string }>(
      '/api/v1/base-info/teacher/import',
      formData,
      config
    );
  }

  /**
   * 获取学生列表
   * @param params 查询参数
   * @param config 请求配置
   */
  getStudentList(params: StudentListParams, config?: any) {
    return this.api.get<StudentListResponse>(
      '/api/v1/base-info/student/list',
      { params, ...config }
    );
  }

  /**
   * 获取教师列表
   * @param params 查询参数
   * @param config 请求配置
   */
  getTeacherList(params: TeacherListParams, config?: any) {
    return this.api.get<TeacherListResponse>(
      '/api/v1/base-info/teacher/list',
      { params, ...config }
    );
  }

  /**
   * 删除学生
   * @param id 学生ID
   * @param config 请求配置
   */
  deleteStudent(id: number, config?: any) {
    return this.api.post<{ message: string }>(
      '/api/v1/base-info/student/delete',
      { id },
      config
    );
  }

  /**
   * 删除教师
   * @param id 教师ID
   * @param config 请求配置
   */
  deleteTeacher(id: number, config?: any) {
    return this.api.post<{ message: string }>(
      '/api/v1/base-info/teacher/delete',
      { id },
      config
    );
  }

  /**
   * 更新学生信息
   * @param data 学生信息
   * @param config 请求配置
   */
  updateStudent(data: UpdateStudentRequest, config?: any) {
    return this.api.post<{ message: string; data: Student }>(
      '/api/v1/base-info/student/update',
      data,
      config
    );
  }

  /**
   * 更新教师信息
   * @param data 教师信息
   * @param config 请求配置
   */
  updateTeacher(data: UpdateTeacherRequest, config?: any) {
    return this.api.post<{ message: string; data: Teacher }>(
      '/api/v1/base-info/teacher/update',
      data,
      config
    );
  }
}


import { ApiClient } from './api-client';
import type { Student, Teacher } from '../types/type';

/**
 * 课程基本信息
 */
export interface CourseBasic {
  id: number;
  courseName: string;
  className: string;
  status: number;
  teacherList: Teacher[];
  studentList: Student[];
}

/**
 * 课程列表查询参数
 */
export interface CourseListParams {
  page?: number;
  pageSize?: number;
}

/**
 * 课程列表响应数据
 */
export interface CourseListResponse {
  message: string;
  data: CourseBasic[];
  total: string;
}

/**
 * 课程详情查询参数
 */
export interface CourseDetailParams {
  courseId: string;
}

/**
 * 课程详情响应数据
 */
export interface CourseDetailResponse {
  message: string;
  data: CourseBasic;
}

/**
 * 编辑课程请求参数
 */
export interface EditCourseRequest {
  courseId: number;
  courseName: string;
  className: string;
  teacherIds: number[];
  status: number;
}

/**
 * 编辑课程响应数据
 */
export interface EditCourseResponse {
  message: string;
  data: CourseBasic;
}

/**
 * 课程管理模块API
 */
export class CourseApi {
  private api: ApiClient;

  constructor(apiClient?: ApiClient) {
    this.api = apiClient || new ApiClient();
  }

  /**
   * 导入课程信息
   * @param file 文件对象
   * @param config 请求配置
   */
  importCourses(file: File, config?: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.upload<{ message: string }>(
      '/api/v1/base-info/course/import',
      formData,
      config
    );
  }

  /**
   * 获取课程列表
   * @param params 查询参数
   * @param config 请求配置
   */
  getCourseList(params?: CourseListParams, config?: any) {
    return this.api.get<CourseListResponse>(
      '/api/v1/base-info/course/list',
      { params, ...config }
    );
  }

  /**
   * 获取课程详情
   * @param courseId 课程ID
   * @param config 请求配置
   */
  getCourseDetail(courseId: string, config?: any) {
    return this.api.get<CourseDetailResponse>(
      '/api/v1/base-info/course/detail',
      { params: { courseId }, ...config }
    );
  }

  /**
   * 修改课程基本信息/绑定教师
   * @param data 课程信息
   * @param config 请求配置
   */
  editCourse(data: EditCourseRequest, config?: any) {
    return this.api.post<EditCourseResponse>(
      '/api/v1/base-info/course/edit',
      data,
      config
    );
  }
}

// 导出默认实例
export const courseApi = new CourseApi();
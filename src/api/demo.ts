/**
 * API使用示例
 * 此文件展示如何使用API类进行请求
 */

import { api } from './index';

// 示例：获取学生列表
async function fetchStudentList() {
  try {
    const params = { page: 1, pageSize: 10 };
    const result = await api.baseInfo.getStudentList(params);
    console.log('学生列表:', result.data);
    console.log('总数:', result.total);
  } catch (error) {
    // 错误已经通过ElMessage自动显示，这里可以处理业务逻辑
    console.error('获取学生列表失败:', error);
  }
}

// 示例：导入学生信息
async function importStudentFile(file: File) {
  try {
    // 显示成功消息
    const result = await api.baseInfo.importStudents(file, { showSuccess: true });
    console.log('导入结果:', result.message);
  } catch (error) {
    // 错误已经通过ElMessage自动显示
    console.error('导入失败:', error);
  }
}

// 示例：更新学生信息
async function updateStudent() {
  try {
    const data = {
      id: 1,
      name: '张三',
      sex: '女',
      idCardNo: '320721200703195432',
    };
    const result = await api.baseInfo.updateStudent(data, { showSuccess: true });
    console.log('更新成功:', result.data);
  } catch (error) {
    console.error('更新失败:', error);
  }
}

// 示例：获取课程列表
async function fetchCourseList() {
  try {
    const result = await api.course.getCourseList();
    console.log('课程列表:', result.data);
  } catch (error) {
    console.error('获取课程列表失败:', error);
  }
}

// 示例：编辑课程信息
async function editCourse() {
  try {
    const data = {
      courseId: 16,
      courseName: '数据结构',
      className: '25-数据结构-1班',
      teacherIds: [39, 38, 37, 36],
      status: 0,
    };
    const result = await api.course.editCourse(data, { showSuccess: true });
    console.log('编辑课程成功:', result.data);
  } catch (error) {
    console.error('编辑课程失败:', error);
  }
}

// 示例：静默请求（不显示错误消息）
async function silentRequest() {
  try {
    const result = await api.baseInfo.getStudentList(
      { page: 1, pageSize: 10 },
      { silent: true } // 不显示错误消息
    );
    console.log('静默请求结果:', result);
  } catch (error) {
    // 不会显示ElMessage错误提示
    console.error('静默请求失败:', error);
  }
}

// 导出示例函数供测试使用
export const apiExamples = {
  fetchStudentList,
  importStudentFile,
  updateStudent,
  fetchCourseList,
  editCourse,
  silentRequest,
};
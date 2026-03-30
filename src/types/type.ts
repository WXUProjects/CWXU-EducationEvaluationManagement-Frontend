export interface Student {
    id: number,
    studentNo: string,
    idCardNo: string,
    name: string,
    sex: string,
}

export interface Teacher {
    id: number,
    workNo: string,
    email: string,
    name: string,
    sex: string,
}

export interface Course {
  id: number;
  courseName: string;
  className: string;
  status: number;
  teacherList: Teacher[];
  studentList: Student[];
}

export interface EvaluationTask {
    id: number;
    status: number;
    title: string;
    courses: Course[];
    details: EvaluationDetail[];
}

export interface EvaluationDetail {
    id: number;
    course: Course;
    student: Student;
    detail: string;     // 学生评价的 JSON 内容
}
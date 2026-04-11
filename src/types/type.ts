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

export interface Question {
    id: number;
    content: string;
    score: number;
    sort: number;
}
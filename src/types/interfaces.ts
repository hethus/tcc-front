export interface ITableUser {
  name: string;
  email: string;
  registration: string;
}

export interface ITableClass {
  id?: string;
  name: string;
  semester: string;
  subjectId: number;
  subjectName: string;
  teacherId: string;
}
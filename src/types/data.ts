export interface IModelObj {
  content: string;
  chapterId: number;
  branches: { [key: number]: IModelObj };
}

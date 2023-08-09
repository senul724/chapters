export interface IModelObj {
  content: string;
  chapterId: number;
  branches: Record<number, IModelObj>;
}

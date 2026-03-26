import type {
  ProjectDictOption,
  ProjectStatus
} from "@/views/project/shared/constants";

export type { ProjectStatus };
export type DictOption = ProjectDictOption;

export interface EvaluationProjectRow {
  id: number;
  projectName: string;
  projectCode: string;
  projectStatus: ProjectStatus;
  owner: string;
  projectStartTime: string;
  robotType: string;
  robotStage: string;
  robotUseTime?: string;
  remark?: string;
  createTime: number;
}

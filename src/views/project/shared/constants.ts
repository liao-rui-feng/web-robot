export type ProjectStatus = "pending" | "in_progress" | "completed";

export interface ProjectDictOption {
  label: string;
  value: string;
  isDefault?: boolean;
  colorTag?: string;
}

export interface ProjectQueryModel {
  projectName: string;
  projectCode: string;
  projectStatus: string;
  owner: string;
  robotType: string;
  robotStage: string;
}

export const DICT_TYPE_MAP = {
  robotType: "robot_type",
  robotStage: "robot_stage"
} as const;

export const projectStatusOptions: Array<{
  label: string;
  value: ProjectStatus;
}> = [
  { label: "待启动", value: "pending" },
  { label: "进行中", value: "in_progress" },
  { label: "已完成", value: "completed" }
];

export const projectStatusLabelMap: Record<ProjectStatus, string> = {
  pending: "待启动",
  in_progress: "进行中",
  completed: "已完成"
};

export const projectStatusTagTypeMap: Record<
  ProjectStatus,
  "info" | "warning" | "success"
> = {
  pending: "info",
  in_progress: "warning",
  completed: "success"
};

export const defaultProjectQueryModel: ProjectQueryModel = {
  projectName: "",
  projectCode: "",
  projectStatus: "",
  owner: "",
  robotType: "",
  robotStage: ""
};

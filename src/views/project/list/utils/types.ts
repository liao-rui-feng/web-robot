// 模块内表单字段定义
export type ProjectStatus = "pending" | "in_progress" | "completed";

export interface DictOption {
  label: string;
  value: string;
}

interface FormItemProps {
  /** 项目名称 */
  projectName: string;
  /** 项目编号（全局唯一） */
  projectCode: string;
  /** 项目状态 */
  projectStatus: ProjectStatus;
  /** 负责人 */
  owner: string;
  /** 项目开始时间 */
  projectStartTime: string;
  /** 机器人类型 */
  robotType: string;
  /** 机器人阶段 */
  robotStage: string;
  /** 机器人投用时间 */
  robotUseTime?: string;
  /** 备注 */
  remark?: string;
}

interface FormProps {
  formInline: FormItemProps;
  mode: "add" | "edit" | "detail";
  robotTypeOptions: DictOption[];
  robotStageOptions: DictOption[];
}

export type { FormItemProps, FormProps };

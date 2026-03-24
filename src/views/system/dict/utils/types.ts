export type DictType = "robot_type" | "robot_stage" | (string & {});

export interface DictOption {
  label: string;
  value: DictType;
}

export interface DictTypeCard extends DictOption {
  count: number;
}

export type DictTreeNodeType = "type" | "item";

export interface DictTypeEntity {
  id?: number;
  dictType: string;
  name: string;
  sort: number;
  status: 0 | 1;
  remark?: string;
  builtin?: boolean;
  createTime?: number;
}

export interface DictTreeNode {
  id: string;
  label: string;
  nodeType: DictTreeNodeType;
  dictType: DictType;
  value?: string;
  count?: number;
  status?: 0 | 1;
  builtin?: boolean;
  children?: DictTreeNode[];
}

export interface DictItemProps {
  dictType: DictType;
  label: string;
  value: string;
  sort: number;
  status: 0 | 1;
  remark?: string;
}

export interface FormProps {
  formInline: DictItemProps;
  mode: "add" | "edit" | "detail";
  dictTypeOptions: DictOption[];
  lockDictType?: boolean;
}

export interface DictTypeFormProps {
  formInline: DictTypeEntity;
  mode: "add" | "edit";
  lockDictType?: boolean;
}

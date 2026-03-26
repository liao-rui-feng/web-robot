export interface MatrixTemplateQuery {
  templateName: string;
  templateCode: string;
}

export interface MatrixTemplateRow {
  id: number;
  templateName: string;
  templateCode: string;
  remark?: string;
  updateTime: number;
  createTime: number;
}

export interface MatrixTemplateCreateForm {
  templateName: string;
  templateCode: string;
  remark?: string;
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  source?: string;
}

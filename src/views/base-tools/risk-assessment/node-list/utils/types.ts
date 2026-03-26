export interface NodeListQuery {
  nodeName: string;
  analyst: string;
}

export interface MatrixTemplateOption {
  label: string;
  value: string;
}

export interface NodeRow {
  id: number;
  projectId: number;
  projectCode: string;
  projectName: string;
  nodeName: string;
  analyst: string;
  designIntent: string;
  mainInterlockControlPoint: string;
  mainEquipmentParams: string;
  referenceDrawing: string;
  analysisTime: string;
  remark?: string;
}

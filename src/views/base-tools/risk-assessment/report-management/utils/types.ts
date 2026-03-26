export interface ReportQuery {
  projectName: string;
  projectCode: string;
  unitName: string;
}

export interface ReportRow {
  id: number;
  projectName: string;
  projectCode: string;
  unitName: string;
  nodeName: string;
  analyst: string;
  analysisTime: string;
  reportNo: string;
}

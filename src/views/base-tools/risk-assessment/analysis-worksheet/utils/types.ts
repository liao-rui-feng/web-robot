export interface WorksheetQuery {
  parameter: string;
  deviation: string;
}

export interface WorksheetRow {
  id: number;
  projectId: number;
  nodeId: number;
  parameter: string;
  deviation: string;
  cause: string;
  consequence: string;
  rawLikelihood: string;
  rawConsequenceLevel: string;
  rawRiskLevel: string;
  currentProtection: string;
  residualOneLikelihood: string;
  residualOneConsequenceLevel: string;
  residualOneRiskLevel: string;
  suggestedProtection: string;
  residualTwoLikelihood: string;
  residualTwoConsequenceLevel: string;
  residualTwoRiskLevel: string;
  remark?: string;
}

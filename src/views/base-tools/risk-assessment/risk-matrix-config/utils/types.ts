export type MatrixFrequencyKey =
  | "freq1Risk"
  | "freq2Risk"
  | "freq3Risk"
  | "freq4Risk"
  | "freq5Risk";

export interface MatrixFrequencyColumn {
  key: MatrixFrequencyKey;
  level: string;
  description: string;
  rangeDesc: string;
}

export interface MatrixConfigRow {
  level: string;
  personnelConsequence: string;
  environmentDamage: string;
  propertyLoss: string;
  reputationImpact: string;
  freq1Risk: string;
  freq2Risk: string;
  freq3Risk: string;
  freq4Risk: string;
  freq5Risk: string;
}

export interface MatrixConfig {
  templateId: number;
  templateName: string;
  templateCode: string;
  remark?: string;
  frequencyColumns: MatrixFrequencyColumn[];
  rows: MatrixConfigRow[];
}

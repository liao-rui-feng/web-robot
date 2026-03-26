import type { CommonDictOption } from "@/hooks/useDictOptions";

export const robotTypeLocalOptions: CommonDictOption[] = [
  { label: "多关节工业机器人", value: "multi_joint_industrial" },
  { label: "协作机器人", value: "collaborative" },
  { label: "物流机器人", value: "logistics" },
  { label: "复合机器人", value: "composite" }
];

export const robotStageLocalOptions: CommonDictOption[] = [
  { label: "研发阶段", value: "research" },
  { label: "使用阶段", value: "use" },
  { label: "维护阶段", value: "maintenance" },
  { label: "报废阶段", value: "scrap_terminal" }
];

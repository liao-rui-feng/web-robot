import dayjs from "dayjs";
import { useProjectQueryBase } from "@/views/project/shared/useProjectQueryBase";
import { getProjectList } from "@/api/system";
import {
  projectStatusLabelMap,
  projectStatusTagTypeMap,
  type ProjectStatus
} from "@/views/project/shared/constants";
import type { EvaluationProjectRow } from "./types";

export function useEvaluationProject() {
  const {
    form,
    loading,
    dataList,
    pagination,
    robotTypeOptions,
    robotStageOptions,
    robotTypeLabelMap,
    robotStageLabelMap,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  } = useProjectQueryBase<EvaluationProjectRow>(getProjectList);

  const columns: TableColumnList = [
    {
      label: "项目编号",
      prop: "projectCode",
      width: 150
    },
    {
      label: "项目名称",
      prop: "projectName",
      minWidth: 180
    },
    {
      label: "项目状态",
      prop: "projectStatus",
      width: 110,
      cellRenderer: scope => (
        <el-tag
          size={scope.props.size}
          type={projectStatusTagTypeMap[scope.row.projectStatus as ProjectStatus]}
        >
          {projectStatusLabelMap[scope.row.projectStatus as ProjectStatus]}
        </el-tag>
      )
    },
    {
      label: "负责人",
      prop: "owner",
      width: 110
    },
    {
      label: "机器人类型",
      prop: "robotType",
      minWidth: 130,
      formatter: ({ robotType }) => robotTypeLabelMap.value[robotType] ?? robotType
    },
    {
      label: "机器人阶段",
      prop: "robotStage",
      minWidth: 120,
      formatter: ({ robotStage }) => robotStageLabelMap.value[robotStage] ?? robotStage
    },
    {
      label: "项目开始时间",
      prop: "projectStartTime",
      width: 130
    },
    {
      label: "机器人投用时间",
      prop: "robotUseTime",
      width: 130,
      formatter: ({ robotUseTime }) => robotUseTime || "-"
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 180,
      formatter: ({ remark }) => remark || "-"
    },
    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 160,
      formatter: ({ createTime }) => dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 110,
      slot: "operation"
    }
  ];

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    robotTypeOptions,
    robotStageOptions,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}

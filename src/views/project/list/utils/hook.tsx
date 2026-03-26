import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps, ProjectStatus } from "./types";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import { getProjectList } from "@/api/system";
import { useProjectQueryBase } from "../../shared/useProjectQueryBase";
import {
  projectStatusLabelMap,
  projectStatusTagTypeMap
} from "../../shared/constants";
import { type Ref, ref, h } from "vue";

const defaultFormInline: FormItemProps = {
  projectName: "",
  projectCode: "",
  projectStatus: "pending",
  owner: "",
  projectStartTime: "",
  robotType: "",
  robotStage: "",
  robotUseTime: "",
  remark: ""
};

type ProjectRow = FormItemProps & {
  id: number;
  createTime: number;
};

export function useProject(tableRef: Ref) {
  const formRef = ref();
  const selectedNum = ref(0);
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
  } = useProjectQueryBase<ProjectRow>(getProjectList);

  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      reserveSelection: true,
      fixed: "left"
    },
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
      width: 230,
      slot: "operation"
    }
  ];

  function handleDelete(row: ProjectRow) {
    message(`您删除了项目编号为 ${row.projectCode} 的这条数据`, {
      type: "success"
    });
    onSearch();
  }

  function handleSelectionChange(val: Array<ProjectRow>) {
    selectedNum.value = val.length;
    tableRef.value?.setAdaptive?.();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value?.getTableRef?.()?.clearSelection?.();
  }

  function onBatchDel() {
    const curSelected = tableRef.value?.getTableRef?.()?.getSelectionRows?.() ?? [];
    if (!curSelected.length) return;

    message(`已删除项目编号为 ${getKeyList(curSelected, "projectCode")} 的数据`, {
      type: "success"
    });
    onSelectionCancel();
    onSearch();
  }

  function openDialog(mode: "add" | "edit" | "detail" = "add", row?: ProjectRow) {
    const titleMap = {
      add: "新增",
      edit: "修改",
      detail: "项目详情"
    } as const;

    addDialog({
      title: mode === "detail" ? titleMap[mode] : `${titleMap[mode]}项目`,
      props: {
        formInline: {
          ...defaultFormInline,
          ...(row ?? {})
        },
        mode,
        robotTypeOptions: robotTypeOptions.value,
        robotStageOptions: robotStageOptions.value
      },
      width: "48%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: mode === "detail",
      contentRenderer: ({ options }) =>
        h(editForm, {
          ref: formRef,
          formInline: options.props.formInline,
          mode: options.props.mode,
          robotTypeOptions: options.props.robotTypeOptions,
          robotStageOptions: options.props.robotStageOptions
        }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        FormRef.validate(valid => {
          if (!valid) return;

          if (mode === "add") {
            message(`您新增了项目 ${curData.projectName}（${curData.projectCode}）`, {
              type: "success"
            });
          } else {
            message(`您修改了项目 ${curData.projectName}（${curData.projectCode}）`, {
              type: "success"
            });
          }
          done();
          onSearch();
        });
      }
    });
  }

  return {
    form,
    loading,
    selectedNum,
    columns,
    dataList,
    pagination,
    robotTypeOptions,
    robotStageOptions,
    onSearch,
    resetForm,
    openDialog,
    onBatchDel,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    onSelectionCancel,
    statusLabelMap: projectStatusLabelMap
  };
}

import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { DictOption, FormItemProps, ProjectStatus } from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import { getProjectList } from "@/api/system";
import { useDictOptions } from "@/hooks/useDictOptions";
import { type Ref, reactive, ref, onMounted, h, toRaw, computed } from "vue";

const statusLabelMap: Record<ProjectStatus, string> = {
  pending: "待启动",
  in_progress: "进行中",
  completed: "已完成"
};

const statusTagTypeMap: Record<ProjectStatus, "info" | "warning" | "success"> =
  {
    pending: "info",
    in_progress: "warning",
    completed: "success"
  };

const defaultRobotTypeOptions: DictOption[] = [
  { label: "多关节工业机器人", value: "multi_joint_industrial" },
  { label: "协作机器人", value: "collaborative" },
  { label: "物流机器人", value: "logistics" },
  { label: "复合机器人", value: "composite" }
];

const defaultRobotStageOptions: DictOption[] = [
  { label: "研发阶段", value: "research" },
  { label: "使用阶段", value: "use" },
  { label: "维护阶段", value: "maintenance" },
  { label: "报废极端", value: "scrap_terminal" }
];

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

const DICT_TYPE_MAP = {
  robotType: "robot_type",
  robotStage: "robot_stage"
} as const;

type ProjectRow = FormItemProps & {
  id: number;
  createTime: number;
};

export function useProject(tableRef: Ref) {
  const form = reactive({
    projectName: "",
    projectCode: "",
    projectStatus: "",
    owner: "",
    robotType: "",
    robotStage: ""
  });

  const formRef = ref();
  const dataList = ref<ProjectRow[]>([]);
  const loading = ref(true);
  const selectedNum = ref(0);
  const { getOptionsByType, loadDictOptions } = useDictOptions(
    [DICT_TYPE_MAP.robotType, DICT_TYPE_MAP.robotStage],
    {
      [DICT_TYPE_MAP.robotType]: defaultRobotTypeOptions,
      [DICT_TYPE_MAP.robotStage]: defaultRobotStageOptions
    }
  );
  const robotTypeOptions = computed<DictOption[]>(() =>
    getOptionsByType(DICT_TYPE_MAP.robotType)
  );
  const robotStageOptions = computed<DictOption[]>(() =>
    getOptionsByType(DICT_TYPE_MAP.robotStage)
  );
  const robotTypeLabelMap = computed(() =>
    Object.fromEntries(robotTypeOptions.value.map(item => [item.value, item.label]))
  );
  const robotStageLabelMap = computed(() =>
    Object.fromEntries(robotStageOptions.value.map(item => [item.value, item.label]))
  );

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

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
        <el-tag size={scope.props.size} type={statusTagTypeMap[scope.row.projectStatus]}>
          {statusLabelMap[scope.row.projectStatus]}
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

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
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

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getProjectList(toRaw(form));
    if (code === 0) {
      dataList.value = (data.list ?? []) as ProjectRow[];
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
      pagination.currentPage = data.currentPage;
    }

    setTimeout(() => {
      loading.value = false;
    }, 400);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

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

  onMounted(async () => {
    await loadDictOptions();
    onSearch();
  });

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
    statusLabelMap
  };
}

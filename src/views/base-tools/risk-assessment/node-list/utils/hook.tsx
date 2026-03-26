import { computed, onMounted, reactive, ref, toRaw } from "vue";
import { useRoute } from "vue-router";
import { getRiskAssessmentNodeList, getRiskMatrixTemplateList } from "@/api/system";
import type { PaginationProps } from "@pureadmin/table";
import type { MatrixTemplateOption, NodeListQuery, NodeRow } from "./types";

export function useRiskAssessmentNodeList() {
  const route = useRoute();
  const loading = ref(true);
  const matrixTemplateLoading = ref(false);
  const form = reactive<NodeListQuery>({
    nodeName: "",
    analyst: ""
  });
  const matrixTemplateValue = ref("");
  const matrixTemplateOptions = ref<MatrixTemplateOption[]>([]);
  const dataList = ref<NodeRow[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const projectId = computed(() => Number(route.query.projectId || 0));

  const columns: TableColumnList = [
    {
      label: "节点名称",
      prop: "nodeName",
      minWidth: 150
    },
    {
      label: "分析人员",
      prop: "analyst",
      width: 120
    },
    {
      label: "设计意图",
      prop: "designIntent",
      minWidth: 200
    },
    {
      label: "主要联锁/控制点",
      prop: "mainInterlockControlPoint",
      minWidth: 200
    },
    {
      label: "主要设备及技术参数",
      prop: "mainEquipmentParams",
      minWidth: 200
    },
    {
      label: "参考图纸",
      prop: "referenceDrawing",
      width: 140
    },
    {
      label: "分析时间",
      prop: "analysisTime",
      width: 130
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 180,
      formatter: ({ remark }) => remark || "-"
    },
    {
      label: "操作",
      fixed: "right",
      width: 280,
      showOverflowTooltip: false,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getRiskAssessmentNodeList({
      ...toRaw(form),
      projectId: projectId.value || undefined,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });

    if (code === 0) {
      dataList.value = (data.list ?? []) as NodeRow[];
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
      pagination.currentPage = data.currentPage;
    }

    setTimeout(() => {
      loading.value = false;
    }, 200);
  }

  async function loadMatrixTemplateOptions(preferredTemplateId?: string) {
    matrixTemplateLoading.value = true;
    const { code, data } = await getRiskMatrixTemplateList({
      templateName: "",
      templateCode: "",
      currentPage: 1,
      pageSize: 999
    });
    if (code === 0) {
      const options = (data.list ?? []).map((item: any) => ({
        label: item.templateName,
        value: String(item.id)
      }));
      matrixTemplateOptions.value = options;
      if (preferredTemplateId) {
        const matched = options.find(item => item.value === preferredTemplateId);
        if (matched) {
          matrixTemplateValue.value = preferredTemplateId;
        }
      } else if (options.length > 0) {
        const hasCurrent = options.some(item => item.value === matrixTemplateValue.value);
        if (!hasCurrent) {
          matrixTemplateValue.value = options[0].value;
        }
      }
    }
    matrixTemplateLoading.value = false;
  }

  function setMatrixTemplateValue(value: string) {
    matrixTemplateValue.value = value;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  };

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(async () => {
    await loadMatrixTemplateOptions();
    onSearch();
  });

  return {
    form,
    loading,
    matrixTemplateLoading,
    matrixTemplateValue,
    matrixTemplateOptions,
    loadMatrixTemplateOptions,
    setMatrixTemplateValue,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}

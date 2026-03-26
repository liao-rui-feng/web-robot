import { onMounted, reactive, ref, toRaw } from "vue";
import { getRiskAssessmentReportList } from "@/api/system";
import type { PaginationProps } from "@pureadmin/table";
import type { ReportQuery, ReportRow } from "./types";

export function useRiskAssessmentReport() {
  const loading = ref(true);
  const form = reactive<ReportQuery>({
    projectName: "",
    projectCode: "",
    unitName: ""
  });
  const dataList = ref<ReportRow[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "报告编号",
      prop: "reportNo",
      width: 130
    },
    {
      label: "项目名称",
      prop: "projectName",
      minWidth: 180
    },
    {
      label: "项目编号",
      prop: "projectCode",
      width: 140
    },
    {
      label: "装置名称",
      prop: "unitName",
      width: 140
    },
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
      label: "分析时间",
      prop: "analysisTime",
      width: 130
    },
    {
      label: "操作",
      fixed: "right",
      width: 120,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getRiskAssessmentReportList({
      ...toRaw(form),
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });
    if (code === 0) {
      dataList.value = (data.list ?? []) as ReportRow[];
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
      pagination.currentPage = data.currentPage;
    }
    setTimeout(() => {
      loading.value = false;
    }, 200);
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

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    onSearch,
    resetForm,
    handleSizeChange,
    handleCurrentChange
  };
}

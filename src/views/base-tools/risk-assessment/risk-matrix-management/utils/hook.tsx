import dayjs from "dayjs";
import { onMounted, reactive, ref, toRaw } from "vue";
import { getRiskMatrixTemplateList } from "@/api/system";
import type { PaginationProps } from "@pureadmin/table";
import type { MatrixTemplateQuery, MatrixTemplateRow } from "./types";

export function useRiskMatrixManagement() {
  const loading = ref(true);
  const form = reactive<MatrixTemplateQuery>({
    templateName: "",
    templateCode: ""
  });
  const dataList = ref<MatrixTemplateRow[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "模板名称",
      prop: "templateName",
      minWidth: 180
    },
    {
      label: "模板编号",
      prop: "templateCode",
      width: 140
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 180,
      formatter: ({ remark }) => remark || "-"
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: 170,
      formatter: ({ updateTime }) => dayjs(updateTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 170,
      formatter: ({ createTime }) => dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 160,
      slot: "operation"
    }
  ];

  async function onSearch() {
    loading.value = true;
    const { code, data } = await getRiskMatrixTemplateList({
      ...toRaw(form),
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });

    if (code === 0) {
      dataList.value = (data.list ?? []) as MatrixTemplateRow[];
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

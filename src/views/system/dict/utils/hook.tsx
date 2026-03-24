import dayjs from "dayjs";
import editForm from "../form.vue";
import dictTypeForm from "../type-form.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import {
  getDictList,
  getDictTypeList,
  saveDictType,
  toggleDictTypeStatus,
  deleteDictType,
  saveDictItem,
  deleteDictItem
} from "@/api/system";
import type {
  DictItemProps,
  DictOption,
  DictType,
  DictTypeEntity
} from "./types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection, getKeyList } from "@pureadmin/utils";
import { type Ref, reactive, ref, onMounted, h, toRaw, computed } from "vue";

const statusLabelMap: Record<number, string> = {
  1: "启用",
  0: "停用"
};

const statusTagTypeMap: Record<number, "success" | "info"> = {
  1: "success",
  0: "info"
};

const defaultFormInline: DictItemProps = {
  dictType: "robot_type",
  label: "",
  value: "",
  sort: 1,
  status: 1,
  isDefault: false,
  colorTag: "",
  remark: ""
};

type DictRow = DictItemProps & {
  id: number;
  dictTypeName?: string;
  createTime: number;
};

const typeSorter = (a: DictTypeEntity, b: DictTypeEntity) =>
  a.sort - b.sort || (a.id ?? 0) - (b.id ?? 0);

export function useDict(_tableRef: Ref) {
  const form = reactive({
    label: "",
    value: "",
    status: ""
  });

  const itemFormRef = ref();
  const typeFormRef = ref();
  const loading = ref(true);
  const selectedNum = ref(0);
  const dataList = ref<DictRow[]>([]);
  const dictTypeList = ref<DictTypeEntity[]>([]);
  const allDictItemList = ref<DictRow[]>([]);
  const activeDictType = ref<DictType>("robot_type");

  const activeDictTypeInfo = computed(() =>
    dictTypeList.value.find(item => item.dictType === activeDictType.value)
  );

  const activeDictTypeLabel = computed(
    () => activeDictTypeInfo.value?.name ?? activeDictType.value
  );

  const dictTypeOptions = computed<DictOption[]>(() =>
    [...dictTypeList.value]
      .sort(typeSorter)
      .map(item => ({
        label: item.name,
        value: item.dictType as DictType
      }))
  );

  const dictTypeCards = computed(() => {
    const countMap = new Map<string, number>();
    allDictItemList.value.forEach(item => {
      countMap.set(item.dictType, (countMap.get(item.dictType) ?? 0) + 1);
    });

    return [...dictTypeList.value]
      .sort(typeSorter)
      .map(item => ({
        ...item,
        count: countMap.get(item.dictType) ?? 0
      }));
  });

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
      label: "字典标签",
      prop: "label",
      minWidth: 160
    },
    {
      label: "字典键值",
      prop: "value",
      minWidth: 180
    },
    {
      label: "排序",
      prop: "sort",
      width: 90
    },
    {
      label: "默认项",
      prop: "isDefault",
      width: 90,
      cellRenderer: scope =>
        scope.row.isDefault ? (
          <el-tag size={scope.props.size} type="warning">
            默认
          </el-tag>
        ) : (
          "-"
        )
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: scope => (
        <el-tag size={scope.props.size} type={statusTagTypeMap[scope.row.status]}>
          {statusLabelMap[scope.row.status]}
        </el-tag>
      )
    },
    {
      label: "标签色",
      prop: "colorTag",
      width: 110,
      cellRenderer: scope =>
        scope.row.colorTag ? (
          <el-tag
            size={scope.props.size}
            style={{
              color: scope.row.colorTag,
              borderColor: scope.row.colorTag,
              backgroundColor: `${scope.row.colorTag}1A`
            }}
          >
            色签
          </el-tag>
        ) : (
          "-"
        )
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

  function clearFilters() {
    form.label = "";
    form.value = "";
    form.status = "";
    pagination.currentPage = 1;
  }

  function syncActiveType() {
    if (!dictTypeList.value.length) {
      activeDictType.value = "";
      return;
    }

    const currentExists = dictTypeList.value.some(
      item => item.dictType === activeDictType.value
    );
    if (!currentExists) {
      activeDictType.value = [...dictTypeList.value].sort(typeSorter)[0].dictType;
    }
  }

  async function loadDictData() {
    const [dictTypeRes, dictItemRes] = await Promise.all([
      getDictTypeList({ pageSize: 999, currentPage: 1 }),
      getDictList({ pageSize: 999, currentPage: 1 })
    ]);

    if (dictTypeRes.code === 0) {
      dictTypeList.value = (dictTypeRes.data?.list ?? []) as DictTypeEntity[];
    }
    if (dictItemRes.code === 0) {
      allDictItemList.value = (dictItemRes.data?.list ?? []) as DictRow[];
    }

    syncActiveType();
  }

  async function onSearch() {
    if (!activeDictType.value) {
      dataList.value = [];
      pagination.total = 0;
      return;
    }

    loading.value = true;
    const { code, data } = await getDictList({
      ...toRaw(form),
      dictType: activeDictType.value,
      pageSize: pagination.pageSize,
      currentPage: pagination.currentPage
    });

    if (code === 0) {
      dataList.value = (data?.list ?? []) as DictRow[];
      pagination.total = data?.total ?? 0;
      pagination.pageSize = data?.pageSize ?? pagination.pageSize;
      pagination.currentPage = data?.currentPage ?? pagination.currentPage;
    }

    loading.value = false;
  }

  async function refreshTreeAndList() {
    await loadDictData();
    await onSearch();
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    pagination.currentPage = 1;
    onSearch();
  };

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val: Array<DictRow>) {
    selectedNum.value = val.length;
    _tableRef.value?.setAdaptive?.();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    _tableRef.value?.getTableRef?.()?.clearSelection?.();
  }

  async function onBatchDel() {
    const curSelected = _tableRef.value?.getTableRef?.()?.getSelectionRows?.() ?? [];
    if (!curSelected.length) return;

    const ids = getKeyList(curSelected, "id");
    const results = await Promise.all(
      ids.map(id => deleteDictItem({ id }))
    );
    const failedNum = results.filter(item => item.code !== 0).length;
    const successNum = ids.length - failedNum;

    if (failedNum === 0) {
      message(`已删除字典项编号为 ${ids.join(",")} 的数据`, { type: "success" });
    } else if (successNum === 0) {
      message("批量删除失败，请稍后重试", { type: "error" });
    } else {
      message(`批量删除完成：成功 ${successNum} 条，失败 ${failedNum} 条`, {
        type: "warning"
      });
    }

    onSelectionCancel();
    await refreshTreeAndList();
  }

  async function handleDelete(row: DictRow) {
    const { code, message: msg } = await deleteDictItem({ id: row.id });
    if (code !== 0) {
      message(msg || "删除失败", { type: "error" });
      return;
    }

    message(`已删除字典项 ${row.label}（${row.value}）`, { type: "success" });
    await refreshTreeAndList();
  }

  function handleTypeClick(type: DictTypeEntity) {
    if (!type?.dictType || type.dictType === activeDictType.value) return;
    activeDictType.value = type.dictType as DictType;
    clearFilters();
    pagination.currentPage = 1;
    onSearch();
  }

  function openDialog(mode: "add" | "edit" | "detail" = "add", row?: DictRow) {
    if (!activeDictType.value) {
      message("请先新增字典类型", { type: "warning" });
      return;
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      detail: "字典详情"
    } as const;

    addDialog({
      title: mode === "detail" ? titleMap[mode] : `${titleMap[mode]}字典项`,
      props: {
        formInline: {
          ...defaultFormInline,
          dictType: activeDictType.value,
          ...(row ?? {})
        },
        mode,
        lockDictType: true,
        dictTypeOptions: dictTypeOptions.value
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: mode === "detail",
      contentRenderer: ({ options }) =>
        h(editForm, {
          ref: itemFormRef,
          formInline: options.props.formInline,
          mode: options.props.mode,
          lockDictType: options.props.lockDictType,
          dictTypeOptions: options.props.dictTypeOptions
        }),
      beforeSure: (done, { options }) => {
        const FormRef = itemFormRef.value.getRef();
        const curData = options.props.formInline as DictItemProps & { id?: number };

        FormRef.validate(async valid => {
          if (!valid) return;

          const { code, message: msg } = await saveDictItem(curData);
          if (code !== 0) {
            message(msg || "保存失败", { type: "error" });
            return;
          }

          message(mode === "add" ? "字典项新增成功" : "字典项修改成功", {
            type: "success"
          });
          done();
          await refreshTreeAndList();
        });
      }
    });
  }

  function openTypeDialog(mode: "add" | "edit" = "add") {
    if (mode === "edit" && !activeDictTypeInfo.value) {
      message("请先选择字典类型", { type: "warning" });
      return;
    }

    const maxSort = Math.max(
      0,
      ...dictTypeList.value.map(item => Number(item.sort) || 0)
    );

    const defaultType: DictTypeEntity = {
      dictType: "",
      name: "",
      sort: maxSort + 1,
      status: 1,
      remark: "",
      builtin: false
    };

    const currentType = activeDictTypeInfo.value;

    addDialog({
      title: mode === "add" ? "新增字典类型" : "编辑字典类型",
      props: {
        formInline: mode === "add" ? defaultType : { ...currentType },
        mode,
        lockDictType: mode === "edit" && currentType?.builtin
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: ({ options }) =>
        h(dictTypeForm, {
          ref: typeFormRef,
          formInline: options.props.formInline,
          mode: options.props.mode,
          lockDictType: options.props.lockDictType
        }),
      beforeSure: (done, { options }) => {
        const FormRef = typeFormRef.value.getRef();
        const curData = options.props.formInline as DictTypeEntity;

        FormRef.validate(async valid => {
          if (!valid) return;

          const { code, message: msg, data } = await saveDictType(curData);
          if (code !== 0) {
            message(msg || "保存失败", { type: "error" });
            return;
          }

          const nextType = (data?.dictType || curData.dictType) as DictType;
          activeDictType.value = nextType;

          message(mode === "add" ? "字典类型新增成功" : "字典类型修改成功", {
            type: "success"
          });
          done();
          clearFilters();
          await refreshTreeAndList();
        });
      }
    });
  }

  async function toggleCurrentTypeStatus() {
    const currentType = activeDictTypeInfo.value;
    if (!currentType?.id) {
      message("请先选择字典类型", { type: "warning" });
      return;
    }

    const nextStatus: 0 | 1 = currentType.status === 1 ? 0 : 1;
    const { code, message: msg } = await toggleDictTypeStatus({
      id: currentType.id,
      status: nextStatus
    });
    if (code !== 0) {
      message(msg || "状态变更失败", { type: "error" });
      return;
    }

    message(`字典类型已${nextStatus === 1 ? "启用" : "停用"}`, {
      type: "success"
    });
    await refreshTreeAndList();
  }

  async function deleteCurrentType() {
    const currentType = activeDictTypeInfo.value;
    if (!currentType?.id) {
      message("请先选择字典类型", { type: "warning" });
      return;
    }
    if (currentType.builtin) {
      message("内置字典类型不允许删除", { type: "warning" });
      return;
    }

    const { code, message: msg } = await deleteDictType({ id: currentType.id });
    if (code !== 0) {
      message(msg || "删除失败", { type: "error" });
      return;
    }

    message(`已删除字典类型 ${currentType.name}`, { type: "success" });
    clearFilters();
    await refreshTreeAndList();
  }

  onMounted(async () => {
    await loadDictData();
    await onSearch();
  });

  return {
    form,
    loading,
    selectedNum,
    columns,
    dataList,
    pagination,
    dictTypeCards,
    activeDictType,
    activeDictTypeLabel,
    activeDictTypeInfo,
    onSearch,
    resetForm,
    openDialog,
    onBatchDel,
    openTypeDialog,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    onSelectionCancel,
    handleTypeClick,
    toggleCurrentTypeStatus,
    deleteCurrentType
  };
}

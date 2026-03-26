import type { PaginationProps } from "@pureadmin/table";
import { computed, onMounted, reactive, ref, toRaw } from "vue";
import { useDictOptions } from "@/hooks/useDictOptions";
import {
  robotStageLocalOptions,
  robotTypeLocalOptions
} from "@/constants/localDictOptions";
import {
  DICT_TYPE_MAP,
  defaultProjectQueryModel,
  type ProjectDictOption,
  type ProjectQueryModel
} from "./constants";

type ProjectListResponse<RowT> = {
  code: number;
  data?: {
    list?: RowT[];
    total?: number;
    pageSize?: number;
    currentPage?: number;
  };
};

type ProjectListFetcher<RowT> = (
  data?: object
) => Promise<ProjectListResponse<RowT>>;

export function useProjectQueryBase<RowT>(fetcher: ProjectListFetcher<RowT>) {
  const loading = ref(true);
  const form = reactive<ProjectQueryModel>({
    ...defaultProjectQueryModel
  });
  const dataList = ref<RowT[]>([]);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const { getOptionsByType, loadDictOptions } = useDictOptions(
    [DICT_TYPE_MAP.robotType, DICT_TYPE_MAP.robotStage],
    {
      [DICT_TYPE_MAP.robotType]: robotTypeLocalOptions,
      [DICT_TYPE_MAP.robotStage]: robotStageLocalOptions
    }
  );

  const robotTypeOptions = computed<ProjectDictOption[]>(() =>
    getOptionsByType(DICT_TYPE_MAP.robotType)
  );
  const robotStageOptions = computed<ProjectDictOption[]>(() =>
    getOptionsByType(DICT_TYPE_MAP.robotStage)
  );

  const robotTypeLabelMap = computed(() =>
    Object.fromEntries(robotTypeOptions.value.map(item => [item.value, item.label]))
  );
  const robotStageLabelMap = computed(() =>
    Object.fromEntries(robotStageOptions.value.map(item => [item.value, item.label]))
  );

  async function fetchList() {
    loading.value = true;
    const { code, data } = await fetcher({
      ...toRaw(form),
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    });

    if (code === 0) {
      dataList.value = (data?.list ?? []) as RowT[];
      pagination.total = data?.total ?? 0;
      pagination.pageSize = data?.pageSize ?? pagination.pageSize;
      pagination.currentPage = data?.currentPage ?? pagination.currentPage;
    }

    setTimeout(() => {
      loading.value = false;
    }, 200);
  }

  async function onSearch() {
    pagination.currentPage = 1;
    await fetchList();
  }

  async function resetForm() {
    Object.assign(form, defaultProjectQueryModel);
    await onSearch();
  }

  async function handleSizeChange(val: number) {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    await fetchList();
  }

  async function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    await fetchList();
  }

  onMounted(async () => {
    await loadDictOptions();
    await fetchList();
  });

  return {
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
  };
}

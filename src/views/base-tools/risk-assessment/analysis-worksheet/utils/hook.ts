import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getRiskAssessmentWorksheetList } from "@/api/system";
import type { WorksheetRow } from "./types";

export function useRiskAssessmentWorksheet() {
  const route = useRoute();
  const router = useRouter();
  const loading = ref(true);
  const dataList = ref<WorksheetRow[]>([]);
  const isExpanded = ref(false);

  const projectId = computed(() => Number(route.query.projectId || 0));
  const nodeId = computed(() => Number(route.query.nodeId || 0));

  async function fetchData() {
    loading.value = true;
    const { code, data } = await getRiskAssessmentWorksheetList({
      projectId: projectId.value || undefined,
      nodeId: nodeId.value || undefined,
      currentPage: 1,
      pageSize: 999
    });
    if (code === 0) {
      dataList.value = (data.list ?? []) as WorksheetRow[];
    }
    setTimeout(() => {
      loading.value = false;
    }, 200);
  }

  function toggleExpand() {
    isExpanded.value = !isExpanded.value;
  }

  function onReset() {
    fetchData();
  }

  function onBack() {
    router.push({
      path: "/base-tools/risk-assessment/node-list",
      query: {
        projectId: route.query.projectId,
        projectCode: route.query.projectCode,
        projectName: route.query.projectName
      }
    });
  }

  onMounted(() => {
    fetchData();
  });

  return {
    loading,
    dataList,
    isExpanded,
    toggleExpand,
    onReset,
    onBack
  };
}

import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { message } from "@/utils/message";
import { getRiskMatrixConfigDetail, saveRiskMatrixConfig } from "@/api/system";
import type {
  MatrixConfig,
  MatrixConfigRow,
  MatrixFrequencyColumn
} from "./types";

const defaultFrequencyColumns: MatrixFrequencyColumn[] = [
  {
    key: "freq1Risk",
    level: "1",
    description: "从未发生过",
    rangeDesc: ">0.0001次/年，且≤0.001"
  },
  {
    key: "freq2Risk",
    level: "2",
    description: "国内曾发生过",
    rangeDesc: ">0.001次/年，且≤0.01"
  },
  {
    key: "freq3Risk",
    level: "3",
    description: "行业内曾发生过",
    rangeDesc: ">0.01次/年，且≤0.1"
  },
  {
    key: "freq4Risk",
    level: "4",
    description: "公司内发生过",
    rangeDesc: ">0.1次/年，且≤1"
  },
  {
    key: "freq5Risk",
    level: "5",
    description: "装置内发生过",
    rangeDesc: ">1次/年"
  }
];

const defaultRows: MatrixConfigRow[] = [
  {
    level: "1",
    personnelConsequence: "",
    environmentDamage: "",
    propertyLoss: "",
    reputationImpact: "",
    freq1Risk: "I",
    freq2Risk: "I",
    freq3Risk: "I",
    freq4Risk: "II",
    freq5Risk: "II"
  },
  {
    level: "2",
    personnelConsequence: "",
    environmentDamage: "",
    propertyLoss: "",
    reputationImpact: "",
    freq1Risk: "I",
    freq2Risk: "I",
    freq3Risk: "II",
    freq4Risk: "II",
    freq5Risk: "III"
  },
  {
    level: "3",
    personnelConsequence: "",
    environmentDamage: "",
    propertyLoss: "",
    reputationImpact: "",
    freq1Risk: "I",
    freq2Risk: "II",
    freq3Risk: "II",
    freq4Risk: "III",
    freq5Risk: "III"
  },
  {
    level: "4",
    personnelConsequence: "",
    environmentDamage: "",
    propertyLoss: "",
    reputationImpact: "",
    freq1Risk: "II",
    freq2Risk: "II",
    freq3Risk: "III",
    freq4Risk: "III",
    freq5Risk: "IV"
  },
  {
    level: "5",
    personnelConsequence: "",
    environmentDamage: "",
    propertyLoss: "",
    reputationImpact: "",
    freq1Risk: "II",
    freq2Risk: "III",
    freq3Risk: "III",
    freq4Risk: "IV",
    freq5Risk: "V"
  },
  {
    level: "6",
    personnelConsequence: "",
    environmentDamage: "",
    propertyLoss: "",
    reputationImpact: "",
    freq1Risk: "III",
    freq2Risk: "III",
    freq3Risk: "IV",
    freq4Risk: "V",
    freq5Risk: "V"
  }
];

const defaultConfig: MatrixConfig = {
  templateId: 0,
  templateName: "",
  templateCode: "",
  remark: "",
  frequencyColumns: defaultFrequencyColumns,
  rows: defaultRows
};

function cloneDeep<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

function normalizeConfig(data?: Partial<MatrixConfig>): MatrixConfig {
  const normalizedFrequencyColumns =
    data?.frequencyColumns && data.frequencyColumns.length
      ? cloneDeep(data.frequencyColumns)
      : cloneDeep(defaultFrequencyColumns);
  const normalizedRows =
    data?.rows && data.rows.length ? cloneDeep(data.rows) : cloneDeep(defaultRows);

  return {
    ...cloneDeep(defaultConfig),
    ...(data ?? {}),
    frequencyColumns: normalizedFrequencyColumns,
    rows: normalizedRows
  };
}

export function useRiskMatrixConfig() {
  const route = useRoute();
  const loading = ref(true);
  const saving = ref(false);
  const config = ref<MatrixConfig>(cloneDeep(defaultConfig));
  const originalConfig = ref<MatrixConfig>(cloneDeep(defaultConfig));
  const templateId = computed(() => Number(route.query.templateId || 0));

  async function fetchDetail() {
    loading.value = true;
    const { code, data } = await getRiskMatrixConfigDetail({
      templateId: templateId.value || undefined,
      mode: route.query.mode,
      projectId: route.query.projectId,
      projectCode: route.query.projectCode,
      projectName: route.query.projectName
    });

    if (code === 0) {
      const normalized = normalizeConfig((data ?? {}) as MatrixConfig);
      config.value = cloneDeep(normalized);
      originalConfig.value = cloneDeep(normalized);
    }

    setTimeout(() => {
      loading.value = false;
    }, 200);
  }

  async function onSave() {
    if (!config.value.templateId) {
      message("请先在模板管理中新增模板后再进行配置", {
        type: "warning"
      });
      return;
    }

    saving.value = true;
    const { code, message: msg } = await saveRiskMatrixConfig(config.value);
    saving.value = false;

    if (code !== 0) {
      message(msg || "保存失败", { type: "error" });
      return;
    }

    message("保存成功", { type: "success" });
    originalConfig.value = cloneDeep(config.value);
  }

  function onReset() {
    config.value = cloneDeep(originalConfig.value);
  }

  onMounted(() => {
    fetchDetail();
  });

  return {
    loading,
    saving,
    config,
    fetchDetail,
    onSave,
    onReset
  };
}

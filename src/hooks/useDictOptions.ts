import { ref } from "vue";
import { getDictOptions } from "@/api/system";

export interface CommonDictOption {
  label: string;
  value: string;
  isDefault?: boolean;
  colorTag?: string;
}

type DictOptionMap = Record<string, CommonDictOption[]>;

export function useDictOptions(
  dictTypes: string[],
  fallbackOptions: DictOptionMap = {}
) {
  const loading = ref(false);
  const optionMap = ref<DictOptionMap>({ ...fallbackOptions });

  async function loadDictOptions() {
    if (!dictTypes.length) return;

    loading.value = true;
    const { code, data } = await getDictOptions({ dictTypes });

    if (code === 0 && data) {
      const nextMap: DictOptionMap = {};
      dictTypes.forEach(type => {
        const remote = Array.isArray(data[type]) ? data[type] : [];
        nextMap[type] = remote.length ? remote : fallbackOptions[type] ?? [];
      });
      optionMap.value = nextMap;
    }

    loading.value = false;
  }

  function getOptionsByType(dictType: string) {
    return optionMap.value[dictType] ?? [];
  }

  return {
    loading,
    optionMap,
    loadDictOptions,
    getOptionsByType
  };
}

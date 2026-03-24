<script setup lang="ts">
import { computed, ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const statusOptions = [
  { label: "启用", value: 1 },
  { label: "停用", value: 0 }
];

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    dictType: "robot_type",
    label: "",
    value: "",
    sort: 1,
    status: 1,
    remark: ""
  }),
  mode: "add",
  dictTypeOptions: () => [],
  lockDictType: false
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const isDetail = computed(() => props.mode === "detail");
const dictTypeDisabled = computed(() => isDetail.value || props.lockDictType);
const dictTypeDisplay = computed(() => {
  const current = props.dictTypeOptions.find(
    item => item.value === newFormInline.value.dictType
  );
  return current?.label ?? newFormInline.value.dictType;
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-form-item label="字典类型" prop="dictType">
      <el-input
        v-if="dictTypeDisabled"
        :model-value="dictTypeDisplay"
        disabled
      />
      <el-select
        v-else
        v-model="newFormInline.dictType"
        class="w-full"
        clearable
        placeholder="请选择字典类型"
      >
        <el-option
          v-for="item in dictTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="字典标签" prop="label">
      <el-input
        v-model="newFormInline.label"
        clearable
        placeholder="请输入字典标签"
        :disabled="isDetail"
      />
    </el-form-item>

    <el-form-item label="字典键值" prop="value">
      <el-input
        v-model="newFormInline.value"
        clearable
        placeholder="请输入字典键值"
        :disabled="isDetail"
      />
    </el-form-item>

    <el-form-item label="排序" prop="sort">
      <el-input-number
        v-model="newFormInline.sort"
        class="w-full"
        :min="1"
        controls-position="right"
        :disabled="isDetail"
      />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-select
        v-model="newFormInline.status"
        class="w-full"
        placeholder="请选择状态"
        :disabled="isDetail"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        placeholder="请输入备注"
        :disabled="isDetail"
      />
    </el-form-item>
  </el-form>
</template>

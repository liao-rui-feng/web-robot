<script setup lang="ts">
import { computed, ref } from "vue";
import { dictTypeRules } from "./utils/typeRule";
import type { DictTypeFormProps } from "./utils/types";

const statusOptions = [
  { label: "启用", value: 1 },
  { label: "停用", value: 0 }
];

const props = withDefaults(defineProps<DictTypeFormProps>(), {
  formInline: () => ({
    dictType: "",
    name: "",
    sort: 1,
    status: 1,
    remark: "",
    builtin: false
  }),
  mode: "add",
  lockDictType: false
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const dictTypeDisabled = computed(() => props.mode === "edit" || props.lockDictType);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="dictTypeRules"
    label-width="110px"
  >
    <el-form-item label="类型编码" prop="dictType">
      <el-input
        v-model="newFormInline.dictType"
        clearable
        placeholder="请输入类型编码（如 robot_type）"
        :disabled="dictTypeDisabled"
      />
    </el-form-item>

    <el-form-item label="类型名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入类型名称"
      />
    </el-form-item>

    <el-form-item label="排序" prop="sort">
      <el-input-number
        v-model="newFormInline.sort"
        class="w-full"
        :min="1"
        controls-position="right"
      />
    </el-form-item>

    <el-form-item label="状态" prop="status">
      <el-select
        v-model="newFormInline.status"
        class="w-full"
        placeholder="请选择状态"
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
      />
    </el-form-item>
  </el-form>
</template>

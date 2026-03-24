<script setup lang="ts">
import { computed, ref } from "vue";
import { formRules } from "./utils/rule";
import type { FormProps } from "./utils/types";

const statusOptions = [
  { label: "待启动", value: "pending" },
  { label: "进行中", value: "in_progress" },
  { label: "已完成", value: "completed" }
];

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    projectName: "",
    projectCode: "",
    projectStatus: "pending",
    owner: "",
    projectStartTime: "",
    robotType: "",
    robotStage: "",
    robotUseTime: "",
    remark: ""
  }),
  mode: "add",
  robotTypeOptions: () => [],
  robotStageOptions: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const isDetail = computed(() => props.mode === "detail");
const isEdit = computed(() => props.mode === "edit");
const isCompleted = computed(
  () => newFormInline.value.projectStatus === "completed"
);

function isFieldDisabled(field: string) {
  if (isDetail.value) return true;
  if (isEdit.value && field === "projectCode") return true;
  if (
    isEdit.value &&
    isCompleted.value &&
    ["robotType", "robotStage", "projectStartTime", "robotUseTime"].includes(
      field
    )
  ) {
    return true;
  }
  return false;
}

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
    label-width="110px"
  >
    <el-form-item label="项目名称" prop="projectName">
      <el-input
        v-model="newFormInline.projectName"
        clearable
        placeholder="请输入项目名称"
        :disabled="isFieldDisabled('projectName')"
      />
    </el-form-item>

    <el-form-item label="项目编号" prop="projectCode">
      <el-input
        v-model="newFormInline.projectCode"
        clearable
        placeholder="请输入项目编号"
        :disabled="isFieldDisabled('projectCode')"
      />
    </el-form-item>

    <el-form-item label="项目状态" prop="projectStatus">
      <el-select
        v-model="newFormInline.projectStatus"
        clearable
        placeholder="请选择项目状态"
        class="w-full"
        :disabled="isFieldDisabled('projectStatus')"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="负责人" prop="owner">
      <el-input
        v-model="newFormInline.owner"
        clearable
        placeholder="请输入负责人"
        :disabled="isFieldDisabled('owner')"
      />
    </el-form-item>

    <el-form-item label="项目开始时间" prop="projectStartTime">
      <el-date-picker
        v-model="newFormInline.projectStartTime"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="请选择项目开始时间"
        class="w-full"
        :disabled="isFieldDisabled('projectStartTime')"
      />
    </el-form-item>

    <el-form-item label="机器人类型" prop="robotType">
      <el-select
        v-model="newFormInline.robotType"
        clearable
        filterable
        placeholder="请选择机器人类型"
        class="w-full"
        :disabled="isFieldDisabled('robotType')"
      >
        <el-option
          v-for="item in props.robotTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="机器人阶段" prop="robotStage">
      <el-select
        v-model="newFormInline.robotStage"
        clearable
        filterable
        placeholder="请选择机器人阶段"
        class="w-full"
        :disabled="isFieldDisabled('robotStage')"
      >
        <el-option
          v-for="item in props.robotStageOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="机器人投用时间">
      <el-date-picker
        v-model="newFormInline.robotUseTime"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="请选择机器人投用时间"
        class="w-full"
        :disabled="isFieldDisabled('robotUseTime')"
      />
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.remark"
        placeholder="请输入备注"
        type="textarea"
        :disabled="isFieldDisabled('remark')"
      />
    </el-form-item>
  </el-form>
</template>

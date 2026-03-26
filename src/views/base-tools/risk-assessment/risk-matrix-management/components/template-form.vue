<script setup lang="ts">
import { ref } from "vue";
import type { FormRules } from "element-plus";
import type { MatrixTemplateCreateForm } from "../utils/types";

const props = withDefaults(
  defineProps<{
    formInline?: MatrixTemplateCreateForm;
  }>(),
  {
    formInline: () => ({
      templateName: "",
      templateCode: "",
      remark: "",
      projectId: "",
      projectCode: "",
      projectName: "",
      source: ""
    })
  }
);

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const formRules: FormRules = {
  templateName: [
    { required: true, message: "请输入模板名称", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "模板名称长度应为 2-50 个字符",
      trigger: "blur"
    }
  ],
  templateCode: [
    { required: true, message: "请输入模板编号", trigger: "blur" },
    {
      min: 2,
      max: 30,
      message: "模板编号长度应为 2-30 个字符",
      trigger: "blur"
    }
  ],
  remark: [{ max: 200, message: "备注最多 200 个字符", trigger: "blur" }]
};

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
    label-width="104px"
  >
    <el-form-item label="模板名称" prop="templateName">
      <el-input
        v-model="newFormInline.templateName"
        clearable
        placeholder="请输入模板名称"
      />
    </el-form-item>
    <el-form-item label="模板编号" prop="templateCode">
      <el-input
        v-model="newFormInline.templateCode"
        clearable
        placeholder="请输入模板编号"
      />
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input
        v-model="newFormInline.remark"
        type="textarea"
        :rows="3"
        placeholder="请输入备注"
      />
    </el-form-item>
  </el-form>
</template>

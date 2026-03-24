import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const formRules = reactive<FormRules>({
  dictType: [{ required: true, message: "字典类型为必选项", trigger: "change" }],
  label: [{ required: true, message: "字典标签为必填项", trigger: "blur" }],
  value: [{ required: true, message: "字典键值为必填项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必选项", trigger: "change" }]
});

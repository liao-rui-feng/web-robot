import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const dictTypeRules = reactive<FormRules>({
  dictType: [
    { required: true, message: "字典类型编码为必填项", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "字典类型编码长度应在 2-50 个字符之间",
      trigger: "blur"
    }
  ],
  name: [{ required: true, message: "字典类型名称为必填项", trigger: "blur" }],
  sort: [{ required: true, message: "排序为必填项", trigger: "blur" }],
  status: [{ required: true, message: "状态为必选项", trigger: "change" }]
});

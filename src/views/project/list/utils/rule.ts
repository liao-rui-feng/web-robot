import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 项目表单校验规则 */
export const formRules = reactive<FormRules>({
  projectName: [
    { required: true, message: "项目名称为必填项", trigger: "blur" }
  ],
  projectCode: [
    { required: true, message: "项目编号为必填项", trigger: "blur" }
  ],
  projectStatus: [
    { required: true, message: "项目状态为必选项", trigger: "change" }
  ],
  owner: [{ required: true, message: "负责人为必填项", trigger: "blur" }],
  projectStartTime: [
    { required: true, message: "项目开始时间为必填项", trigger: "change" }
  ],
  robotType: [
    { required: true, message: "机器人类型为必选项", trigger: "change" }
  ],
  robotStage: [
    { required: true, message: "机器人阶段为必选项", trigger: "change" }
  ]
});

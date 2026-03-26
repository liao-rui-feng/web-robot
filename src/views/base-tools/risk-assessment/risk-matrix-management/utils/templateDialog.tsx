import { h, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { createRiskMatrixTemplate } from "@/api/system";
import { deviceDetection } from "@pureadmin/utils";
import templateForm from "../components/template-form.vue";
import type { MatrixTemplateCreateForm, MatrixTemplateRow } from "./types";

type OpenDialogOptions = {
  title?: string;
  defaultForm?: Partial<MatrixTemplateCreateForm>;
  onSuccess?: (row: MatrixTemplateRow) => void | Promise<void>;
};

const defaultFormInline: MatrixTemplateCreateForm = {
  templateName: "",
  templateCode: "",
  remark: "",
  projectId: "",
  projectCode: "",
  projectName: "",
  source: ""
};

export function openRiskMatrixTemplateDialog(options?: OpenDialogOptions) {
  const formRef = ref();

  addDialog({
    title: options?.title ?? "新增风险矩阵模板",
    props: {
      formInline: {
        ...defaultFormInline,
        ...(options?.defaultForm ?? {})
      } as MatrixTemplateCreateForm
    },
    width: "42%",
    draggable: true,
    fullscreen: deviceDetection(),
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: ({ options: dialogOptions }) =>
      h(templateForm, {
        ref: formRef,
        formInline: dialogOptions.props.formInline
      }),
    beforeSure: async (done, { options: dialogOptions }) => {
      const formInstance = formRef.value?.getRef?.();
      if (!formInstance) return;

      try {
        await formInstance.validate();
      } catch {
        return;
      }

      const payload = dialogOptions.props.formInline as MatrixTemplateCreateForm;
      const { code, message: msg, data } = await createRiskMatrixTemplate(payload);
      if (code !== 0) {
        message(msg || "新增模板失败", { type: "error" });
        return;
      }

      message("新增模板成功", { type: "success" });
      done();

      if (data && options?.onSuccess) {
        await options.onSuccess(data as MatrixTemplateRow);
      }
    }
  });
}

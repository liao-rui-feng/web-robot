<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRiskMatrixManagement } from "./utils/hook";
import { openRiskMatrixTemplateDialog } from "./utils/templateDialog";
import { deleteRiskMatrixTemplate } from "@/api/system";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { message } from "@/utils/message";
import Search from "~icons/ri/search-line";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import Enter from "~icons/ri/login-box-line";
import Delete from "~icons/ep/delete";
import type { MatrixTemplateRow } from "./utils/types";

defineOptions({
  name: "RiskMatrixManagement"
});

const formRef = ref();
const router = useRouter();

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange
} = useRiskMatrixManagement();

function onAddTemplate() {
  openRiskMatrixTemplateDialog({
    onSuccess: async () => {
      pagination.currentPage = 1;
      await onSearch();
    }
  });
}

function onEnter(row: MatrixTemplateRow) {
  router.push({
    path: "/base-tools/risk-assessment/risk-matrix-config",
    query: {
      templateId: String(row.id),
      templateName: row.templateName
    }
  });
}

async function onDelete(row: MatrixTemplateRow) {
  const { code, message: errorMessage } = await deleteRiskMatrixTemplate({
    templateId: row.id
  });

  if (code !== 0) {
    message(errorMessage || "删除模板失败", { type: "error" });
    return;
  }

  message(`已删除模板：${row.templateName}`, { type: "success" });

  if (dataList.value.length === 1 && pagination.currentPage > 1) {
    pagination.currentPage -= 1;
  }
  await onSearch();
}
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :model="form"
      label-width="104px"
      class="search-form bg-bg_color w-full overflow-auto"
    >
      <div class="search-grid">
        <el-form-item label="模板名称：" prop="templateName" class="search-item">
          <el-input
            v-model="form.templateName"
            placeholder="请输入模板名称"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="模板编号：" prop="templateCode" class="search-item">
          <el-input
            v-model="form.templateCode"
            placeholder="请输入模板编号"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item class="search-item search-actions">
          <el-button
            type="primary"
            :icon="useRenderIcon(Search)"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </div>
    </el-form>

    <PureTableBar title="风险矩阵管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button :icon="useRenderIcon(AddFill)" @click="onAddTemplate">
          新增模板
        </el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ size, row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Enter)"
              @click="onEnter(row)"
            >
              进入
            </el-button>
            <el-popconfirm
              :title="`是否确认删除模板 ${row.templateName}？`"
              @confirm="onDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  padding: 12px 16px 8px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px 12px;
  align-items: center;
}

.search-item {
  margin-bottom: 0 !important;
}

.search-input {
  width: 100%;
}

.search-actions {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: flex-start;
  }

  :deep(.el-button + .el-button) {
    margin-left: 12px;
  }
}

@media (max-width: 900px) {
  .search-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRiskAssessmentNodeList } from "./utils/hook";
import { openRiskMatrixTemplateDialog } from "../risk-matrix-management/utils/templateDialog";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "~icons/ri/search-line";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import Grid from "~icons/ri/layout-grid-line";
import Download from "~icons/ri/download-line";
import Upload from "~icons/ri/upload-2-line";
import Back from "~icons/ep/back";
import Enter from "~icons/ri/login-box-line";
import View from "~icons/ep/view";
import Delete from "~icons/ep/delete";
import type { NodeRow } from "./utils/types";

defineOptions({
  name: "RiskAssessmentNodeList"
});

const route = useRoute();
const router = useRouter();
const formRef = ref();

const projectId = computed(() => String(route.query.projectId || ""));
const projectCode = computed(() => String(route.query.projectCode || "-"));
const projectName = computed(() => String(route.query.projectName || "-"));

const {
  form,
  loading,
  matrixTemplateLoading,
  matrixTemplateValue,
  matrixTemplateOptions,
  loadMatrixTemplateOptions,
  setMatrixTemplateValue,
  columns,
  dataList,
  pagination,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange
} = useRiskAssessmentNodeList();

function onMatrixDefine() {
  openRiskMatrixTemplateDialog({
    defaultForm: {
      templateName: projectName.value ? `${projectName.value}风险矩阵` : "",
      projectId: projectId.value,
      projectCode: projectCode.value,
      projectName: projectName.value,
      source: "node-list"
    },
    onSuccess: async row => {
      const templateId = String(row.id);
      await loadMatrixTemplateOptions(templateId);
      setMatrixTemplateValue(templateId);
    }
  });
}

function goBackEvaluationProject() {
  router.push("/base-tools/risk-assessment/evaluation-project");
}

function onEnterAnalysis(row: NodeRow) {
  router.push({
    path: "/base-tools/risk-assessment/analysis-worksheet",
    query: {
      projectId: String(row.projectId),
      projectCode: row.projectCode,
      projectName: row.projectName,
      nodeId: String(row.id),
      nodeName: row.nodeName
    }
  });
}
</script>

<template>
  <div class="main">
    <el-card shadow="never" class="matrix-panel" style="border: none">
      <div class="matrix-toolbar">
        <el-form label-width="104px" class="matrix-template-form">
          <el-form-item label="风险矩阵模板：" class="matrix-template-item">
            <el-select
              v-model="matrixTemplateValue"
              class="search-input"
              placeholder="请选择风险矩阵模板"
              :loading="matrixTemplateLoading"
            >
              <el-option
                v-for="item in matrixTemplateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button
          class="tool-btn"
          type="success"
          :icon="useRenderIcon(Grid)"
          @click="onMatrixDefine"
        >
          矩阵定义
        </el-button>
        <el-button class="tool-btn" :icon="useRenderIcon(Download)">
          下载模板
        </el-button>
        <el-button class="tool-btn" :icon="useRenderIcon(Upload)">
          模板导入
        </el-button>
        <el-button
          class="tool-btn return-btn"
          :icon="useRenderIcon(Back)"
          @click="goBackEvaluationProject"
        >
          返回
        </el-button>
      </div>
    </el-card>
    <div class="section-divider" />

    <el-form
      ref="formRef"
      :model="form"
      label-width="104px"
      class="search-form bg-bg_color w-full overflow-auto"
    >
      <div class="search-grid">
        <el-form-item label="节点名称：" prop="nodeName" class="search-item">
          <el-input
            v-model="form.nodeName"
            placeholder="请输入节点名称"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="分析人员：" prop="analyst" class="search-item">
          <el-input
            v-model="form.analyst"
            placeholder="请输入分析人员"
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

    <PureTableBar :columns="columns" @refresh="onSearch">
      <template #title>
        <div class="table-title-wrap">
          <span class="table-title-text">节点列表</span>
          <div class="title-project-info">
            <div class="info-chip">
              <span class="chip-label">项目编号</span>
              <span class="chip-value">{{ projectCode }}</span>
            </div>
            <div class="info-chip">
              <span class="chip-label">项目名称</span>
              <span class="chip-value">{{ projectName }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #buttons>
        <el-button :icon="useRenderIcon(AddFill)">新增节点</el-button>
      </template>
      <template #default="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
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
              :icon="useRenderIcon(View)"
            >
              查看
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Enter)"
              @click="onEnterAnalysis(row)"
            >
              进入
            </el-button>
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
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 24px 24px 0 !important;
}

.main {
  --top-row-height: 72px;
}

:deep(.matrix-panel) {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

:deep(.el-card__body) {
  padding: 0 45px;
}

.matrix-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px 12px;
  flex-wrap: wrap;
  min-height: var(--top-row-height);
}

.matrix-template-form {
  flex: 0 0 auto;

  :deep(.el-form-item) {
    margin-bottom: 0 !important;
  }
}

.matrix-template-item {
  :deep(.el-form-item__label) {
    white-space: nowrap;
  }

  :deep(.el-form-item__content) {
    width: 220px;
    min-width: 220px;
  }
}

.section-divider {
  height: 1px;
  margin: 0 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.table-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  min-height: 32px;
}

.table-title-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  line-height: 1;
}

.title-project-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
}

.chip-label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  font-weight: 600;
}

.chip-value {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.tool-btn {
  min-width: 118px;
}

.return-btn {
  margin-left: auto;
}

.search-form {
  margin-top: 0;
  padding: 0 16px;
  min-height: var(--top-row-height);
  display: flex;
  align-items: center;
}

.search-grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 8px 12px;
  align-items: center;
}

.search-item {
  margin-bottom: 0 !important;
  flex: 0 0 auto;
}

.search-item:not(.search-actions) {
  :deep(.el-form-item__content) {
    width: 220px;
  }
}

.search-input {
  width: 220px;
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
  .main {
    --top-row-height: auto;
  }

  :deep(.el-card__body) {
    padding: 10px 14px;
  }

  .matrix-template-form {
    width: 100%;
  }

  .matrix-template-item {
    :deep(.el-form-item__content) {
      width: 100%;
    }
  }

  .section-divider {
    margin: 0 10px;
  }

  .search-form {
    padding: 10px 12px 8px;
    min-height: auto;
    display: block;
  }

  .return-btn {
    margin-left: 0;
  }

  .search-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px 12px;
  }

  .search-input {
    width: 100%;
  }

  .table-title-wrap {
    align-items: flex-start;
  }
}
</style>

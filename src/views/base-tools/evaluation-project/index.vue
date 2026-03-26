<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvaluationProject } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import Enter from "~icons/ri/login-box-line";
import type { EvaluationProjectRow } from "./utils/types";

defineOptions({
  name: "BaseToolsEvaluationProject"
});

const route = useRoute();
const router = useRouter();
const moduleTitle = computed(
  () => (route.meta?.moduleTitle as string | undefined) || "评估项目"
);
const tableTitle = computed(() => `${moduleTitle.value} - 评估项目`);
const isRiskAssessment = computed(
  () => route.meta?.moduleKey === "riskAssessment"
);

function onEnter(row: EvaluationProjectRow) {
  if (!isRiskAssessment.value) return;
  router.push({
    path: "/base-tools/risk-assessment/node-list",
    query: {
      projectId: String(row.id),
      projectCode: row.projectCode,
      projectName: row.projectName
    }
  });
}

const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  robotTypeOptions,
  robotStageOptions,
  onSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange
} = useEvaluationProject();
</script>

<template>
  <div class="main">
    <el-form
      :model="form"
      label-width="104px"
      class="search-form bg-bg_color w-full overflow-auto"
      @submit.prevent
    >
      <div class="search-grid">
        <el-form-item label="项目名称：" prop="projectName" class="search-item">
          <el-input
            v-model="form.projectName"
            placeholder="请输入项目名称"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="项目编号：" prop="projectCode" class="search-item">
          <el-input
            v-model="form.projectCode"
            placeholder="请输入项目编号"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="项目状态：" prop="projectStatus" class="search-item">
          <el-select
            v-model="form.projectStatus"
            clearable
            placeholder="请选择项目状态"
            class="search-input"
          >
            <el-option label="待启动" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人：" prop="owner" class="search-item">
          <el-input
            v-model="form.owner"
            placeholder="请输入负责人"
            clearable
            class="search-input"
          />
        </el-form-item>
        <el-form-item label="机器人类型：" prop="robotType" class="search-item">
          <el-select
            v-model="form.robotType"
            clearable
            filterable
            placeholder="请选择机器人类型"
            class="search-input"
          >
            <el-option
              v-for="item in robotTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机器人阶段：" prop="robotStage" class="search-item">
          <el-select
            v-model="form.robotStage"
            clearable
            filterable
            placeholder="请选择机器人阶段"
            class="search-input"
          >
            <el-option
              v-for="item in robotStageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="search-item search-actions">
          <el-button
            type="primary"
            :icon="useRenderIcon('ri/search-line')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm">
            重置
          </el-button>
        </el-form-item>
      </div>
    </el-form>

    <PureTableBar
      :title="tableTitle"
      :columns="columns"
      @refresh="onSearch"
    >
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

  .search-actions {
    :deep(.el-form-item__content) {
      justify-content: flex-start;
    }
  }
}
</style>

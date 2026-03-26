<script setup lang="ts">
import { ref } from "vue";
import { useRiskAssessmentReport } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Search from "~icons/ri/search-line";
import Refresh from "~icons/ep/refresh";
import Download from "~icons/ri/download-line";

defineOptions({
  name: "RiskAssessmentReportManagement"
});

const formRef = ref();

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
} = useRiskAssessmentReport();
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
        <el-form-item label="装置名称：" prop="unitName" class="search-item">
          <el-input
            v-model="form.unitName"
            placeholder="请输入装置名称"
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

    <PureTableBar title="报表管理" :columns="columns" @refresh="onSearch">
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
          <template #operation="{ size }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Download)"
            >
              报表下载
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
}
</style>

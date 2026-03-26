<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useRiskMatrixConfig } from "./utils/hook";
import Refresh from "~icons/ep/refresh";
import Save from "~icons/ri/save-line";
import Back from "~icons/ep/back";

defineOptions({
  name: "RiskMatrixConfig"
});

const { loading, saving, config, onSave, onReset } = useRiskMatrixConfig();
const router = useRouter();

const pageTitle = computed(
  () => `风险矩阵定义【${config.value.templateName || "未命名模板"}】`
);

function onBackToMatrixManagement() {
  router.push("/base-tools/risk-assessment/risk-matrix-management");
}
</script>

<template>
  <div class="main">
    <el-card shadow="never" class="matrix-card">
      <div class="header">
        <div class="title-wrap">
          <h3 class="title">{{ pageTitle }}</h3>
          <p class="sub-title">
            模板编号：{{ config.templateCode || "-" }}
            <span v-if="config.remark">｜备注：{{ config.remark }}</span>
          </p>
        </div>
        <div class="actions">
          <el-button :icon="useRenderIcon(Back)" @click="onBackToMatrixManagement">
            返回模板管理
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="onReset">
            重置
          </el-button>
          <el-button
            type="primary"
            :loading="saving"
            :icon="useRenderIcon(Save)"
            @click="onSave"
          >
            保存
          </el-button>
        </div>
      </div>

      <div class="matrix-table-wrap" v-loading="loading">
        <table class="matrix-table">
          <thead>
            <tr>
              <th colspan="5">事故后果严重程度等级</th>
              <th colspan="5">事故发生频率等级</th>
            </tr>
            <tr>
              <th>等级</th>
              <th>人员后果</th>
              <th>环境破坏</th>
              <th>财产损失</th>
              <th>声誉影响</th>
              <th
                v-for="column in config.frequencyColumns"
                :key="column.key"
                class="frequency-header"
              >
                <div class="frequency-level">{{ column.level }}</div>
                <div class="frequency-desc">{{ column.description }}</div>
                <div class="frequency-range">{{ column.rangeDesc }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in config.rows" :key="`${row.level}-${rowIndex}`">
              <td>
                <el-input v-model="row.level" />
              </td>
              <td>
                <el-input v-model="row.personnelConsequence" />
              </td>
              <td>
                <el-input v-model="row.environmentDamage" />
              </td>
              <td>
                <el-input v-model="row.propertyLoss" />
              </td>
              <td>
                <el-input v-model="row.reputationImpact" />
              </td>
              <td v-for="column in config.frequencyColumns" :key="column.key">
                <el-input v-model="row[column.key]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 24px 24px 0 !important;
}

.matrix-card {
  border: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.sub-title {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.matrix-table-wrap {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  overflow: hidden;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.matrix-table th,
.matrix-table td {
  border: 1px solid var(--el-border-color);
  padding: 8px;
  vertical-align: middle;
  background: #fff;
}

.matrix-table thead th {
  background: var(--el-color-primary);
  color: #fff;
  text-align: center;
  font-weight: 600;
}

.matrix-table td {
  padding: 6px;
}

.frequency-header {
  font-size: 12px;
  line-height: 1.35;
}

.frequency-level {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.frequency-desc,
.frequency-range {
  white-space: normal;
}

@media (max-width: 1200px) {
  .matrix-table-wrap {
    overflow-x: auto;
  }

  .matrix-table {
    min-width: 1180px;
  }
}
</style>

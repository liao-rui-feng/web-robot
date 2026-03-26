<script setup lang="ts">
import { useRiskAssessmentWorksheet } from "./utils/hook";

defineOptions({
  name: "RiskAssessmentAnalysisWorksheet"
});

const { loading, dataList, isExpanded, toggleExpand, onReset, onBack } =
  useRiskAssessmentWorksheet();
</script>

<template>
  <div class="main">
    <el-card shadow="never" class="worksheet-card">
      <div class="worksheet-toolbar">
        <div class="worksheet-title">风险分析工作表</div>
        <el-button link type="primary" @click="toggleExpand">
          {{ isExpanded ? "收起" : "展开" }}
        </el-button>
      </div>

      <div class="table-wrap" :class="{ expanded: isExpanded }" v-loading="loading">
        <el-table
          :data="dataList"
          border
          row-key="id"
          table-layout="fixed"
          style="width: 100%"
        >
          <el-table-column label="序号" width="80" align="center" fixed="left">
            <template #default="{ $index }">
              {{ `1.${$index + 1}.1` }}
            </template>
          </el-table-column>
          <el-table-column label="参数" prop="parameter" show-overflow-tooltip />
          <el-table-column label="偏离" prop="deviation" show-overflow-tooltip />
          <el-table-column label="原因" prop="cause" show-overflow-tooltip />
          <el-table-column label="后果" prop="consequence" show-overflow-tooltip />
          <el-table-column label="原始风险" align="center">
            <el-table-column
              label="可能性"
              prop="rawLikelihood"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="后果等级"
              prop="rawConsequenceLevel"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="风险等级"
              prop="rawRiskLevel"
              align="center"
              show-overflow-tooltip
            />
          </el-table-column>
          <el-table-column
            label="当前保护措施及修正因子"
            prop="currentProtection"
            show-overflow-tooltip
          />
          <el-table-column label="残余风险一" align="center">
            <el-table-column
              label="可能性"
              prop="residualOneLikelihood"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="后果等级"
              prop="residualOneConsequenceLevel"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="风险等级"
              prop="residualOneRiskLevel"
              align="center"
              show-overflow-tooltip
            />
          </el-table-column>
          <el-table-column
            label="建议新增保护措施"
            prop="suggestedProtection"
            show-overflow-tooltip
          />
          <el-table-column label="残余风险二" align="center">
            <el-table-column
              label="可能性"
              prop="residualTwoLikelihood"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="后果等级"
              prop="residualTwoConsequenceLevel"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="风险等级"
              prop="residualTwoRiskLevel"
              align="center"
              show-overflow-tooltip
            />
          </el-table-column>
          <el-table-column label="备注" prop="remark" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.remark || "-" }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="footer-actions">
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onBack">返回节点列表</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 24px 24px 0 !important;
}

.worksheet-card {
  border: none;
  min-height: calc(100vh - 210px);
}

:deep(.worksheet-card .el-card__body) {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 230px);
}

.worksheet-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.worksheet-title {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 600;
}

.table-wrap {
  min-height: 520px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  background: #fff;
}

.table-wrap.expanded {
  overflow: visible;
}

:deep(.table-wrap .el-table__body-wrapper),
:deep(.table-wrap .el-table__fixed-body-wrapper),
:deep(.table-wrap .el-scrollbar__wrap) {
  overflow-y: hidden !important;
}

:deep(.table-wrap .el-scrollbar__bar.is-vertical) {
  display: none !important;
}

.footer-actions {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

@media (max-width: 900px) {
  .worksheet-card {
    min-height: auto;
  }

  :deep(.worksheet-card .el-card__body) {
    min-height: auto;
  }

  .table-wrap {
    min-height: 360px;
    overflow: hidden;
  }
}

.footer-actions .el-button + .el-button {
  margin-left: 12px;
}
</style>

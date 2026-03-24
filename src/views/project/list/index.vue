<script setup lang="ts">
import { useProject } from "./utils/hook";
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import View from "~icons/ep/view";

defineOptions({
  name: "ProjectList"
});

const statusOptions = [
  { label: "待启动", value: "pending" },
  { label: "进行中", value: "in_progress" },
  { label: "已完成", value: "completed" }
];

const formRef = ref();
const tableRef = ref();

const {
  form,
  loading,
  selectedNum,
  columns,
  dataList,
  pagination,
  robotTypeOptions,
  robotStageOptions,
  onSearch,
  resetForm,
  openDialog,
  onBatchDel,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  onSelectionCancel,
  statusLabelMap
} = useProject(tableRef);
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
    >
      <el-form-item label="项目名称：" prop="projectName">
        <el-input
          v-model="form.projectName"
          placeholder="请输入项目名称"
          clearable
          class="w-45!"
        />
      </el-form-item>
      <el-form-item label="项目编号：" prop="projectCode">
        <el-input
          v-model="form.projectCode"
          placeholder="请输入项目编号"
          clearable
          class="w-45!"
        />
      </el-form-item>
      <el-form-item label="项目状态：" prop="projectStatus">
        <el-select
          v-model="form.projectStatus"
          clearable
          placeholder="请选择项目状态"
          class="w-45!"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人：" prop="owner">
        <el-input
          v-model="form.owner"
          placeholder="请输入负责人"
          clearable
          class="w-45!"
        />
      </el-form-item>
      <el-form-item label="机器人类型：" prop="robotType">
        <el-select
          v-model="form.robotType"
          clearable
          filterable
          placeholder="请选择机器人类型"
          class="w-45!"
        >
          <el-option
            v-for="item in robotTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="机器人阶段：" prop="robotStage">
        <el-select
          v-model="form.robotStage"
          clearable
          filterable
          placeholder="请选择机器人阶段"
          class="w-45!"
        >
          <el-option
            v-for="item in robotStageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri/search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      title="项目列表"
      :columns="columns"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDialog()">
          新增项目
        </el-button>
      </template>

      <template #default="{ size, dynamicColumns }">
        <div
          v-if="selectedNum > 0"
          v-motion-fade
          class="bg-(--el-fill-color-light) w-full h-11.5 mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectedNum }} 项
            </span>
            <el-button type="primary" text @click="onSelectionCancel">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认删除?" @confirm="onBatchDel">
            <template #reference>
              <el-button type="danger" text class="mr-1!">
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
        </div>
        <pure-table
          ref="tableRef"
          row-key="id"
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
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(View)"
              @click="openDialog('detail', row)"
            >
              详情
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="openDialog('edit', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              :title="`是否确认删除项目编号为 ${row.projectCode} 的这条数据`"
              @confirm="handleDelete(row)"
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

          <template #projectStatus="{ row }">
            {{ statusLabelMap[row.projectStatus] }}
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
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

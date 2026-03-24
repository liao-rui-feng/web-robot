<script setup lang="ts">
import { ref } from "vue";
import { useDict } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "~icons/ep/refresh";
import AddFill from "~icons/ri/add-circle-line";
import EditPen from "~icons/ep/edit-pen";
import Delete from "~icons/ep/delete";
import View from "~icons/ep/view";

defineOptions({
  name: "SystemDict"
});

const statusOptions = [
  { label: "启用", value: 1 },
  { label: "停用", value: 0 }
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
  dictTypeCards,
  activeDictType,
  activeDictTypeLabel,
  activeDictTypeInfo,
  onSearch,
  resetForm,
  openDialog,
  onBatchDel,
  openTypeDialog,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  onSelectionCancel,
  handleTypeClick,
  toggleCurrentTypeStatus,
  deleteCurrentType
} = useDict(tableRef);
</script>

<template>
  <div class="main">
    <div class="dict-layout">
      <el-card shadow="never" class="dict-type-panel">
        <template #header>
          <div class="dict-type-panel__header">
            <span>字典目录</span>
            <div class="dict-type-actions">
              <el-button
                class="dict-type-actions__btn"
                size="small"
                type="primary"
                :icon="useRenderIcon(AddFill)"
                @click="openTypeDialog('add')"
              >
                新增类型
              </el-button>
              <el-button
                class="dict-type-actions__btn"
                size="small"
                :disabled="!activeDictTypeInfo"
                @click="openTypeDialog('edit')"
              >
                编辑类型
              </el-button>
              <el-button
                class="dict-type-actions__btn"
                size="small"
                :disabled="!activeDictTypeInfo"
                :type="activeDictTypeInfo?.status === 1 ? 'warning' : 'success'"
                @click="toggleCurrentTypeStatus"
              >
                {{ activeDictTypeInfo?.status === 1 ? "停用" : "启用" }}
              </el-button>
              <el-popconfirm
                title="删除字典类型将同步删除其下所有字典项，是否继续？"
                @confirm="deleteCurrentType"
              >
                <template #reference>
                  <el-button
                    class="dict-type-actions__btn"
                    size="small"
                    type="danger"
                    plain
                    :disabled="!activeDictTypeInfo || activeDictTypeInfo?.builtin"
                  >
                    删除类型
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>

        <el-scrollbar class="dict-type-panel__scroll">
          <div class="dict-type-list">
            <div
              v-for="item in dictTypeCards"
              :key="item.dictType"
              :class="[
                'dict-type-card',
                activeDictType === item.dictType ? 'dict-type-card--active' : ''
              ]"
              @click="handleTypeClick(item)"
            >
              <div class="dict-type-card__title">{{ item.name }}</div>
              <div class="dict-type-card__code">{{ item.dictType }}</div>
              <div class="dict-type-card__meta">
                <el-tag size="small" :type="item.status === 1 ? 'success' : 'info'">
                  {{ item.status === 1 ? "启用" : "停用" }}
                </el-tag>
                <el-tag v-if="item.builtin" size="small" type="warning">内置</el-tag>
                <el-tag size="small" type="info">{{ item.count }} 项</el-tag>
              </div>
            </div>
            <el-empty
              v-if="!dictTypeCards.length"
              description="暂无字典类型"
              :image-size="90"
            />
          </div>
        </el-scrollbar>
      </el-card>

      <div class="dict-content">
        <el-form
          ref="formRef"
          :inline="true"
          :model="form"
          class="search-form bg-bg_color w-full pl-8 pt-3 overflow-auto"
        >
          <el-form-item label="当前字典：">
            <el-tag type="primary">{{ activeDictTypeLabel || "-" }}</el-tag>
            <span class="dict-code">{{ activeDictType || "-" }}</span>
          </el-form-item>
          <el-form-item label="字典标签：" prop="label">
            <el-input
              v-model="form.label"
              clearable
              placeholder="请输入字典标签"
              class="w-45!"
            />
          </el-form-item>
          <el-form-item label="字典键值：" prop="value">
            <el-input
              v-model="form.value"
              clearable
              placeholder="请输入字典键值"
              class="w-45!"
            />
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="form.status"
              clearable
              placeholder="请选择状态"
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
          :title="`${activeDictTypeLabel || '当前'}字典项`"
          :columns="columns"
          @refresh="onSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="openDialog()"
            >
              新增字典项
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
                  :title="`是否确认删除字典项 ${row.label}（${row.value}）`"
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
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dict-layout {
  display: flex;
  gap: 12px;
}

.dict-type-panel {
  width: 360px;
  flex-shrink: 0;
}

.dict-type-panel__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
}

.dict-type-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.dict-type-actions__btn {
  width: 100%;
  margin-left: 0 !important;
}

.dict-type-panel__scroll {
  max-height: calc(100vh - 286px);
}

.dict-type-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dict-type-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dict-type-card:hover {
  border-color: var(--el-color-primary-light-5);
}

.dict-type-card--active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.dict-type-card__title {
  font-weight: 600;
  margin-bottom: 4px;
}

.dict-type-card__code {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-bottom: 8px;
}

.dict-type-card__meta {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.dict-content {
  min-width: 0;
  flex: 1;
}

.dict-code {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

@media (max-width: 1200px) {
  .dict-layout {
    flex-direction: column;
  }

  .dict-type-panel {
    width: 100%;
  }

  .dict-type-actions {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .dict-type-panel__scroll {
    max-height: none;
  }
}
</style>

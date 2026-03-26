import { defineFakeRoute } from "vite-plugin-fake-server/client";

type DictTypeRecord = {
  id: number;
  dictType: string;
  name: string;
  sort: number;
  status: 0 | 1;
  remark?: string;
  builtin?: boolean;
  createTime: number;
};

type DictItemRecord = {
  id: number;
  dictType: string;
  label: string;
  value: string;
  sort: number;
  status: 0 | 1;
  isDefault?: boolean;
  colorTag?: string;
  remark?: string;
  createTime: number;
};

const seedTime = 1761264000000;

let dictTypeData: DictTypeRecord[] = [
  {
    id: 1,
    dictType: "robot_type",
    name: "机器人类型",
    sort: 1,
    status: 1,
    remark: "内置字典类型",
    builtin: true,
    createTime: seedTime
  },
  {
    id: 2,
    dictType: "robot_stage",
    name: "机器人阶段",
    sort: 2,
    status: 1,
    remark: "内置字典类型",
    builtin: true,
    createTime: seedTime
  }
];

let dictItemData: DictItemRecord[] = [
  {
    id: 1,
    dictType: "robot_type",
    label: "多关节工业机器人",
    value: "multi_joint_industrial",
    sort: 1,
    status: 1,
    isDefault: true,
    colorTag: "#409EFF",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 2,
    dictType: "robot_type",
    label: "协作机器人",
    value: "collaborative",
    sort: 2,
    status: 1,
    colorTag: "#67C23A",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 3,
    dictType: "robot_type",
    label: "物流机器人",
    value: "logistics",
    sort: 3,
    status: 1,
    colorTag: "#E6A23C",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 4,
    dictType: "robot_type",
    label: "复合机器人",
    value: "composite",
    sort: 4,
    status: 1,
    colorTag: "#909399",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 5,
    dictType: "robot_stage",
    label: "研发阶段",
    value: "research",
    sort: 1,
    status: 1,
    isDefault: true,
    colorTag: "#409EFF",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 6,
    dictType: "robot_stage",
    label: "使用阶段",
    value: "use",
    sort: 2,
    status: 1,
    colorTag: "#67C23A",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 7,
    dictType: "robot_stage",
    label: "维护阶段",
    value: "maintenance",
    sort: 3,
    status: 1,
    colorTag: "#E6A23C",
    remark: "内置字典",
    createTime: seedTime
  },
  {
    id: 8,
    dictType: "robot_stage",
    label: "报废阶段",
    value: "scrap_terminal",
    sort: 4,
    status: 1,
    colorTag: "#F56C6C",
    remark: "内置字典",
    createTime: seedTime
  }
];

let dictTypeIdSeed = Math.max(...dictTypeData.map(item => item.id));
let dictItemIdSeed = Math.max(...dictItemData.map(item => item.id));

const nextTypeId = () => ++dictTypeIdSeed;
const nextItemId = () => ++dictItemIdSeed;

const typeSorter = (a: DictTypeRecord, b: DictTypeRecord) => a.sort - b.sort || a.id - b.id;
const itemSorter = (a: DictItemRecord, b: DictItemRecord) => a.sort - b.sort || a.id - b.id;

function normalizeStatus(status: any): 0 | 1 | undefined {
  if (status === "" || status === null || status === undefined) return undefined;
  return Number(status) === 0 ? 0 : 1;
}

function paginate<T>(list: T[], body: any) {
  const currentPage = Number(body?.currentPage) > 0 ? Number(body.currentPage) : 1;
  const pageSize = Number(body?.pageSize) > 0 ? Number(body.pageSize) : 10;
  const start = (currentPage - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    pageSize,
    currentPage
  };
}

function withTypeName(item: DictItemRecord) {
  const type = dictTypeData.find(typeItem => typeItem.dictType === item.dictType);
  return {
    ...item,
    dictTypeName: type?.name ?? item.dictType
  };
}

function buildDictOptions(dictType: string) {
  const enabledType = dictTypeData.find(item => item.dictType === dictType && item.status === 1);
  if (!enabledType) return [];

  return [...dictItemData]
    .filter(item => item.dictType === dictType && item.status === 1)
    .sort(itemSorter)
    .map(item => ({
      label: item.label,
      value: item.value,
      isDefault: item.isDefault ?? false,
      colorTag: item.colorTag ?? ""
    }));
}

export default defineFakeRoute([
  {
    url: "/dict-type-list",
    method: "post",
    response: ({ body }) => {
      let list = [...dictTypeData];
      list = list.filter(item => item.dictType.includes(body?.dictType ?? ""));
      list = list.filter(item => item.name.includes(body?.name ?? ""));

      const status = normalizeStatus(body?.status);
      if (status !== undefined) {
        list = list.filter(item => item.status === status);
      }

      list.sort(typeSorter);

      return {
        code: 0,
        message: "success",
        data: paginate(list, body)
      };
    }
  },
  {
    url: "/dict-type-save",
    method: "post",
    response: ({ body }) => {
      const dictType = String(body?.dictType ?? "").trim();
      const name = String(body?.name ?? "").trim();
      const sort = Number(body?.sort) > 0 ? Number(body.sort) : 1;
      const status = normalizeStatus(body?.status) ?? 1;
      const remark = String(body?.remark ?? "");

      if (!dictType) {
        return { code: 1, message: "字典类型编码不能为空" };
      }
      if (!name) {
        return { code: 1, message: "字典类型名称不能为空" };
      }

      const id = Number(body?.id);
      if (id) {
        const target = dictTypeData.find(item => item.id === id);
        if (!target) {
          return { code: 1, message: "字典类型不存在" };
        }

        if (target.builtin && dictType !== target.dictType) {
          return { code: 1, message: "内置字典类型编码不可修改" };
        }

        const duplicate = dictTypeData.find(
          item => item.dictType === dictType && item.id !== target.id
        );
        if (duplicate) {
          return { code: 1, message: "字典类型编码已存在" };
        }

        const oldDictType = target.dictType;
        target.dictType = dictType;
        target.name = name;
        target.sort = sort;
        target.status = status;
        target.remark = remark;

        if (oldDictType !== dictType) {
          dictItemData = dictItemData.map(item =>
            item.dictType === oldDictType ? { ...item, dictType } : item
          );
        }

        return {
          code: 0,
          message: "success",
          data: target
        };
      }

      const duplicate = dictTypeData.find(item => item.dictType === dictType);
      if (duplicate) {
        return { code: 1, message: "字典类型编码已存在" };
      }

      const newType: DictTypeRecord = {
        id: nextTypeId(),
        dictType,
        name,
        sort,
        status,
        remark,
        builtin: false,
        createTime: Date.now()
      };

      dictTypeData.push(newType);

      return {
        code: 0,
        message: "success",
        data: newType
      };
    }
  },
  {
    url: "/dict-type-toggle",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const status = normalizeStatus(body?.status);
      const target = dictTypeData.find(item => item.id === id);

      if (!target) {
        return { code: 1, message: "字典类型不存在" };
      }
      if (status === undefined) {
        return { code: 1, message: "状态参数缺失" };
      }

      target.status = status;

      return {
        code: 0,
        message: "success"
      };
    }
  },
  {
    url: "/dict-type-delete",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const idx = dictTypeData.findIndex(item => item.id === id);
      if (idx < 0) {
        return { code: 1, message: "字典类型不存在" };
      }

      const target = dictTypeData[idx];
      if (target.builtin) {
        return { code: 1, message: "内置字典类型不允许删除" };
      }

      dictTypeData.splice(idx, 1);
      dictItemData = dictItemData.filter(item => item.dictType !== target.dictType);

      return {
        code: 0,
        message: "success"
      };
    }
  },
  {
    url: "/dict-list",
    method: "post",
    response: ({ body }) => {
      let list = [...dictItemData];

      list = list.filter(item => item.dictType.includes(body?.dictType ?? ""));
      list = list.filter(item => item.label.includes(body?.label ?? ""));
      list = list.filter(item => item.value.includes(body?.value ?? ""));

      const status = normalizeStatus(body?.status);
      if (status !== undefined) {
        list = list.filter(item => item.status === status);
      }

      list.sort(itemSorter);

      const normalized = list.map(item => withTypeName(item));

      return {
        code: 0,
        message: "success",
        data: paginate(normalized, body)
      };
    }
  },
  {
    url: "/dict-save",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const dictType = String(body?.dictType ?? "").trim();
      const label = String(body?.label ?? "").trim();
      const value = String(body?.value ?? "").trim();
      const sort = Number(body?.sort) > 0 ? Number(body.sort) : 1;
      const status = normalizeStatus(body?.status) ?? 1;
      const isDefault = status === 0 ? false : Boolean(body?.isDefault);
      const colorTag = String(body?.colorTag ?? "").trim();
      const remark = String(body?.remark ?? "");

      if (!dictType) {
        return { code: 1, message: "字典类型不能为空" };
      }
      if (!dictTypeData.find(item => item.dictType === dictType)) {
        return { code: 1, message: "字典类型不存在" };
      }
      if (!label) {
        return { code: 1, message: "字典标签不能为空" };
      }
      if (!value) {
        return { code: 1, message: "字典键值不能为空" };
      }

      const duplicate = dictItemData.find(
        item => item.dictType === dictType && item.value === value && item.id !== id
      );
      if (duplicate) {
        return { code: 1, message: "同一字典类型下键值已存在" };
      }

      if (id) {
        const target = dictItemData.find(item => item.id === id);
        if (!target) {
          return { code: 1, message: "字典项不存在" };
        }

        target.dictType = dictType;
        target.label = label;
        target.value = value;
        target.sort = sort;
        target.status = status;
        target.isDefault = isDefault;
        target.colorTag = colorTag;
        target.remark = remark;

        if (target.isDefault) {
          dictItemData = dictItemData.map(item =>
            item.dictType === target.dictType && item.id !== target.id
              ? { ...item, isDefault: false }
              : item
          );
        }

        return {
          code: 0,
          message: "success",
          data: withTypeName(target)
        };
      }

      const newItem: DictItemRecord = {
        id: nextItemId(),
        dictType,
        label,
        value,
        sort,
        status,
        isDefault,
        colorTag,
        remark,
        createTime: Date.now()
      };
      dictItemData.push(newItem);

      if (newItem.isDefault) {
        dictItemData = dictItemData.map(item =>
          item.dictType === newItem.dictType && item.id !== newItem.id
            ? { ...item, isDefault: false }
            : item
        );
      }

      return {
        code: 0,
        message: "success",
        data: withTypeName(newItem)
      };
    }
  },
  {
    url: "/dict-delete",
    method: "post",
    response: ({ body }) => {
      const id = Number(body?.id);
      const idx = dictItemData.findIndex(item => item.id === id);
      if (idx < 0) {
        return { code: 1, message: "字典项不存在" };
      }

      dictItemData.splice(idx, 1);

      return {
        code: 0,
        message: "success"
      };
    }
  },
  {
    url: "/dict-options",
    method: "post",
    response: ({ body }) => {
      const requested = Array.isArray(body?.dictTypes)
        ? body.dictTypes
            .map(item => String(item ?? "").trim())
            .filter(Boolean)
        : [];
      const enabledTypes = [...dictTypeData]
        .filter(item => item.status === 1)
        .sort(typeSorter)
        .map(item => item.dictType);
      const targetTypes = requested.length ? requested : enabledTypes;

      const result = Object.fromEntries(
        targetTypes.map(dictType => [dictType, buildDictOptions(dictType)])
      );

      return {
        code: 0,
        message: "success",
        data: result
      };
    }
  }
]);

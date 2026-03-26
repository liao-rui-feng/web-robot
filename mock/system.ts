import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { faker } from "@faker-js/faker/locale/zh_CN";

const paginateList = (list: any[], body: any) => {
  const currentPage = Number(body?.currentPage) > 0 ? Number(body.currentPage) : 1;
  const pageSize = Number(body?.pageSize) > 0 ? Number(body.pageSize) : 10;
  const start = (currentPage - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    pageSize,
    currentPage
  };
};

const riskAssessmentNodeSeed = [
  {
    id: 101,
    projectId: 1,
    projectCode: "PRJ-2026-001",
    projectName: "焊接单元功能安全评估",
    nodeName: "焊接工位A",
    analyst: "张三",
    designIntent: "保持焊接电流与送丝速度稳定",
    mainInterlockControlPoint: "门禁联锁 + 急停继电器",
    mainEquipmentParams: "电流220A / 送丝4.2m/min",
    referenceDrawing: "DRW-RA-001",
    analysisTime: "2026-03-08",
    remark: "首批HAZOP分析节点"
  },
  {
    id: 102,
    projectId: 1,
    projectCode: "PRJ-2026-001",
    projectName: "焊接单元功能安全评估",
    nodeName: "转运单元",
    analyst: "李四",
    designIntent: "托盘安全转运与停止",
    mainInterlockControlPoint: "安全PLC双通道",
    mainEquipmentParams: "速度0.6m/s / 载荷40kg",
    referenceDrawing: "DRW-RA-002",
    analysisTime: "2026-03-10",
    remark: ""
  },
  {
    id: 201,
    projectId: 2,
    projectCode: "PRJ-2026-002",
    projectName: "搬运单元安全改造评估",
    nodeName: "机械臂本体",
    analyst: "王五",
    designIntent: "保证抓取放置轨迹精确",
    mainInterlockControlPoint: "扭矩限制 + 区域监控",
    mainEquipmentParams: "臂展1.8m / 负载12kg",
    referenceDrawing: "DRW-RA-010",
    analysisTime: "2026-02-22",
    remark: "需补充SIL验证"
  }
];

const riskAssessmentWorksheetSeed = [
  {
    id: 1001,
    projectId: 1,
    nodeId: 101,
    parameter: "焊接电流",
    deviation: "流量高",
    cause: "人员误操作",
    consequence: "—",
    rawLikelihood: "L3",
    rawConsequenceLevel: "C3",
    rawRiskLevel: "R9",
    currentProtection: "—",
    residualOneLikelihood: "L2",
    residualOneConsequenceLevel: "C3",
    residualOneRiskLevel: "R6",
    suggestedProtection: "—",
    residualTwoLikelihood: "L1",
    residualTwoConsequenceLevel: "C3",
    residualTwoRiskLevel: "R3",
    remark: ""
  },
  {
    id: 1002,
    projectId: 1,
    nodeId: 101,
    parameter: "焊接电流",
    deviation: "压力高",
    cause: "人员误操作",
    consequence: "—",
    rawLikelihood: "L2",
    rawConsequenceLevel: "C2",
    rawRiskLevel: "R4",
    currentProtection: "报警及响应1203E设备缺损",
    residualOneLikelihood: "L2",
    residualOneConsequenceLevel: "C1",
    residualOneRiskLevel: "R2",
    suggestedProtection: "—",
    residualTwoLikelihood: "L1",
    residualTwoConsequenceLevel: "C1",
    residualTwoRiskLevel: "R1",
    remark: ""
  },
  {
    id: 2001,
    projectId: 2,
    nodeId: 201,
    parameter: "运行速度",
    deviation: "偏高",
    cause: "参数配置错误",
    consequence: "协作区域碰撞风险增加",
    rawLikelihood: "L3",
    rawConsequenceLevel: "C4",
    rawRiskLevel: "R12",
    currentProtection: "区域扫描 + 限位开关",
    residualOneLikelihood: "L2",
    residualOneConsequenceLevel: "C4",
    residualOneRiskLevel: "R8",
    suggestedProtection: "速度监控逻辑",
    residualTwoLikelihood: "L1",
    residualTwoConsequenceLevel: "C4",
    residualTwoRiskLevel: "R4",
    remark: ""
  }
];

let riskMatrixTemplateSeed = [
  {
    id: 1,
    templateName: "默认标准模板",
    templateCode: "RM-001",
    remark: "通用风险矩阵模板",
    updateTime: 1761264000000,
    createTime: 1761177600000
  },
  {
    id: 2,
    templateName: "高速单元模板",
    templateCode: "RM-002",
    remark: "适用于高速运动工况",
    updateTime: 1761091200000,
    createTime: 1761004800000
  }
];

let riskMatrixTemplateIdSeed = 3;

const defaultFrequencyColumns = [
  {
    key: "freq1Risk",
    level: "1",
    description: "从未发生过",
    rangeDesc: ">0.0001次/年，且≤0.001"
  },
  {
    key: "freq2Risk",
    level: "2",
    description: "国内曾发生过",
    rangeDesc: ">0.001次/年，且≤0.01"
  },
  {
    key: "freq3Risk",
    level: "3",
    description: "行业内曾发生过",
    rangeDesc: ">0.01次/年，且≤0.1"
  },
  {
    key: "freq4Risk",
    level: "4",
    description: "公司内发生过",
    rangeDesc: ">0.1次/年，且≤1"
  },
  {
    key: "freq5Risk",
    level: "5",
    description: "装置内发生过",
    rangeDesc: ">1次/年"
  }
];

const defaultMatrixRows = [
  {
    level: "1",
    personnelConsequence: "无人员伤害。",
    environmentDamage: "无影响。",
    propertyLoss: "无直接经济损失。",
    reputationImpact: "不会引起社会公众的关注。",
    freq1Risk: "I",
    freq2Risk: "I",
    freq3Risk: "I",
    freq4Risk: "II",
    freq5Risk: "II"
  },
  {
    level: "2",
    personnelConsequence: "对人员造成轻微伤害。",
    environmentDamage: "轻微影响。",
    propertyLoss: "直接经济损失10万元以下。",
    reputationImpact: "造成工厂所在行政区域内的影响。",
    freq1Risk: "I",
    freq2Risk: "I",
    freq3Risk: "II",
    freq4Risk: "II",
    freq5Risk: "III"
  },
  {
    level: "3",
    personnelConsequence: "一个或多个人造成严重永久性伤害。",
    environmentDamage: "较小影响。",
    propertyLoss: "直接经济损失10~100万元。",
    reputationImpact: "造成县域范围内的影响。",
    freq1Risk: "I",
    freq2Risk: "II",
    freq3Risk: "II",
    freq4Risk: "III",
    freq5Risk: "III"
  },
  {
    level: "4",
    personnelConsequence: "造成1~2人死亡。",
    environmentDamage: "局部影响。",
    propertyLoss: "直接经济损失100~1000万元。",
    reputationImpact: "造成省域范围内的影响。",
    freq1Risk: "II",
    freq2Risk: "II",
    freq3Risk: "III",
    freq4Risk: "III",
    freq5Risk: "IV"
  },
  {
    level: "5",
    personnelConsequence: "造成3~9人死亡。",
    environmentDamage: "重大影响。",
    propertyLoss: "直接经济损失1000~5000万元。",
    reputationImpact: "造成全国范围内的影响。",
    freq1Risk: "II",
    freq2Risk: "III",
    freq3Risk: "III",
    freq4Risk: "IV",
    freq5Risk: "V"
  },
  {
    level: "6",
    personnelConsequence: "造成10人以上死亡。",
    environmentDamage: "造成10人以上死亡。",
    propertyLoss: "直接经济损失5000万元以上。",
    reputationImpact: "造成国际影响。",
    freq1Risk: "III",
    freq2Risk: "III",
    freq3Risk: "IV",
    freq4Risk: "V",
    freq5Risk: "V"
  }
];

const cloneData = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const createEmptyMatrixConfig = (payload: {
  templateId: number;
  templateName: string;
  templateCode: string;
  remark?: string;
}) => ({
  templateId: payload.templateId,
  templateName: payload.templateName,
  templateCode: payload.templateCode,
  remark: payload.remark || "",
  frequencyColumns: cloneData(defaultFrequencyColumns),
  rows: cloneData(defaultMatrixRows)
});

const riskMatrixConfigSeed = {
  1: createEmptyMatrixConfig({
    templateId: 1,
    templateName: "默认标准模板",
    templateCode: "RM-001",
    remark: "通用风险矩阵模板"
  }),
  2: createEmptyMatrixConfig({
    templateId: 2,
    templateName: "高速单元模板",
    templateCode: "RM-002",
    remark: "适用于高速运动工况"
  })
};

const riskAssessmentReportSeed = [
  {
    id: 1,
    projectName: "焊接单元功能安全评估",
    projectCode: "PRJ-2026-001",
    unitName: "焊接单元",
    nodeName: "焊接工位A",
    analyst: "张三",
    analysisTime: "2026-03-12",
    reportNo: "REP-RA-001"
  },
  {
    id: 2,
    projectName: "搬运单元安全改造评估",
    projectCode: "PRJ-2026-002",
    unitName: "搬运单元",
    nodeName: "机械臂本体",
    analyst: "王五",
    analysisTime: "2026-02-28",
    reportNo: "REP-RA-002"
  }
];

export default defineFakeRoute([
  // 用户管理
  {
    url: "/user",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          avatar: "https://avatars.githubusercontent.com/u/44761321",
          username: "admin",
          nickname: "小铭",
          phone: "15888886789",
          email: faker.internet.email(),
          sex: 0,
          id: 1,
          status: 1,
          dept: {
            // 部门id
            id: 103,
            // 部门名称
            name: "研发部门"
          },
          remark: "管理员",
          createTime: 1605456000000
        },
        {
          avatar: "https://avatars.githubusercontent.com/u/52823142",
          username: "common",
          nickname: "小林",
          phone: "18288882345",
          email: faker.internet.email(),
          sex: 1,
          id: 2,
          status: 1,
          dept: {
            id: 105,
            name: "测试部门"
          },
          remark: "普通用户",
          createTime: 1605456000000
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.phone) list = list.filter(item => item.phone === body.phone);
      if (body.deptId) list = list.filter(item => item.dept.id === body.deptId);
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 用户管理-获取所有角色列表
  {
    url: "/list-all-role",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          { id: 1, name: "超级管理员" },
          { id: 2, name: "普通角色" }
        ]
      };
    }
  },
  // 用户管理-根据 userId 获取对应角色 id 列表（userId：用户id）
  {
    url: "/list-role-ids",
    method: "post",
    response: ({ body }) => {
      if (body.userId) {
        if (body.userId == 1) {
          return {
            code: 0,
            message: "操作成功",
            data: [1]
          };
        } else if (body.userId == 2) {
          return {
            code: 0,
            message: "操作成功",
            data: [2]
          };
        }
      } else {
        return {
          code: 10001,
          message: "请求参数缺失或格式不正确",
          data: []
        };
      }
    }
  },
  // 角色管理
  {
    url: "/role",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          createTime: 1605456000000, // 时间戳（毫秒ms）
          updateTime: 1684512000000,
          id: 1,
          name: "超级管理员",
          code: "admin",
          status: 1, // 状态 1 启用 0 停用
          remark: "超级管理员拥有最高权限"
        },
        {
          createTime: 1605456000000,
          updateTime: 1684512000000,
          id: 2,
          name: "普通角色",
          code: "common",
          status: 1,
          remark: "普通角色拥有部分权限"
        }
      ];
      list = list.filter(item => item.name.includes(body?.name));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      if (body.code) list = list.filter(item => item.code === body.code);
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 角色管理-权限-菜单权限
  {
    url: "/project-list",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          projectName: "焊接单元功能安全评估",
          projectCode: "PRJ-2026-001",
          projectStatus: "pending",
          owner: "张三",
          robotType: "multi_joint_industrial",
          robotStage: "research",
          projectStartTime: "2026-03-01",
          robotUseTime: "",
          remark: "首批功能安全评估项目",
          createTime: 1761264000000
        },
        {
          id: 2,
          projectName: "搬运单元安全改造评估",
          projectCode: "PRJ-2026-002",
          projectStatus: "in_progress",
          owner: "李四",
          robotType: "collaborative",
          robotStage: "use",
          projectStartTime: "2026-02-18",
          robotUseTime: "2025-10-15",
          remark: "包含SIL验证项",
          createTime: 1761177600000
        },
        {
          id: 3,
          projectName: "装配工位全生命周期复核",
          projectCode: "PRJ-2026-003",
          projectStatus: "completed",
          owner: "王五",
          robotType: "logistics",
          robotStage: "maintenance",
          projectStartTime: "2025-09-12",
          robotUseTime: "2024-06-20",
          remark: "PL/SIL评估已完成",
          createTime: 1761091200000
        },
        {
          id: 4,
          projectName: "复合工位功能升级评估",
          projectCode: "PRJ-2026-004",
          projectStatus: "in_progress",
          owner: "赵六",
          robotType: "composite",
          robotStage: "scrap_terminal",
          projectStartTime: "2026-01-10",
          robotUseTime: "2021-08-01",
          remark: "报废阶段风险复核",
          createTime: 1761004800000
        }
      ];
      list = list.filter(item =>
        item.projectName.includes(body?.projectName ?? "")
      );
      list = list.filter(item =>
        item.projectCode.includes(body?.projectCode ?? "")
      );
      list = list.filter(item => item.owner.includes(body?.owner ?? ""));
      list = list.filter(item =>
        item.robotType.includes(body?.robotType ?? "")
      );
      list = list.filter(item =>
        item.robotStage.includes(body?.robotStage ?? "")
      );
      if (body?.projectStatus) {
        list = list.filter(item => item.projectStatus === body.projectStatus);
      }
      return {
        code: 0,
        message: "success",
        data: paginateList(list, body)
      };
    }
  },
  {
    url: "/risk-assessment-node-list",
    method: "post",
    response: ({ body }) => {
      let list = [...riskAssessmentNodeSeed];

      if (body?.projectId) {
        list = list.filter(item => String(item.projectId) === String(body.projectId));
      }

      list = list.filter(item => item.nodeName.includes(body?.nodeName ?? ""));
      list = list.filter(item => item.analyst.includes(body?.analyst ?? ""));

      return {
        code: 0,
        message: "success",
        data: paginateList(list, body)
      };
    }
  },
  {
    url: "/risk-assessment-worksheet-list",
    method: "post",
    response: ({ body }) => {
      let list = [...riskAssessmentWorksheetSeed];

      if (body?.projectId) {
        list = list.filter(item => String(item.projectId) === String(body.projectId));
      }
      if (body?.nodeId) {
        list = list.filter(item => String(item.nodeId) === String(body.nodeId));
      }

      list = list.filter(item => item.parameter.includes(body?.parameter ?? ""));
      list = list.filter(item => item.deviation.includes(body?.deviation ?? ""));

      return {
        code: 0,
        message: "success",
        data: paginateList(list, body)
      };
    }
  },
  {
    url: "/risk-matrix-template-list",
    method: "post",
    response: ({ body }) => {
      let list = [...riskMatrixTemplateSeed];
      list = list.filter(item =>
        item.templateName.includes(body?.templateName ?? "")
      );
      list = list.filter(item =>
        item.templateCode.includes(body?.templateCode ?? "")
      );
      return {
        code: 0,
        message: "success",
        data: paginateList(list, body)
      };
    }
  },
  {
    url: "/risk-matrix-template-create",
    method: "post",
    response: ({ body }) => {
      const templateName = String(body?.templateName || "").trim();
      const templateCode = String(body?.templateCode || "").trim();
      const remark = String(body?.remark || "").trim();

      if (!templateName || !templateCode) {
        return {
          code: 10001,
          message: "模板名称和模板编号不能为空",
          data: null
        };
      }

      const repeated = riskMatrixTemplateSeed.find(
        item => item.templateName === templateName || item.templateCode === templateCode
      );
      if (repeated) {
        return {
          code: 10002,
          message: "模板名称或模板编号已存在",
          data: null
        };
      }

      const now = Date.now();
      const row = {
        id: riskMatrixTemplateIdSeed++,
        templateName,
        templateCode,
        remark,
        updateTime: now,
        createTime: now
      };

      riskMatrixTemplateSeed = [row, ...riskMatrixTemplateSeed];
      riskMatrixConfigSeed[row.id] = createEmptyMatrixConfig({
        templateId: row.id,
        templateName: row.templateName,
        templateCode: row.templateCode,
        remark: row.remark
      });

      return {
        code: 0,
        message: "success",
        data: row
      };
    }
  },
  {
    url: "/risk-matrix-template-delete",
    method: "post",
    response: ({ body }) => {
      const templateId = Number(body?.templateId || 0);
      if (!templateId) {
        return {
          code: 10001,
          message: "缺少模板ID",
          data: null
        };
      }

      const index = riskMatrixTemplateSeed.findIndex(item => item.id === templateId);
      if (index < 0) {
        return {
          code: 10002,
          message: "模板不存在",
          data: null
        };
      }

      riskMatrixTemplateSeed.splice(index, 1);
      delete riskMatrixConfigSeed[templateId];

      return {
        code: 0,
        message: "success",
        data: null
      };
    }
  },
  {
    url: "/risk-matrix-config-detail",
    method: "post",
    response: ({ body }) => {
      const templateId = Number(body?.templateId || 0);
      const mode = body?.mode;
      if (mode === "create") {
        const projectName = String(body?.projectName || "").trim();
        return {
          code: 0,
          message: "success",
          data: createEmptyMatrixConfig({
            templateId: 0,
            templateName: projectName ? `${projectName}风险矩阵` : "新建风险矩阵",
            templateCode: "",
            remark: ""
          })
        };
      }

      if (!templateId) {
        return {
          code: 0,
          message: "success",
          data: createEmptyMatrixConfig({
            templateId: 0,
            templateName: "未命名模板",
            templateCode: "",
            remark: ""
          })
        };
      }

      return {
        code: 0,
        message: "success",
        data: riskMatrixConfigSeed[templateId] ?? riskMatrixConfigSeed[1]
      };
    }
  },
  {
    url: "/risk-matrix-config-save",
    method: "post",
    response: ({ body }) => {
      const templateId = Number(body?.templateId || 0);
      if (!templateId) {
        return {
          code: 10001,
          message: "缺少模板ID",
          data: null
        };
      }

      riskMatrixConfigSeed[templateId] = {
        ...riskMatrixConfigSeed[templateId],
        ...body,
        templateId
      };

      const template = riskMatrixTemplateSeed.find(item => item.id === templateId);
      if (template) {
        template.templateName = body?.templateName || template.templateName;
        template.templateCode = body?.templateCode || template.templateCode;
        template.remark = body?.remark ?? template.remark;
        template.updateTime = Date.now();
      }

      return {
        code: 0,
        message: "success",
        data: riskMatrixConfigSeed[templateId]
      };
    }
  },
  {
    url: "/risk-assessment-report-list",
    method: "post",
    response: ({ body }) => {
      let list = [...riskAssessmentReportSeed];
      list = list.filter(item =>
        item.projectName.includes(body?.projectName ?? "")
      );
      list = list.filter(item =>
        item.projectCode.includes(body?.projectCode ?? "")
      );
      list = list.filter(item => item.unitName.includes(body?.unitName ?? ""));

      return {
        code: 0,
        message: "success",
        data: paginateList(list, body)
      };
    }
  },
  {
    url: "/role-menu",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          // 外部页面
          {
            parentId: 0,
            id: 100,
            menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
            title: "menus.pureExternalPage"
          },
          {
            parentId: 100,
            id: 101,
            menuType: 0,
            title: "menus.pureExternalDoc"
          },
          {
            parentId: 101,
            id: 102,
            menuType: 2,
            title: "menus.pureExternalLink"
          },
          {
            parentId: 101,
            id: 103,
            menuType: 2,
            title: "menus.pureUtilsLink"
          },
          {
            parentId: 100,
            id: 104,
            menuType: 1,
            title: "menus.pureEmbeddedDoc"
          },
          {
            parentId: 104,
            id: 105,
            menuType: 1,
            title: "menus.pureEpDoc"
          },
          {
            parentId: 104,
            id: 106,
            menuType: 1,
            title: "menus.pureTailwindcssDoc"
          },
          {
            parentId: 104,
            id: 107,
            menuType: 1,
            title: "menus.pureVueDoc"
          },
          {
            parentId: 104,
            id: 108,
            menuType: 1,
            title: "menus.pureViteDoc"
          },
          {
            parentId: 104,
            id: 109,
            menuType: 1,
            title: "menus.purePiniaDoc"
          },
          {
            parentId: 104,
            id: 110,
            menuType: 1,
            title: "menus.pureRouterDoc"
          },
          // 权限管理
          {
            parentId: 0,
            id: 200,
            menuType: 0,
            title: "menus.purePermission"
          },
          {
            parentId: 200,
            id: 201,
            menuType: 0,
            title: "menus.purePermissionPage"
          },
          {
            parentId: 200,
            id: 202,
            menuType: 0,
            title: "menus.purePermissionButton"
          },
          {
            parentId: 202,
            id: 203,
            menuType: 3,
            title: "添加"
          },
          {
            parentId: 202,
            id: 204,
            menuType: 3,
            title: "修改"
          },
          {
            parentId: 202,
            id: 205,
            menuType: 3,
            title: "删除"
          },
          // 系统管理
          {
            parentId: 0,
            id: 300,
            menuType: 0,
            title: "menus.pureSysManagement"
          },
          {
            parentId: 300,
            id: 301,
            menuType: 0,
            title: "menus.pureUser"
          },
          {
            parentId: 300,
            id: 302,
            menuType: 0,
            title: "menus.pureRole"
          },
          {
            parentId: 300,
            id: 303,
            menuType: 0,
            title: "menus.pureSystemMenu"
          },
          {
            parentId: 300,
            id: 304,
            menuType: 0,
            title: "menus.pureDept"
          },
          // 系统监控
          {
            parentId: 0,
            id: 400,
            menuType: 0,
            title: "menus.pureSysMonitor"
          },
          {
            parentId: 400,
            id: 401,
            menuType: 0,
            title: "menus.pureOnlineUser"
          },
          {
            parentId: 400,
            id: 402,
            menuType: 0,
            title: "menus.pureLoginLog"
          },
          {
            parentId: 400,
            id: 403,
            menuType: 0,
            title: "menus.pureOperationLog"
          },
          {
            parentId: 400,
            id: 404,
            menuType: 0,
            title: "menus.pureSystemLog"
          },
          // 标签页操作
          {
            parentId: 0,
            id: 500,
            menuType: 0,
            title: "menus.pureTabs"
          },
          {
            parentId: 500,
            id: 501,
            menuType: 0,
            title: "menus.pureTabs"
          },
          {
            parentId: 500,
            id: 502,
            menuType: 0,
            title: "query传参模式"
          },
          {
            parentId: 500,
            id: 503,
            menuType: 0,
            title: "params传参模式"
          }
        ]
      };
    }
  },
  // 角色管理-权限-菜单权限-根据角色 id 查对应菜单
  {
    url: "/role-menu-ids",
    method: "post",
    response: ({ body }) => {
      if (body.id == 1) {
        return {
          code: 0,
          message: "操作成功",
          data: [
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 200, 201,
            202, 203, 204, 205, 300, 301, 302, 303, 304, 400, 401, 402, 403,
            404, 500, 501, 502, 503
          ]
        };
      } else if (body.id == 2) {
        return {
          code: 0,
          message: "操作成功",
          data: [
            100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 404, 500,
            501, 502, 503
          ]
        };
      }
    }
  },
  // 菜单管理
  {
    url: "/menu",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          // 外部页面
          {
            parentId: 0,
            id: 100,
            menuType: 0, // 菜单类型（0代表菜单、1代表iframe、2代表外链、3代表按钮）
            title: "menus.pureExternalPage",
            name: "PureIframe",
            path: "/iframe",
            component: "",
            rank: 7,
            redirect: "",
            icon: "ri:links-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 100,
            id: 101,
            menuType: 0,
            title: "menus.pureExternalDoc",
            name: "PureIframeExternal",
            path: "/iframe/external",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 102,
            menuType: 2,
            title: "menus.pureExternalLink",
            name: "https://pure-admin.cn/",
            path: "/external",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 101,
            id: 103,
            menuType: 2,
            title: "menus.pureUtilsLink",
            name: "https://pure-admin-utils.netlify.app/",
            path: "/pureUtilsLink",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 100,
            id: 104,
            menuType: 1,
            title: "menus.pureEmbeddedDoc",
            name: "PureIframeEmbedded",
            path: "/iframe/embedded",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 105,
            menuType: 1,
            title: "menus.pureEpDoc",
            name: "FrameEp",
            path: "/iframe/ep",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://element-plus.org/zh-CN/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 106,
            menuType: 1,
            title: "menus.pureTailwindcssDoc",
            name: "FrameTailwindcss",
            path: "/iframe/tailwindcss",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://tailwindcss.com/docs/installation",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 107,
            menuType: 1,
            title: "menus.pureVueDoc",
            name: "FrameVue",
            path: "/iframe/vue3",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://cn.vuejs.org/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 108,
            menuType: 1,
            title: "menus.pureViteDoc",
            name: "FrameVite",
            path: "/iframe/vite",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://cn.vitejs.dev/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 109,
            menuType: 1,
            title: "menus.purePiniaDoc",
            name: "FramePinia",
            path: "/iframe/pinia",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 104,
            id: 110,
            menuType: 1,
            title: "menus.pureRouterDoc",
            name: "FrameRouter",
            path: "/iframe/vue-router",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "https://router.vuejs.org/zh/",
            frameLoading: true,
            keepAlive: true,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 权限管理
          {
            parentId: 0,
            id: 200,
            menuType: 0,
            title: "menus.purePermission",
            name: "PurePermission",
            path: "/permission",
            component: "",
            rank: 9,
            redirect: "",
            icon: "ep:lollipop",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 200,
            id: 201,
            menuType: 0,
            title: "menus.purePermissionPage",
            name: "PermissionPage",
            path: "/permission/page/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 200,
            id: 202,
            menuType: 0,
            title: "menus.purePermissionButton",
            name: "PermissionButton",
            path: "/permission/button",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 203,
            menuType: 0,
            title: "menus.purePermissionButtonRouter",
            name: "PermissionButtonRouter",
            path: "/permission/button/router",
            component: "permission/button/index",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 203,
            id: 210,
            menuType: 3,
            title: "添加",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:add",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 203,
            id: 211,
            menuType: 3,
            title: "修改",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:edit",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 203,
            id: 212,
            menuType: 3,
            title: "删除",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:delete",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 202,
            id: 204,
            menuType: 0,
            title: "menus.purePermissionButtonLogin",
            name: "PermissionButtonLogin",
            path: "/permission/button/login",
            component: "permission/button/perms",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 204,
            id: 220,
            menuType: 3,
            title: "添加",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:add",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 204,
            id: 221,
            menuType: 3,
            title: "修改",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:edit",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 204,
            id: 222,
            menuType: 3,
            title: "删除",
            name: "",
            path: "",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "permission:btn:delete",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 系统管理
          {
            parentId: 0,
            id: 300,
            menuType: 0,
            title: "menus.pureSysManagement",
            name: "PureSystem",
            path: "/system",
            component: "",
            rank: 10,
            redirect: "",
            icon: "ri:settings-3-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 301,
            menuType: 0,
            title: "menus.pureUser",
            name: "SystemUser",
            path: "/system/user/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:admin-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 302,
            menuType: 0,
            title: "menus.pureRole",
            name: "SystemRole",
            path: "/system/role/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:admin-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 303,
            menuType: 0,
            title: "menus.pureSystemMenu",
            name: "SystemMenu",
            path: "/system/menu/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ep:menu",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 300,
            id: 304,
            menuType: 0,
            title: "menus.pureDept",
            name: "SystemDept",
            path: "/system/dept/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "ri:git-branch-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 系统监控
          {
            parentId: 0,
            id: 400,
            menuType: 0,
            title: "menus.pureSysMonitor",
            name: "PureMonitor",
            path: "/monitor",
            component: "",
            rank: 11,
            redirect: "",
            icon: "ep:monitor",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 401,
            menuType: 0,
            title: "menus.pureOnlineUser",
            name: "OnlineUser",
            path: "/monitor/online-user",
            component: "monitor/online/index",
            rank: null,
            redirect: "",
            icon: "ri:user-voice-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 402,
            menuType: 0,
            title: "menus.pureLoginLog",
            name: "LoginLog",
            path: "/monitor/login-logs",
            component: "monitor/logs/login/index",
            rank: null,
            redirect: "",
            icon: "ri:window-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 403,
            menuType: 0,
            title: "menus.pureOperationLog",
            name: "OperationLog",
            path: "/monitor/operation-logs",
            component: "monitor/logs/operation/index",
            rank: null,
            redirect: "",
            icon: "ri:history-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 400,
            id: 404,
            menuType: 0,
            title: "menus.pureSystemLog",
            name: "SystemLog",
            path: "/monitor/system-logs",
            component: "monitor/logs/system/index",
            rank: null,
            redirect: "",
            icon: "ri:file-search-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          // 标签页操作
          {
            parentId: 0,
            id: 500,
            menuType: 0,
            title: "menus.pureTabs",
            name: "PureTabs",
            path: "/tabs",
            component: "",
            rank: 12,
            redirect: "",
            icon: "ri:bookmark-2-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 500,
            id: 501,
            menuType: 0,
            title: "menus.pureTabs",
            name: "Tabs",
            path: "/tabs/index",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: true,
            showParent: false
          },
          {
            parentId: 500,
            id: 502,
            menuType: 0,
            title: "query传参模式",
            name: "TabQueryDetail",
            path: "/tabs/query-detail",
            component: "",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "/tabs/index",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: false,
            showParent: false
          },
          {
            parentId: 500,
            id: 503,
            menuType: 0,
            title: "params传参模式",
            name: "TabParamsDetail",
            path: "/tabs/params-detail/:id",
            component: "params-detail",
            rank: null,
            redirect: "",
            icon: "",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "/tabs/index",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            fixedTag: false,
            showLink: false,
            showParent: false
          }
        ]
      };
    }
  },
  // 部门管理
  {
    url: "/dept",
    method: "post",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          {
            name: "杭州总公司",
            parentId: 0,
            id: 100,
            sort: 0,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1, // 状态 1 启用 0 停用
            type: 1, // 1 公司 2 分公司 3 部门
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "郑州分公司",
            parentId: 100,
            id: 101,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "研发部门",
            parentId: 101,
            id: 103,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "市场部门",
            parentId: 102,
            id: 108,
            sort: 1,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "深圳分公司",
            parentId: 100,
            id: 102,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 2,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "市场部门",
            parentId: 101,
            id: 104,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "财务部门",
            parentId: 102,
            id: 109,
            sort: 2,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "测试部门",
            parentId: 101,
            id: 105,
            sort: 3,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "财务部门",
            parentId: 101,
            id: 106,
            sort: 4,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 1,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          },
          {
            name: "运维部门",
            parentId: 101,
            id: 107,
            sort: 5,
            phone: "15888888888",
            principal: faker.person.firstName(),
            email: faker.internet.email(),
            status: 0,
            type: 3,
            createTime: 1605456000000,
            remark: "这里是备注信息这里是备注信息这里是备注信息这里是备注信息"
          }
        ]
      };
    }
  },
  // 在线用户
  {
    url: "/online-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          username: "admin",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          loginTime: new Date()
        },
        {
          id: 2,
          username: "common",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          loginTime: new Date()
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 登录日志
  {
    url: "/login-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          username: "admin",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          status: 1, // 登录状态 1 成功 0 失败
          behavior: "账号登录",
          loginTime: new Date()
        },
        {
          id: 2,
          username: "common",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          status: 0,
          behavior: "第三方登录",
          loginTime: new Date()
        }
      ];
      list = list.filter(item => item.username.includes(body?.username));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 操作日志
  {
    url: "/operation-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1,
          username: "admin",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          status: 1, // 操作状态 1 成功 0 失败
          summary: "菜单管理-添加菜单", // 操作概要
          module: "系统管理", // 所属模块
          operatingTime: new Date() // 操作时间
        },
        {
          id: 2,
          username: "common",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          status: 0,
          summary: "列表分页查询",
          module: "在线用户",
          operatingTime: new Date()
        }
      ];
      list = list.filter(item => item.module.includes(body?.module));
      list = list.filter(item =>
        String(item.status).includes(String(body?.status))
      );
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 系统日志
  {
    url: "/system-logs",
    method: "post",
    response: ({ body }) => {
      let list = [
        {
          id: 1, // 日志ID
          /**
           * 日志级别
           * 0 debug调试（最低级别的日志，用于调试和开发阶段）
           * 1 info信息（默认级别，用于记录一般的信息）
           * 2 warn警告（表示可能出现的问题或潜在的错误，但不会影响系统的正常运行）
           * 3 error错误（表示发生了错误，但不会导致系统崩溃）
           * 4 fatal致命（最高级别的日志，表示发生了严重错误，导致系统无法继续运行）
           */
          level: 1,
          module: "菜单管理", // 所属模块
          url: "/menu", // 请求接口
          method: "post", // 请求方法
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          /**
           * 请求耗时（单位：ms 毫秒）
           * 正常耗时：一般认为在几百毫秒（0.1-0.5秒）范围内的请求耗时较为正常
           * 较慢耗时：在1秒以上的耗时可以被认为是较慢的请求，但具体是否较慢还需要根据具体业务场景和性能要求来判断
           */
          takesTime: 10,
          requestTime: new Date() // 请求时间
        },
        {
          id: 2,
          level: 0,
          module: "地图",
          url: "/get-map-info",
          method: "get",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          takesTime: 1200,
          requestTime: new Date()
        }
      ];
      list = list.filter(item => item.module.includes(body?.module));
      return {
        code: 0,
        message: "操作成功",
        data: {
          list,
          total: list.length, // 总条目数
          pageSize: 10, // 每页显示条目个数
          currentPage: 1 // 当前页数
        }
      };
    }
  },
  // 系统日志-根据 id 查日志详情
  {
    url: "/system-logs-detail",
    method: "post",
    response: ({ body }) => {
      if (body.id == 1) {
        return {
          id: 1,
          level: 1,
          module: "菜单管理",
          url: "/menu",
          method: "post",
          ip: faker.internet.ipv4(),
          address: "中国河南省信阳市",
          system: "macOS",
          browser: "Chrome",
          takesTime: 10,
          responseHeaders: {
            traceId: "1495502411171032",
            "Content-Type": "application/json",
            Connection: "keep-alive",
            "Keep-Alive": "timeout=5",
            "Content-Length": 17019
          },
          responseBody: {
            code: 0,
            message: "操作成功",
            data: [
              {
                parentId: 0,
                id: 400,
                menuType: 0,
                title: "menus.pureSysMonitor",
                name: "PureMonitor",
                path: "/monitor",
                component: "",
                rank: 11,
                redirect: "",
                icon: "ep:monitor",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 401,
                menuType: 0,
                title: "menus.pureOnlineUser",
                name: "OnlineUser",
                path: "/monitor/online-user",
                component: "monitor/online/index",
                rank: null,
                redirect: "",
                icon: "ri:user-voice-line",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 402,
                menuType: 0,
                title: "menus.pureLoginLog",
                name: "LoginLog",
                path: "/monitor/login-logs",
                component: "monitor/logs/login/index",
                rank: null,
                redirect: "",
                icon: "ri:window-line",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 403,
                menuType: 0,
                title: "menus.pureOperationLog",
                name: "OperationLog",
                path: "/monitor/operation-logs",
                component: "monitor/logs/operation/index",
                rank: null,
                redirect: "",
                icon: "ri:history-fill",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              },
              {
                parentId: 400,
                id: 404,
                menuType: 0,
                title: "menus.pureSystemLog",
                name: "SystemLog",
                path: "/monitor/system-logs",
                component: "monitor/logs/system/index",
                rank: null,
                redirect: "",
                icon: "ri:file-search-line",
                extraIcon: "",
                enterTransition: "",
                leaveTransition: "",
                activePath: "",
                auths: "",
                frameSrc: "",
                frameLoading: true,
                keepAlive: false,
                hiddenTag: false,
                fixedTag: false,
                showLink: true,
                showParent: false
              }
            ]
          },
          requestHeaders: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,eo;q=0.7",
            Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.admin",
            Connection: "keep-alive",
            "Content-Length": 0,
            Cookie:
              "_ga=GA1.1.231800979.1704562367; _ga_M74ZHEQ1M1=GS1.1.1709299375.7.1.1709299476.0.0.0; Hm_lvt_6a7dac00248d3b6ad8479d7249bb29c5=1709032753,1709359575; Hm_lvt_23a157b7d0d9867f7a51e42628f052f5=1708960489,1709485849,1709879672; authorized-token={%22accessToken%22:%22eyJhbGciOiJIUzUxMiJ9.admin%22%2C%22expires%22:1919520000000}; multiple-tabs=true",
            Host: "192.168.2.121:8848",
            Origin: "http://192.168.2.121:8848",
            Referer: "http://192.168.2.121:8848/",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
          },
          requestBody: {
            title: "系统监控"
          },
          traceId: "1495502411171032",
          requestTime: new Date()
        };
      } else if (body.id == 2) {
        return {
          id: 2,
          level: 0,
          module: "地图",
          url: "/get-map-info?plateNumber=豫A59778U",
          method: "get",
          ip: faker.internet.ipv4(),
          address: "中国广东省深圳市",
          system: "Windows",
          browser: "Firefox",
          takesTime: 1200,
          responseHeaders: {
            traceId: "2280443117103208",
            "Content-Type": "application/json",
            Connection: "keep-alive",
            "Keep-Alive": "timeout=5",
            "Content-Length": 28693
          },
          responseBody: {
            plateNumber: "豫A59778U",
            driver: "子骞",
            orientation: 289,
            lng: 113.8564,
            lat: 34.373
          },
          requestHeaders: {
            Accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,eo;q=0.7",
            Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.admin",
            Connection: "keep-alive",
            "Content-Length": 0,
            Cookie:
              "_ga=GA1.1.231800979.1704562367; _ga_M74ZHEQ1M1=GS1.1.1709299375.7.1.1709299476.0.0.0; Hm_lvt_6a7dac00248d3b6ad8479d7249bb29c5=1709032753,1709359575; Hm_lvt_23a157b7d0d9867f7a51e42628f052f5=1708960489,1709485849,1709879672; authorized-token={%22accessToken%22:%22eyJhbGciOiJIUzUxMiJ9.admin%22%2C%22expires%22:1919520000000}; multiple-tabs=true",
            Host: "192.168.2.121:8848",
            Origin: "http://192.168.2.121:8848",
            Referer: "http://192.168.2.121:8848/",
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
          },
          requestBody: null,
          traceId: "2280443117103208",
          requestTime: new Date()
        };
      }
    }
  },
]);

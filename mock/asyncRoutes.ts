// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import { system, monitor, permission, frame, tabs } from "@/router/enums";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const projectManagementRouter = {
  path: "/project",
  meta: {
    icon: "ri:folder-chart-2-line",
    title: "项目管理",
    rank: system
  },
  children: [
    {
      path: "/project/list",
      component: "project/list/index",
      name: "ProjectList",
      meta: {
        icon: "ri:file-list-3-line",
        title: "项目列表",
        showParent: true,
        roles: ["admin"]
      }
    }
  ]
};

const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "用户管理",
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "角色管理",
        roles: ["admin"]
      }
    }
    // {
    //   path: "/system/menu/index",
    //   name: "SystemMenu",
    //   meta: {
    //     icon: "ep:menu",
    //     title: "菜单管理",
    //     roles: ["admin"]
    //   }
    // },
    // {
    //   path: "/system/dept/index",
    //   name: "SystemDept",
    //   meta: {
    //     icon: "ri:git-branch-line",
    //     title: "部门管理",
    //     roles: ["admin"]
    //   }
    // }
  ]
};

const systemMonitorRouter = {
  path: "/monitor",
  meta: {
    icon: "ep:monitor",
    title: "系统监控",
    rank: monitor
  },
  children: [
    {
      path: "/monitor/online-user",
      component: "monitor/online/index",
      name: "OnlineUser",
      meta: {
        icon: "ri:user-voice-line",
        title: "在线用户",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/login-logs",
      component: "monitor/logs/login/index",
      name: "LoginLog",
      meta: {
        icon: "ri:window-line",
        title: "登录日志",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/operation-logs",
      component: "monitor/logs/operation/index",
      name: "OperationLog",
      meta: {
        icon: "ri:history-fill",
        title: "操作日志",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/system-logs",
      component: "monitor/logs/system/index",
      name: "SystemLog",
      meta: {
        icon: "ri:file-search-line",
        title: "系统日志",
        roles: ["admin"]
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "权限管理",
    icon: "ep:lollipop",
    rank: permission
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "页面权限",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "按钮权限",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "路由返回按钮权限",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "登录接口返回按钮权限"
          }
        }
      ]
    }
  ]
};

const frameRouter = {
  path: "/iframe",
  meta: {
    icon: "ri:links-fill",
    title: "menus.pureExternalPage",
    rank: frame
  },
  children: [
    {
      path: "/iframe/embedded",
      meta: {
        title: "menus.pureEmbeddedDoc"
      },
      children: [
        {
          path: "/iframe/colorhunt",
          name: "FrameColorHunt",
          meta: {
            title: "menus.pureColorHuntDoc",
            frameSrc: "https://colorhunt.co/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/uigradients",
          name: "FrameUiGradients",
          meta: {
            title: "menus.pureUiGradients",
            frameSrc: "https://uigradients.com/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/ep",
          name: "FrameEp",
          meta: {
            title: "menus.pureEpDoc",
            frameSrc: "https://element-plus.org/zh-CN/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/tailwindcss",
          name: "FrameTailwindcss",
          meta: {
            title: "menus.pureTailwindcssDoc",
            frameSrc: "https://tailwindcss.com/docs/installation",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue3",
          name: "FrameVue",
          meta: {
            title: "menus.pureVueDoc",
            frameSrc: "https://cn.vuejs.org/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vite",
          name: "FrameVite",
          meta: {
            title: "menus.pureViteDoc",
            frameSrc: "https://cn.vitejs.dev/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/pinia",
          name: "FramePinia",
          meta: {
            title: "menus.purePiniaDoc",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue-router",
          name: "FrameRouter",
          meta: {
            title: "menus.pureRouterDoc",
            frameSrc: "https://router.vuejs.org/zh/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        }
      ]
    },
    {
      path: "/iframe/external",
      meta: {
        title: "menus.pureExternalDoc"
      },
      children: [
        {
          path: "/external",
          name: "https://pure-admin.cn/",
          meta: {
            title: "menus.pureExternalLink",
            roles: ["admin", "common"]
          }
        },
        {
          path: "/pureUtilsLink",
          name: "https://pure-admin-utils.netlify.app/",
          meta: {
            title: "menus.pureUtilsLink",
            roles: ["admin", "common"]
          }
        }
      ]
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "menus.pureTabs",
    rank: tabs
  },
  children: [
    {
      path: "/tabs/index",
      name: "Tabs",
      meta: {
        title: "menus.pureTabs",
        roles: ["admin", "common"]
      }
    },
    // query 传参模式
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    },
    // params 传参模式
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          projectManagementRouter,
          {
            ...systemManagementRouter,
            children: [
              ...(systemManagementRouter.children || []),
              {
                path: "/system/dict/index",
                component: "system/dict/index",
                name: "SystemDict",
                meta: {
                  icon: "ri:book-open-line",
                  title: "字典管理",
                  roles: ["admin"]
                }
              }
            ]
          }
          // systemMonitorRouter,
          // permissionRouter,
          // frameRouter,
          // tabsRouter
        ]
      };
    }
  }
]);

import { http } from "@/utils/http";

type Result = {
  code: number;
  message: string;
  data?: Array<any>;
};

type ResultAny = {
  code: number;
  message: string;
  data?: any;
};

type ResultTable = {
  code: number;
  message: string;
  data?: {
    /** 鍒楄〃鏁版嵁 */
    list: Array<any>;
    /** 鎬绘潯鐩暟 */
    total?: number;
    /** 姣忛〉鏄剧ず鏉＄洰涓暟 */
    pageSize?: number;
    /** 褰撳墠椤垫暟 */
    currentPage?: number;
  };
};

/** 鑾峰彇绯荤粺绠＄悊-鐢ㄦ埛绠＄悊鍒楄〃 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/user", { data });
};

/** 绯荤粺绠＄悊-鐢ㄦ埛绠＄悊-鑾峰彇鎵€鏈夎鑹插垪琛?*/
export const getAllRoleList = () => {
  return http.request<Result>("get", "/list-all-role");
};

/** 绯荤粺绠＄悊-鐢ㄦ埛绠＄悊-鏍规嵁userId锛岃幏鍙栧搴旇鑹瞚d鍒楄〃锛坲serId锛氱敤鎴穒d锛?*/
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 鑾峰彇绯荤粺绠＄悊-瑙掕壊绠＄悊鍒楄〃 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", "/role", { data });
};

export const getProjectList = (data?: object) => {
  return http.request<ResultTable>("post", "/project-list", { data });
};

export const getDictList = (data?: object) => {
  return http.request<ResultTable>("post", "/dict-list", { data });
};

export const getDictTypeList = (data?: object) => {
  return http.request<ResultTable>("post", "/dict-type-list", { data });
};

export const saveDictType = (data?: object) => {
  return http.request<ResultAny>("post", "/dict-type-save", { data });
};

export const toggleDictTypeStatus = (data?: object) => {
  return http.request<ResultAny>("post", "/dict-type-toggle", { data });
};

export const deleteDictType = (data?: object) => {
  return http.request<ResultAny>("post", "/dict-type-delete", { data });
};

export const saveDictItem = (data?: object) => {
  return http.request<ResultAny>("post", "/dict-save", { data });
};

export const deleteDictItem = (data?: object) => {
  return http.request<ResultAny>("post", "/dict-delete", { data });
};

export const getDictOptions = () => {
  return http.request<ResultAny>("get", "/dict-options");
};


/** 鑾峰彇绯荤粺绠＄悊-鑿滃崟绠＄悊鍒楄〃 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/menu", { data });
};

/** 鑾峰彇绯荤粺绠＄悊-閮ㄩ棬绠＄悊鍒楄〃 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};

/** 鑾峰彇绯荤粺鐩戞帶-鍦ㄧ嚎鐢ㄦ埛鍒楄〃 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/online-logs", { data });
};

/** 鑾峰彇绯荤粺鐩戞帶-鐧诲綍鏃ュ織鍒楄〃 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/login-logs", { data });
};

/** 鑾峰彇绯荤粺鐩戞帶-鎿嶄綔鏃ュ織鍒楄〃 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/operation-logs", { data });
};

/** 鑾峰彇绯荤粺鐩戞帶-绯荤粺鏃ュ織鍒楄〃 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

/** 鑾峰彇绯荤粺鐩戞帶-绯荤粺鏃ュ織-鏍规嵁 id 鏌ユ棩蹇楄鎯?*/
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>("post", "/system-logs-detail", { data });
};

/** 鑾峰彇瑙掕壊绠＄悊-鏉冮檺-鑿滃崟鏉冮檺 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>("post", "/role-menu", { data });
};

/** 鑾峰彇瑙掕壊绠＄悊-鏉冮檺-鑿滃崟鏉冮檺-鏍规嵁瑙掕壊 id 鏌ュ搴旇彍鍗?*/
export const getRoleMenuIds = (data?: object) => {
  return http.request<Result>("post", "/role-menu-ids", { data });
};

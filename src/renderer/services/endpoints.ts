/**
 * 集中管理所有业务 API 端点。
 * 后续新增的业务接口也应在此文件中配置。
 */

import { configService } from './config';

export const isTestModeEnabled = () => {
  return configService.getConfig().app?.testMode === true;
};

// 自动更新
export const getUpdateCheckUrl = () => isTestModeEnabled()
  ? 'https://aicloudsail.longcheer.com:8077/'
  : 'https://aicloudsail.longcheer.com:8077/';

// 手动检查更新
export const getManualUpdateCheckUrl = () => isTestModeEnabled()
  ? 'https://aicloudsail.longcheer.com:8077/'
  : 'https://aicloudsail.longcheer.com:8077/';

export const getFallbackDownloadUrl = () => isTestModeEnabled()
  ? 'https://aicloudsail.longcheer.com:8077/'
  : 'https://aicloudsail.longcheer.com:8077/';

// Skill 商店
export const getSkillStoreUrl = () => isTestModeEnabled()
  ? 'https://aicloudsail.longcheer.com:8077/'
  : 'https://aicloudsail.longcheer.com:8077/';

// Kit 商店
export const getKitStoreUrl = () => isTestModeEnabled()
  ? 'https://aicloudsail.longcheer.com:8077/'
  : 'https://aicloudsail.longcheer.com:8077/';

// 登录地址
export const getLoginOvermindUrl = () => isTestModeEnabled()
  ? 'https://aicloudsail.longcheer.com:8077/'
  : 'https://aicloudsail.longcheer.com:8077/';

// Portal 页面
const PORTAL_LOGIN_URL = 'https://aicloudsail.longcheer.com:8077/';
const PORTAL_BASE_TEST = 'https://aicloudsail.longcheer.com:8077/#';
const PORTAL_BASE_PROD = 'https://aicloudsail.longcheer.com:8077/#';

const getPortalBase = () => isTestModeEnabled() ? PORTAL_BASE_TEST : PORTAL_BASE_PROD;

export const PortalPricingKeyfrom = {
  HtmlShare: 'html_share',
} as const;

export type PortalPricingKeyfrom =
  (typeof PortalPricingKeyfrom)[keyof typeof PortalPricingKeyfrom];

export const getPortalLoginUrl = () => PORTAL_LOGIN_URL;
export const getPortalPricingUrl = (keyfrom?: PortalPricingKeyfrom) => (
  `${getPortalBase()}/pricing${keyfrom ? `?keyfrom=${encodeURIComponent(keyfrom)}` : ''}`
);
export const getPortalProfileUrl = () => `${getPortalBase()}/profile`;
export const getPortalRechargeUrl = () => `${getPortalBase()}/`;
export const getPortalInvitationUrl = () => `${getPortalBase()}/invitation`;
export const getPortalCreditsResetActivityUrl = () => `${getPortalBase()}/profile?activity=credits_reset`;

import { app } from 'electron';

import { HtmlSharePublicRoute } from '../../shared/htmlShare/constants';
import type { SqliteStore } from '../sqliteStore';
import {
  MockServerApiConfigValue,
  startMockServerApi,
  stopMockServerApi,
} from './mockServerApi';

let cachedTestMode: boolean | null = null;
let cachedServerApiBaseUrl: string | null = null;
let cachedExternalFeaturesDisabled = false;

/**
 * Read endpoint-related settings from store and cache them.
 * Call once at startup and again whenever app_config changes.
 */
export function refreshEndpointsTestMode(store: SqliteStore): void {
  const appConfig = store.get<any>('app_config');
  const enterpriseConfig = store.get<any>('enterprise_config');
  const enterpriseServerApiBaseUrl = typeof enterpriseConfig?.serverApiBaseUrl === 'string'
    ? enterpriseConfig.serverApiBaseUrl.trim()
    : '';
  cachedTestMode = appConfig?.app?.testMode === true;
  if (enterpriseServerApiBaseUrl.toLowerCase() === MockServerApiConfigValue) {
    cachedServerApiBaseUrl = startMockServerApi();
  } else {
    stopMockServerApi();
    cachedServerApiBaseUrl = enterpriseServerApiBaseUrl
      ? enterpriseServerApiBaseUrl.replace(/\/+$/, '')
      : null;
  }
  cachedExternalFeaturesDisabled = enterpriseConfig?.disableExternalFeatures === true;
}

/**
 * Whether the app is in test mode.
 * Uses cached value after init; falls back to !app.isPackaged before init.
 */
export const isTestModeEnabled = (): boolean => {
  return cachedTestMode ?? !app.isPackaged;
};

/**
 * Server API base URL — switches based on testMode.
 * Used for auth exchange/refresh, models, proxy, etc.
 */
export const getServerApiBaseUrl = (): string => {
  if (cachedServerApiBaseUrl) return cachedServerApiBaseUrl;
  return isTestModeEnabled()
    ? 'http://127.0.0.1:17981'
    : 'http://127.0.0.1:17981';
};

export const areExternalFeaturesDisabled = (): boolean => cachedExternalFeaturesDisabled;

export const getHtmlSharePublicBaseUrl = (): string => {
  return `${getServerApiBaseUrl()}${HtmlSharePublicRoute.Root}`;
};

export const getUpdateCheckUrl = (): string => (
  isTestModeEnabled()
    ? 'https://aicloudsail.longcheer.com:8077/'
    : 'https://aicloudsail.longcheer.com:8077/'
);

export const getManualUpdateCheckUrl = (): string => (
  isTestModeEnabled()
    ? 'https://aicloudsail.longcheer.com:8077/'
    : 'https://aicloudsail.longcheer.com:8077/'
);

export const getFallbackDownloadUrl = (): string => (
  isTestModeEnabled()
    ? 'https://aicloudsail.longcheer.com:8077/'
    : 'https://aicloudsail.longcheer.com:8077/'
);

export const getSkillStoreUrl = (): string => (
  isTestModeEnabled()
    ? 'https://aicloudsail.longcheer.com:8077/'
    : 'https://aicloudsail.longcheer.com:8077/'
);

// Portal 页面
const PORTAL_BASE_TEST = 'https://aicloudsail.longcheer.com:8077/#';
const PORTAL_BASE_PROD = 'https://aicloudsail.longcheer.com:8077/#';

const getPortalBase = (): string => isTestModeEnabled() ? PORTAL_BASE_TEST : PORTAL_BASE_PROD;

export const getPortalTasksUrl = (): string => `${getPortalBase()}/profile/detail?tab=tasks`;

export const getKitStoreUrl = (): string => (
  isTestModeEnabled()
    ? 'https://aicloudsail.longcheer.com:8077/'
    : 'https://aicloudsail.longcheer.com:8077/'
);

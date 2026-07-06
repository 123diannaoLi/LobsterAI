import { afterEach, expect, test, vi } from 'vitest';

import { configService } from './config';
import {
  getPortalCreditsResetActivityUrl,
  getPortalInvitationUrl,
  getPortalPricingUrl,
  getPortalProfileUrl,
  getPortalRechargeUrl,
  PortalPricingKeyfrom,
} from './endpoints';

const mockTestMode = (testMode: boolean) => {
  vi.spyOn(configService, 'getConfig').mockReturnValue({
    app: { testMode },
  } as ReturnType<typeof configService.getConfig>);
};

afterEach(() => {
  vi.restoreAllMocks();
});

test('portal account urls use production base when test mode is disabled', () => {
  mockTestMode(false);

  expect(getPortalProfileUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/profile');
  expect(getPortalRechargeUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/');
  expect(getPortalInvitationUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/invitation');
  expect(getPortalCreditsResetActivityUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/profile?activity=credits_reset');
});

test('portal account urls use test base when test mode is enabled', () => {
  mockTestMode(true);

  expect(getPortalProfileUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/profile');
  expect(getPortalRechargeUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/');
  expect(getPortalInvitationUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/invitation');
  expect(getPortalCreditsResetActivityUrl()).toBe('https://aicloudsail.longcheer.com:8077/#/profile?activity=credits_reset');
});

test('portal pricing url can include html share keyfrom', () => {
  mockTestMode(false);

  expect(getPortalPricingUrl(PortalPricingKeyfrom.HtmlShare)).toBe(
    'https://aicloudsail.longcheer.com:8077/#/pricing?keyfrom=html_share',
  );
});

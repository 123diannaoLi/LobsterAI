import http from 'http';

const MOCK_SERVER_API_PORT = 17981;
const MOCK_SERVER_API_HOST = '127.0.0.1';

let mockServer: http.Server | null = null;
let mockServerStarted = false;

export const MockServerApiBaseUrl = `http://${MOCK_SERVER_API_HOST}:${MOCK_SERVER_API_PORT}`;
export const MockServerApiConfigValue = 'mock';

const jsonResponse = (
  res: http.ServerResponse,
  statusCode: number,
  body: Record<string, unknown>,
): void => {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
};

const notFound = (res: http.ServerResponse): void => {
  jsonResponse(res, 404, {
    code: 404,
    message: 'Mock server API endpoint not implemented.',
  });
};

const unavailable = (res: http.ServerResponse, feature: string): void => {
  jsonResponse(res, 503, {
    code: 503,
    message: `${feature} is unavailable in the enterprise mock server API.`,
  });
};

const routeMockRequest = (req: http.IncomingMessage, res: http.ServerResponse): void => {
  const url = new URL(req.url || '/', MockServerApiBaseUrl);
  const method = req.method || 'GET';
  const pathname = url.pathname;

  if (method === 'GET' && pathname === '/login') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><html><body>Enterprise mock server API: login is disabled.</body></html>');
    return;
  }

  if (method === 'POST' && (pathname === '/api/auth/exchange' || pathname === '/api/auth/refresh')) {
    jsonResponse(res, 401, {
      code: 401,
      message: 'Authentication is unavailable in the enterprise mock server API.',
    });
    return;
  }

  if (method === 'POST' && pathname === '/api/auth/logout') {
    jsonResponse(res, 200, { code: 0, data: true });
    return;
  }

  if (method === 'GET' && pathname === '/api/user/profile') {
    jsonResponse(res, 200, {
      code: 0,
      data: {
        id: 'enterprise-mock-user',
        name: 'Enterprise Mock User',
      },
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/user/profile-summary') {
    jsonResponse(res, 200, {
      code: 0,
      data: {
        id: 'enterprise-mock-user',
        name: 'Enterprise Mock User',
      },
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/user/quota') {
    jsonResponse(res, 200, {
      code: 0,
      data: {
        planName: 'Enterprise Mock',
        subscriptionStatus: 'free',
        creditsLimit: 0,
        creditsUsed: 0,
        creditsRemaining: 0,
        hasPaidCredits: false,
      },
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/models/pricing-catalog') {
    jsonResponse(res, 200, {
      code: 0,
      data: {
        textModels: [],
        imageModels: [],
        videoModels: [],
      },
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/models/available') {
    jsonResponse(res, 200, { code: 0, data: [] });
    return;
  }

  if (method === 'GET' && (
    pathname === '/api/media/images/models' ||
    pathname === '/api/media/videos/models'
  )) {
    jsonResponse(res, 200, { code: 0, data: [] });
    return;
  }

  if (pathname.startsWith('/api/media/')) {
    unavailable(res, 'Media generation');
    return;
  }

  if (pathname === '/api/asr/realtime/sessions') {
    unavailable(res, 'ASR');
    return;
  }

  if (pathname.startsWith('/api/html-shares')) {
    unavailable(res, 'HTML sharing');
    return;
  }

  notFound(res);
};

export const startMockServerApi = (): string => {
  if (mockServerStarted) return MockServerApiBaseUrl;

  mockServer = http.createServer(routeMockRequest);
  mockServer.on('error', error => {
    console.warn('[MockServerApi] failed to listen:', error);
  });
  mockServer.listen(MOCK_SERVER_API_PORT, MOCK_SERVER_API_HOST, () => {
    mockServerStarted = true;
    console.log(`[MockServerApi] listening at ${MockServerApiBaseUrl}`);
  });
  mockServerStarted = true;
  return MockServerApiBaseUrl;
};

export const stopMockServerApi = (): void => {
  const server = mockServer;
  mockServer = null;
  mockServerStarted = false;
  if (!server) return;
  server.close(error => {
    if (error) {
      console.warn('[MockServerApi] failed to stop:', error);
    }
  });
};

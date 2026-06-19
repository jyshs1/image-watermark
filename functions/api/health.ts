/**
 * Cloudflare Pages Function - Health Check API
 * 
 * This function replaces the Next.js API route for Cloudflare Pages deployment.
 * Endpoint: /api/health
 * 
 * @see https://developers.cloudflare.com/pages/functions/
 */

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  system: {
    platform: string;
    arch: string;
  };
  checks: {
    memory: boolean;
    dependencies: boolean;
  };
}

export async function onRequest(context: EventContext<Env, string, unknown>) {
  const { request, env } = context;

  // Handle HEAD request for simple liveness check
  if (request.method === 'HEAD') {
    return new Response(null, { status: 200 });
  }

  try {
    const healthCheck: HealthCheckResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: 0, // Cloudflare Workers doesn't support process.uptime()
      version: env.APP_VERSION || '1.3.1',
      environment: env.ENVIRONMENT || 'production',
      system: {
        platform: 'cloudflare',
        arch: 'workers',
      },
      checks: {
        memory: true,
        dependencies: true,
      },
    };

    return new Response(JSON.stringify(healthCheck), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
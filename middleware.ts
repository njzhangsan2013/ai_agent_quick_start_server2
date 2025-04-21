import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 配置允许的域，如果需要允许所有域，可以设置为 '*'
const allowedOrigins = '*';

export function middleware(request: NextRequest) {
  // 获取请求的来源
  const origin = request.headers.get('origin') || '';
  
  // 只处理API路由的请求
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // 处理OPTIONS请求（预检请求）
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigins,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400', // 24小时内不再发送预检请求
        },
      });
      return response;
    }
    
    // 处理正常请求
    const response = NextResponse.next();
    
    // 设置CORS头部
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }
  
  return NextResponse.next();
}

// 配置中间件，只在API路由上运行
export const config = {
  matcher: '/api/:path*',
}; 
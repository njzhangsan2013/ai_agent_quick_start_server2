import { NextRequest } from 'next/server';
import { ZegoAIAgent } from '@/lib/zego/aiagent';


// 定义请求体类型
interface RequestBody {
    action: string;
    data?: any;
}

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { action, data } = body;

        const assistant = ZegoAIAgent.getInstance();
        const result = await assistant.sendRequest(action, data);

        return Response.json(result, { status: 200 });
    } catch (error) {
        console.error(`$(action) failed:`, error);
        return Response.json(
            { code: 500, message: `$(action) failed` },
            { status: 500 }
        );
    }
}
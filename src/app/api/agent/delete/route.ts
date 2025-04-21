import { NextRequest } from 'next/server';
import { ZegoAIAgent } from '@/lib/zego/aiagent';

// 定义请求体类型
interface RequestBody {
    agent_instance_id: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { agent_instance_id } = body;
        console.log("delete agent instance:", agent_instance_id);

        const assistant = ZegoAIAgent.getInstance();
        await assistant.deleteAgentInstance(agent_instance_id);

        return Response.json({
            code: 0,
            message: 'delete agent instance success'
        }, { status: 200 });
    } catch (error) {
        console.error('delete agent instance failed:', error);
        return Response.json(
            { code: (error as any).code || 500, message: 'delete agent instance failed' },
            { status: 500 }
        );
    }
}
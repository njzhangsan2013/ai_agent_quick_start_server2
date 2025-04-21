import { NextRequest } from 'next/server';
import { ZegoAIAgent } from '@/lib/zego/aiagent';


// 定义请求体类型
interface RequestBody {
    agent_id: string;
    room_id: string;
    user_id: string;
    user_stream_id: string;
    agent_stream_id: string;
    agent_user_id: string;
    messages?: any[]; // 可选参数，如果不传则从ZIM拉历史消息（请先开通ZIM服务）
}

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { room_id, user_id, user_stream_id, agent_stream_id, agent_user_id, messages, agent_id } = body;
        console.log("create agent instance:", room_id, user_id, user_stream_id, agent_stream_id, agent_user_id, messages);

        const assistant = ZegoAIAgent.getInstance();
        const result = await assistant.createAgentInstance(agent_id, user_id, {
            RoomId: room_id,
            AgentStreamId: agent_stream_id,
            AgentUserId: agent_user_id,
            UserStreamId: user_stream_id
        }, messages || []);

        return Response.json({
            code: 0,
            message: 'create agent instance success',
            agent_instance_id: result
        }, { status: 200 });
    } catch (error) {
        console.error('create agent instance failed:', error);
        return Response.json(
            { code: (error as any).code || 500, message: 'create agent instance failed' },
            { status: 500 }
        );
    }
}
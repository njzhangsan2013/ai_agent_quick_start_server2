import { NextRequest } from 'next/server';
import { ZegoAIAgent } from '@/lib/zego/aiagent';

// 定义请求体类型
interface RequestBody {
    agent_id: string;
    agent_name: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: RequestBody = await req.json();
        const { agent_id, agent_name } = body;
        console.log("register agent:", agent_id, agent_name);

        const assistant = ZegoAIAgent.getInstance();

        const agents = await assistant.queryAgents([agent_id]);
        console.log("agents", agents);
        if (!agents || agents.length === 0 || !agents.find((agent: any) => agent.AgentId === agent_id)) {
            const result = await assistant.registerAgent(agent_id, agent_name);
            console.log("register agent result", result);
        } else {
            console.log("agent already exists");
        }

        return Response.json({
            code: 0,
            message: 'register agent success',
            agent_id: agent_id,
            agent_name: agent_name
        }, { status: 200 });
    } catch (error) {
        console.error('register agent failed:', error);
        return Response.json({
            code: (error as any).code || 500,
            message: 'register agent failed'
        }, { status: 500 });
    }
}

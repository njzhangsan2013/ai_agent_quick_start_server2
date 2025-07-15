import { NextRequest } from "next/server";
import { ZegoAIAgent } from "@/lib/zego/aiagent";
import { AgentStore } from "@/lib/store";

// 定义请求体类型
interface RequestBody {
  agent_id: string;
  agent_name: string;
}

// 这里只是作为最简单的示例。所以以下参数都是固定的。请根据您实际的场景进行动态设置。
function randomId(prefix: string) {
  return prefix + Math.random().toString(36).substring(2, 10);
}
const agent_id = "ai_agent_example_1";
const agent_name = "李浩然";

export async function POST(req: NextRequest) {
  try {
    const assistant = ZegoAIAgent.getInstance();

    const agents = await assistant.queryAgents([agent_id]);
    // console.log("query agents", agents);
    if (
      !agents ||
      agents.length === 0 ||
      !agents.find((agent: any) => agent.AgentId === agent_id)
    ) {
      await assistant.registerAgent(agent_id, agent_name);
      console.log("register agent success");
    } else {
      console.log("agent already exists");
    }

    // 保存 agent_instance_id
    const store = AgentStore.getInstance();
    const existingInstanceId = store.getAgentInstanceId();
    if (existingInstanceId) {
      await assistant.deleteAgentInstance(existingInstanceId);
      store.setAgentInstanceId("");
    }
    const body = await req.json();
    const user_id = body.user_id;
    const room_id = body.room_id;
    const agent_stream_id = randomId("stream_agent_");
    const agent_user_id = randomId("user_agent_");
    const user_stream_id = body.user_stream_id;

    const result = await assistant.createAgentInstance(agent_id, user_id, {
      RoomId: room_id,
      AgentStreamId: agent_stream_id,
      AgentUserId: agent_user_id,
      UserStreamId: user_stream_id,
    });
    const agent_instance_id = result.Data.AgentInstanceId;
    console.log("create agent instance", agent_instance_id);

    return Response.json(
      {
        code: 0,
        message: "start agent success",
        agent_id: agent_id,
        agent_name: agent_name,
        agent_instance_id: agent_instance_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("register agent failed:", error);
    return Response.json(
      {
        code: (error as any).code || 500,
        message:
          (error as any).message || "start agent failed with unknown error",
      },
      { status: 500 }
    );
  }
}

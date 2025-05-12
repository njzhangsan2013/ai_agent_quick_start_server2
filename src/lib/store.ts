export class AgentStore {
    private static instance: AgentStore;
    private agentInstanceId: string;

    private constructor() {
        this.agentInstanceId = "";
    }

    public static getInstance(): AgentStore {
        if (!AgentStore.instance) {
            AgentStore.instance = new AgentStore();
        }
        return AgentStore.instance;
    }

    public setAgentInstanceId(agentInstanceId: string) {
        this.agentInstanceId = agentInstanceId;
    }

    public getAgentInstanceId(): string {
        return this.agentInstanceId;
    }
} 
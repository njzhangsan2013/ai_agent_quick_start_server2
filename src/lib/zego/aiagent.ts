import { createHash } from 'crypto';

export interface RtcInfo {
    RoomId: string;
    AgentStreamId: string;
    AgentUserId: string;
    UserStreamId: string;
}

interface ZegoConfig {
    appId: number;
    serverSecret: string;
}

interface CommonParams {
    AppId: number;
    Signature: string;
    SignatureNonce: string;
    SignatureVersion: string;
    Timestamp: number;
}

interface SignatureParams {
    appId: number;
    signatureNonce: string;
    serverSecret: string;
    timestamp: number;
    action: string;
}

// 会话消息响应类型
export interface ConversationMessagesResponse {
    Code: number;
    Message: string;
    RequestId: string;
    Data: any;
}

export class ZegoAIAgent {
    private static instance: ZegoAIAgent;
    private appId: number;
    private serverSecret: string;
    private baseUrl = 'https://aigc-aiagent-api.zegotech.cn';

    private constructor(config: ZegoConfig) {
        this.appId = config.appId;
        this.serverSecret = config.serverSecret;
    }

    public static getInstance(): ZegoAIAgent {
        if (!ZegoAIAgent.instance) {
            const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
            const serverSecret = process.env.ZEGO_SERVER_SECRET || '';

            if (!appId || !serverSecret) {
                throw new Error('NEXT_PUBLIC_ZEGO_APP_ID and ZEGO_SERVER_SECRET environment variables must be set');
            }

            ZegoAIAgent.instance = new ZegoAIAgent({
                appId,
                serverSecret
            });
        }
        return ZegoAIAgent.instance;
    }

    private generateSignature(params: SignatureParams): string {
        const { appId, signatureNonce, serverSecret, timestamp } = params;
        const str = `${appId}${signatureNonce}${serverSecret}${timestamp}`;
        const hash = createHash('md5');
        hash.update(str);
        return hash.digest('hex');
    }

    private generateCommonParams(action: string): CommonParams {
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureNonce = Math.random().toString(36).substring(2);

        const signature = this.generateSignature({
            appId: this.appId,
            signatureNonce,
            serverSecret: this.serverSecret,
            timestamp,
            action
        });

        return {
            AppId: this.appId,
            SignatureNonce: signatureNonce,
            Timestamp: timestamp,
            SignatureVersion: '2.0',
            Signature: signature
        };
    }

    private buildUrl(action: string, commonParams: CommonParams, baseUrl?: string): string {
        const params = new URLSearchParams({
            Action: action,
            AppId: commonParams.AppId.toString(),
            SignatureNonce: commonParams.SignatureNonce,
            Timestamp: commonParams.Timestamp.toString(),
            SignatureVersion: commonParams.SignatureVersion,
            Signature: commonParams.Signature
        });

        if (baseUrl) {
            return `${baseUrl}/?${params.toString()}`;
        } else {
            return `${this.baseUrl}/?${params.toString()}`;
        }
    }

    private async sendRequest<T>(
        action: string,
        body?: any,
        baseURL?: string,
        method: 'GET' | 'POST' = 'POST'
    ): Promise<T> {
        try {
            const commonParams = this.generateCommonParams(action);
            const url = this.buildUrl(action, commonParams, baseURL);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.Code !== 0) {
                const error = new Error(`ZEGO API error: ${data.Message}`);
                (error as any).code = data.Code;
                throw error;
            }

            return data.Data;
        } catch (error) {
            console.error(`Error in ${action}:`, error);
            throw error;
        }
    }

    async queryAgents(agentIds: string[]) {
        const action = 'QueryAgents';
        const body = {
            AgentIds: agentIds
        };
        const result = await this.sendRequest<any>(action, body);
        console.log("query agents result", result);
        return result.Agents;
    }

    async registerAgent(agentId: string, agentName: string) {
        if (!process.env.LLM_BASE_URL || !process.env.LLM_API_KEY || !process.env.LLM_MODEL) {
            throw new Error('LLM_BASE_URL, LLM_API_KEY and LLM_MODEL environment variables must be set');
        }
        const action = 'RegisterAgent';
        const body = {
            AgentId: agentId,
            Name: agentName,
            LLM: {
                Url: process.env.LLM_BASE_URL || "",
                ApiKey: process.env.LLM_API_KEY || "",
                Model: process.env.LLM_MODEL || ""
            },
            TTS: {
                Vendor: "Bytedance",
                Params: {
                    "app": {
                        "appid": process.env.TTS_BYTEDANCE_APP_ID || "",
                        "token": process.env.TTS_BYTEDANCE_TOKEN || "",
                        "cluster": process.env.TTS_BYTEDANCE_CLUSTER || ""
                    },
                    "speed_ratio": 1,
                    "volume_ratio": 1,
                    "pitch_ratio": 1,
                    "emotion": "happy",
                    "audio": {
                        "rate": 24000,
                        "voice_type": process.env.TTS_BYTEDANCE_VOICE_TYPE || ""
                    }
                },
                FilterText: [{ BeginCharacters: "(", EndCharacters: ")" }, { BeginCharacters: "（", EndCharacters: "）" }, { BeginCharacters: "{", EndCharacters: "}" }],
            }
        };
        return this.sendRequest<any>(action, body);
    }

    async createAgentInstance(agentId: string, userId: string, rtcInfo: RtcInfo, messages?: any[]) {
        const action = 'CreateAgentInstance';
        const body = {
            AgentId: agentId,
            UserId: userId,
            RTC: rtcInfo,
            MessageHistory: messages && messages.length > 0 ? {
                SyncMode: 1,
                Messages: messages,
                WindowSize: 10
            } : undefined
        };
        const result = await this.sendRequest<any>(action, body);
        console.log("create agent instance result", result);
        return result.AgentInstanceId;
    }

    async deleteAgentInstance(agentInstanceId: string) {
        const action = 'DeleteAgentInstance';
        const body = {
            AgentInstanceId: agentInstanceId
        };
        return this.sendRequest(action, body);
    }
}
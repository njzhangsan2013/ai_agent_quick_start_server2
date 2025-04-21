// 公共请求参数类型
export interface CommonParams {
    AppId: number;
    Signature: string;
    SignatureNonce: string;
    SignatureVersion: string;
    Timestamp: number;
  }
  
  // LLM参数类型
  export interface LLM {
    Type: "WenXin" | "Doubao" | "Minimax";
    Model: string;
  }
  
  // TTS扩展参数类型
  export interface ExtensionParams {
    Cluster?: string;
  }
  
  // TTS参数类型
  export interface TTS {
    AccountSource: "Zego" | "Customer";
    Type: "Aliyun" | "Huoshan" | "Minimax";
    Voice: string;
    ExtensionParams?: ExtensionParams;
    IgnoreBracketText?: number[];
    IgnoreCustomBracketText?: string[];
  }
  
  // 自定义Agent配置类型
  export interface CustomAgentConfig {
    AgentTemplateId?: string;
    Name?: string;
    Avatar?: string;
    Intro?: string;
    System?: string;
    LLM?: LLM;
    TTS?: TTS;
    Source?: "Zego" | "Customer";
    Sex?: string;
    WelcomeMessage?: string;
  }
  
  // 聊天配置类型
  export interface ChatConfig {
    LLMSystemMode?: 0 | 1 | 2;
  }
  
  // 会话信息类型
  export interface ConversationInfo {
    ConversationId: string;
    UserId: string;
    AgentId: string;
    AgentTemplateId?: string;
    CustomAgentConfig?: CustomAgentConfig;
    IsChatting: boolean;
  }
  
  // 消息类型
  export interface Message {
    Role: "user" | "assistant";
    Content: string;
  }
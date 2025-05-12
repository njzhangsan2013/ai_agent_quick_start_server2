# AI Agent Server Example Usage Guide

[![English](https://img.shields.io/badge/language-English-blue.svg)](./README.md) [![中文](https://img.shields.io/badge/language-中文-red.svg)](./README_ZH.md)

- [AI Agent Server Example Usage Guide](#ai-agent-server-example-usage-guide)
  - [Run \& Deployment](#run--deployment)
    - [Running Locally](#running-locally)
    - [Deploy to Netlify](#deploy-to-netlify)
    - [Deploy to Vercel](#deploy-to-vercel)
  - [Project Structure](#project-structure)
  - [API Interface Call Examples](#api-interface-call-examples)
    - [Response Format](#response-format)
      - [Success Response](#success-response)
      - [Error Response](#error-response)
      - [Interface-Specific Response Fields](#interface-specific-response-fields)
    - [cURL Examples](#curl-examples)
    - [Android Java Examples](#android-java-examples)
    - [iOS Objective-C Examples](#ios-objective-c-examples)
    - [JavaScript/TypeScript Examples](#javascripttypescript-examples)


## Run & Deployment

### Running Locally

You can install the dependencies locally, start the server, and then have clients connect to the relevant interfaces through the same local network.

1. Install [Node.js 18.18](https://nodejs.org/) or above.
2. Download this repository code to your local machine.
3. Copy the `.env.example` file to `.env` and fill in all environment variable values according to the instructions (such as ZEGO APPID, LLM, TTS).
4. Go to the project root directory and run the following commands to start the service.
```bash
npm install
npm run dev
```

After completion, you can open [http://localhost:3000](http://localhost:3000) to see the running result.

Once running successfully, you can call the following interfaces:
- Get ZEGO Token: `http://localhost:3000/api/zego-token`
- Start talking with AI Agent: `http://localhost:3000/api/start`
- Stop talk with AI Agent: `http://localhost:3000/api/stop`

Note: If you are running the server on a PC/Mac and debugging on mobile devices like Android or iOS, please replace `localhost` with the actual LAN address of your PC/Mac.

### Deploy to Netlify

Please note ⚠️: This method is recommended for users in Mainland China

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ZEGOCLOUD/ai_agent_quick_start_server)

Click the button above to deploy this project to the Netlify platform with one click.
During deployment, you need to import all necessary environment variables. The specific steps are as follows:

1. On the Netlify platform, navigate to `Your Site Instance -> Site configuration -> Environment variables`
2. Click `Add a variable` on the right and select `Import from a .env file`, then copy the following content into the input box (Contents of .env file:), and click `Import variables`.
```bash
# Please replace with your actual content
NEXT_PUBLIC_ZEGO_APP_ID=
ZEGO_SERVER_SECRET=

LLM_API_KEY=
LLM_BASE_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
LLM_MODEL=deepseek-v3-250324

TTS_BYTEDANCE_APP_ID=4******9
TTS_BYTEDANCE_TOKEN=N8I************************stqp
TTS_BYTEDANCE_CLUSTER=volcano_tts
TTS_BYTEDANCE_VOICE_TYPE=zh_female_wanwanxiaohe_moon_bigtts
```
![](./images/import-env.png)
3. Go to the `Deploys` page and click `Trigger deploy` on the right, then select the `Deploy site` option to trigger a website rebuild
![deploy-site.png](./images/deploy-site.png)
4. After deployment is complete, you can see your website's domain on the `Site overview` page.
![](./images/site-overview.png)

Use this domain to access the API interfaces:
- Get ZEGO Token: `https://cute-******.netlify.app/api/zego-token`
- Start talking with AI Agent: `https://cute-******.netlify.app/api/start`
- Stop talk with AI Agent: `https://cute-******.netlify.app/api/stop`

### Deploy to Vercel

Please note ⚠️: Access to Vercel from Mainland China may be problematic. If you can't access it, please use a VPN. After deployment, binding your own domain to the service can also allow normal access (be aware of the risk of domain blocking).

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FZEGOCLOUD%2Fai_agent_quick_start_server&env=NEXT_PUBLIC_ZEGO_APP_ID,ZEGO_SERVER_SECRET,LLM_API_KEY,LLM_BASE_URL,LLM_MODEL,TTS_BYTEDANCE_APP_ID,TTS_BYTEDANCE_TOKEN,TTS_BYTEDANCE_CLUSTER,TTS_BYTEDANCE_VOICE_TYPE&envDescription=这些是启动ZEGO的AI代理服务器所需的环境变量。请查看下方文档获取更多信息。&envLink=https://github.com/zegoim/aiagent-server-quickstart-sample/blob/main/.env.example)

Click the button above to deploy this project to the Vercel platform with one click. During deployment, you need to fill in all necessary environment variables. For detailed explanations of the environment variables, please refer to the [.env.example](.env.example) file.

![](./images/vercel-server.png)

Use this domain to access the API interfaces:
- Get ZEGO Token: `https://****.vercel.app/api/api/zego-token`
- Start talking with AI Agent: `https://****.vercel.app/api/api/start`
- Stop talk with AI Agent: `https://****.vercel.app/api/api/stop`

## Project Structure

The project source code structure is as follows:

```
src
├── app
│   ├── api
│   │   ├── agent
│   │   │   ├── register
│   │   │   │   └── route.ts        # Register AI Agent
│   │   │   ├── create
│   │   │   │   └── route.ts        # Create AI Agent Instance
│   │   │   ├── delete
│   │   │   │   └── route.ts        # Delete AI Agent Instance
│   │   │   └── types.ts            # Type Definitions
│   │   └── zegotoken
│   │       └── route.ts            # ZEGO Token Generation API
└── lib
    ├── logger.ts                   # Logging Tool
    └── zego
        ├── aiagent.ts              # ZEGO AI Agent PaaS Interface Request Logic
        └── token_helper.ts         # ZEGO Token Generation Tool
```

## API Interface Call Examples

This example provides the following main API interfaces:

1. Registration: `/api/agent/register`: Used to register an AI Agent, requires agent_id and agent_name parameters. After registration, instances can be created. It is recommended to call this after APP initialization.
2. Create Instance: `/api/agent/create`: Used to create an AI Agent instance, requires agent_id (the ID used during registration) and room information. After creation, it automatically joins the room to converse with users.
3. Delete Instance: `/api/agent/delete`: Used to delete an AI Agent instance.
4. Get ZEGO Token: `/api/zegotoken`: Used to obtain the token required for ZEGO services.

### Response Format

The return format for all interfaces is unified as JSON, containing the following fields:

#### Success Response
```json
{
  "code": 0,
  "message": "Success message",
  // Other data fields (varies by interface)
}
```

#### Error Response
```json
{
  "code": error_code,  // Non-zero value
  "message": "Error message"
}
```

#### Interface-Specific Response Fields

1. `/api/agent/register` Success Response:
```json
{
  "code": 0,
  "message": "register agent success",
  "agent_id": "registered agent_id",
  "agent_name": "registered agent_name"
}
```

2. `/api/agent/create` Success Response:
```json
{
  "code": 0,
  "message": "create agent instance success",
  "agent_instance_id": "created AI Agent instance ID"
}
```

3. `/api/agent/delete` Success Response:
```json
{
  "code": 0,
  "message": "delete agent instance success"
}
```

4. `/api/zegotoken` Success Response:
```json
{
  "code": 0,
  "message": "delete agent instance success",
  "token": "generated ZEGO token",
  "user_id": "requested user ID",
  "expire_time": expiration timestamp
}
```

Below are examples of calling these interfaces using different programming languages:

### cURL Examples

```bash
# 1. Register AI Agent
curl -X POST https://your-service-domain/api/agent/register \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "your_agent_id",
    "agent_name": "Your Agent Name"
  }'

# 2. Create AI Agent Instance
curl -X POST https://your-service-domain/api/agent/create \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "your_agent_id",
    "room_id": "room123",
    "user_id": "user123",
    "user_stream_id": "stream_user123",
    "agent_stream_id": "stream_agent123",
    "agent_user_id": "agent123"
  }'

# 3. Delete AI Agent Instance
curl -X POST https://your-service-domain/api/agent/delete \
  -H "Content-Type: application/json" \
  -d '{
    "agent_instance_id": "agentInstanceId123"
  }'

# 4. Get ZEGO Token
curl -X GET "https://your-service-domain/api/zegotoken?userId=user123"
```

### Android Java Examples

```java
// Import required packages
import java.io.IOException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;

public class ZegoApiExample {
    private static final String BASE_URL = "https://your-service-domain";
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private static final OkHttpClient client = new OkHttpClient();
    
    // 1. Register AI Agent
    public static void registerAgent(String agentId, String agentName) throws IOException {
        JSONObject json = new JSONObject();
        json.put("agent_id", agentId);
        json.put("agent_name", agentName);
        
        RequestBody body = RequestBody.create(json.toString(), JSON);
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/agent/register")
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
    
    // 2. Create AI Agent Instance
    public static void createAgentInstance(String agentId, String roomId, String userId, String userStreamId, 
                                 String agentStreamId, String agentUserId) throws IOException {
        JSONObject json = new JSONObject();
        json.put("agent_id", agentId);
        json.put("room_id", roomId);
        json.put("user_id", userId);
        json.put("user_stream_id", userStreamId);
        json.put("agent_stream_id", agentStreamId);
        json.put("agent_user_id", agentUserId);
        
        RequestBody body = RequestBody.create(json.toString(), JSON);
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/agent/create")
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
    
    // 3. Delete AI Agent Instance
    public static void deleteAgentInstance(String agentInstanceId) throws IOException {
        JSONObject json = new JSONObject();
        json.put("agent_instance_id", agentInstanceId);
        
        RequestBody body = RequestBody.create(json.toString(), JSON);
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/agent/delete")
                .post(body)
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
    
    // 4. Get ZEGO Token
    public static void getZegoToken(String userId) throws IOException {
        Request request = new Request.Builder()
                .url(BASE_URL + "/api/zegotoken?userId=" + userId)
                .get()
                .build();
        
        try (Response response = client.newCall(request).execute()) {
            System.out.println(response.body().string());
        }
    }
}
```

### iOS Objective-C Examples

```objective-c
#import <Foundation/Foundation.h>

@interface ZegoApiExample : NSObject

+ (void)registerAgentWithId:(NSString *)agentId name:(NSString *)agentName;
+ (void)createAgentWithId:(NSString *)agentId
                   roomId:(NSString *)roomId
                   userId:(NSString *)userId
             userStreamId:(NSString *)userStreamId
           agentStreamId:(NSString *)agentStreamId
             agentUserId:(NSString *)agentUserId;
+ (void)deleteAgentWithInstanceId:(NSString *)agentInstanceId;
+ (void)getZegoTokenWithUserId:(NSString *)userId;

@end

@implementation ZegoApiExample

// Base URL
static NSString *const kBaseUrl = @"https://your-service-domain";

// 1. Register AI Agent
+ (void)registerAgentWithId:(NSString *)agentId name:(NSString *)agentName {
    NSURL *url = [NSURL URLWithString:[kBaseUrl stringByAppendingString:@"/api/agent/register"]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *body = @{
        @"agent_id": agentId,
        @"agent_name": agentName
    };
    
    NSError *error;
    NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body 
                                                       options:0 
                                                         error:&error];
    if (error) {
        NSLog(@"JSON serialization error: %@", error);
        return;
    }
    
    [request setHTTPBody:bodyData];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON parsing error: %@", jsonError);
                return;
            }
            
            NSLog(@"Register Agent success: %@", json);
        } else {
            NSLog(@"Request failed, status code: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

// 2. Create AI Agent Instance
+ (void)createAgentWithId:(NSString *)agentId
                   roomId:(NSString *)roomId
                   userId:(NSString *)userId
             userStreamId:(NSString *)userStreamId
           agentStreamId:(NSString *)agentStreamId
             agentUserId:(NSString *)agentUserId {
    NSURL *url = [NSURL URLWithString:[kBaseUrl stringByAppendingString:@"/api/agent/create"]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *body = @{
        @"agent_id": agentId,
        @"room_id": roomId,
        @"user_id": userId,
        @"user_stream_id": userStreamId,
        @"agent_stream_id": agentStreamId,
        @"agent_user_id": agentUserId
    };
    
    NSError *error;
    NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body 
                                                       options:0 
                                                         error:&error];
    if (error) {
        NSLog(@"JSON serialization error: %@", error);
        return;
    }
    
    [request setHTTPBody:bodyData];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON parsing error: %@", jsonError);
                return;
            }
            
            NSLog(@"Create Agent instance success: %@", json);
        } else {
            NSLog(@"Request failed, status code: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

// 3. Delete AI Agent Instance
+ (void)deleteAgentWithInstanceId:(NSString *)agentInstanceId {
    NSURL *url = [NSURL URLWithString:[kBaseUrl stringByAppendingString:@"/api/agent/delete"]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSDictionary *body = @{
        @"agent_instance_id": agentInstanceId
    };
    
    NSError *error;
    NSData *bodyData = [NSJSONSerialization dataWithJSONObject:body 
                                                       options:0 
                                                         error:&error];
    if (error) {
        NSLog(@"JSON serialization error: %@", error);
        return;
    }
    
    [request setHTTPBody:bodyData];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON parsing error: %@", jsonError);
                return;
            }
            
            NSLog(@"Delete Agent instance success: %@", json);
        } else {
            NSLog(@"Request failed, status code: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

// 4. Get ZEGO Token
+ (void)getZegoTokenWithUserId:(NSString *)userId {
    NSString *urlString = [NSString stringWithFormat:@"%@/api/zegotoken?userId=%@", kBaseUrl, userId];
    NSURL *url = [NSURL URLWithString:urlString];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];
    
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:request 
                                            completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error: %@", error);
            return;
        }
        
        NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
        if (httpResponse.statusCode == 200) {
            NSError *jsonError;
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data 
                                                                 options:0 
                                                                   error:&jsonError];
            if (jsonError) {
                NSLog(@"JSON parsing error: %@", jsonError);
                return;
            }
            
            NSLog(@"Get Token success: %@", json);
        } else {
            NSLog(@"Request failed, status code: %ld", (long)httpResponse.statusCode);
        }
    }];
    
    [task resume];
}

@end
```

### JavaScript/TypeScript Examples

```javascript
// Base URL
const BASE_URL = 'https://your-service-domain';

// 1. Register AI Agent
async function registerAgent(agentId, agentName) {
  try {
    const response = await fetch(`${BASE_URL}/api/agent/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        agent_name: agentName
      }),
    });
    
    const data = await response.json();
    console.log('Register AI Agent result:', data);
    return data;
  } catch (error) {
    console.error('Register AI Agent failed:', error);
    throw error;
  }
}

// 2. Create AI Agent Instance
async function createAgentInstance(agentId, roomId, userId, userStreamId, agentStreamId, agentUserId, messages = []) {
  try {
    const response = await fetch(`${BASE_URL}/api/agent/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        room_id: roomId,
        user_id: userId,
        user_stream_id: userStreamId,
        agent_stream_id: agentStreamId,
        agent_user_id: agentUserId,
        messages: messages
      }),
    });
    
    const data = await response.json();
    console.log('Create AI Agent instance result:', data);
    return data;
  } catch (error) {
    console.error('Create AI Agent instance failed:', error);
    throw error;
  }
}

// 3. Delete AI Agent Instance
async function deleteAgentInstance(agentInstanceId) {
  try {
    const response = await fetch(`${BASE_URL}/api/agent/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_instance_id: agentInstanceId
      }),
    });
    
    const data = await response.json();
    console.log('Delete AI Agent instance result:', data);
    return data;
  } catch (error) {
    console.error('Delete AI Agent instance failed:', error);
    throw error;
  }
}

// 4. Get ZEGO Token
async function getZegoToken(userId) {
  try {
    const response = await fetch(`${BASE_URL}/api/zegotoken?userId=${userId}`, {
      method: 'GET',
    });
    
    const data = await response.json();
    console.log('Get ZEGO Token result:', data);
    return data;
  } catch (error) {
    console.error('Get ZEGO Token failed:', error);
    throw error;
  }
}
```

Please modify the `BASE_URL` and related parameters in the above examples according to your actual situation. In actual development, you may also need to add error handling, retry mechanisms, authorization verification, and other features to ensure the reliability and security of API calls.

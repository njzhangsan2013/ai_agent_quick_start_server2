import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // 解析请求体
        const data = await request.json();
        
        if (data.Event === 'UserSpeakAction') {
            console.log(`检测到用户说话事件: ${data.Event}, 说话状态:`, data.Action);
        } else if (data.Event === 'AgentSpeakAction') {
            console.log(`检测到智能体说话事件: ${data.Event}, 说话状态:`, data.Action);
        }else {
            // 打印回调内容
            console.log('收到回调数据:', data);
        }

        // 返回 200 状态码表示接收成功
        return NextResponse.json({ message: '回调接收成功' }, { status: 200 });
    } catch (error) {
        console.error('处理回调请求时出错:', error);
        // 返回 500 状态码表示处理出错
        return NextResponse.json({ message: '处理回调请求时出错' }, { status: 500 });
    }
}
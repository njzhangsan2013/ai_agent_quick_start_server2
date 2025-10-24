const { createCipheriv } = require('crypto');

const ErrorCode = {
    success: 0, // "success"
    appIDInvalid: 1, // "appID invalid"
    userIDInvalid: 3, // "userID invalid"
    secretInvalid: 5, // "secret must be a 32 byte string"
    effectiveTimeInSecondsInvalid: 6, // "effectiveTimeInSeconds invalid"
};

const KPrivilegeKey = {
    PrivilegeKeyLogin: 1,
    PrivilegeKeyPublish: 2
};

const KPrivilegeVal = {
    PrivilegeEnable: 1,
    PrivilegeDisable: 0
};

const RndNum = (a, b) => {
    return Math.ceil((a + (b - a)) * Math.random());
};

// 生成 int32 范围的随机数
function makeNonce() {
    return RndNum(-2147483648, 2147483647);
}

function makeRandomIv() {
    const str = '0123456789abcdefghijklmnopqrstuvwxyz';
    const result = [];
    for (let i = 0; i < 16; i++) {
        const r = Math.floor(Math.random() * str.length);
        result.push(str.charAt(r));
    }
    return result.join('');
}

// 根据密钥长度确定算法, 只支持16 24 32 位
function getAlgorithm(keyBase64) {
    const key = Buffer.from(keyBase64);
    switch (key.length) {
        case 16:
            return 'aes-128-cbc';
        case 24:
            return 'aes-192-cbc';
        case 32:
            return 'aes-256-cbc';
    }

    throw new Error('Invalid key length: ' + key.length);
}

// AES加密，使用模式: CBC/PKCS5Padding
function aesEncrypt(plainText, key, iv) {
    const cipher = createCipheriv(getAlgorithm(key), key, iv);
    cipher.setAutoPadding(true);
    const encrypted = cipher.update(plainText);
    const final = cipher.final();
    const out = Buffer.concat([encrypted, final]);

    return Uint8Array.from(out).buffer;
}

function generateToken04(appId, userId, secret, effectiveTimeInSeconds, payload) {
    if (!appId || typeof appId !== 'number') {
        throw {
            errorCode: ErrorCode.appIDInvalid,
            errorMessage: 'appID invalid',
        };
    }

    if (!userId || typeof userId !== 'string') {
        throw {
            errorCode: ErrorCode.userIDInvalid,
            errorMessage: 'userId invalid',
        };
    }

    if (!secret || typeof secret !== 'string' || secret.length !== 32) {
        throw {
            errorCode: ErrorCode.secretInvalid,
            errorMessage: 'secret must be a 32 byte string',
        };
    }

    if (!effectiveTimeInSeconds || typeof effectiveTimeInSeconds !== 'number') {
        throw {
            errorCode: ErrorCode.effectiveTimeInSecondsInvalid,
            errorMessage: 'effectiveTimeInSeconds invalid',
        };
    }

    const createTime = Math.floor(new Date().getTime() / 1000);
    const tokenInfo = {
        app_id: appId,
        user_id: userId,
        nonce: makeNonce(),
        ctime: createTime,
        expire: createTime + effectiveTimeInSeconds,
        payload: payload || ''
    };

    // 把token信息转成json
    const plaintText = JSON.stringify(tokenInfo);
    console.log('plain text: ', plaintText);

    // 随机生成的 16 字节串，用作 AES 加密向量，放在密文前一起做Base64编码生成最终 token
    const iv = makeRandomIv();
    console.log('iv', iv);

    /// 进行加密
    const encryptBuf = aesEncrypt(plaintText, secret, iv);

    // token 二进制拼接  过期时间 + Base64(iv长度 + iv + 加密信息长度 + 加密信息)
    const b1 = new Uint8Array(8);
    const b2 = new Uint8Array(2);
    const b3 = new Uint8Array(2);
    
    new DataView(b1.buffer).setBigInt64(0, BigInt(tokenInfo.expire), false);
    new DataView(b2.buffer).setUint16(0, iv.length, false);
    new DataView(b3.buffer).setUint16(0, encryptBuf.byteLength, false);
    
    const buf = Buffer.concat([
        Buffer.from(b1),
        Buffer.from(b2),
        Buffer.from(iv),
        Buffer.from(b3),
        Buffer.from(encryptBuf),
    ]);
    
    const dv = new DataView(Uint8Array.from(buf).buffer);
    // 打包数据
    // console.log('-----------------');
    // console.log('-------getBigInt64----------', dv.getBigInt64(0));
    // console.log('-----------------');
    // console.log('-------getUint16----------', dv.getUint16(8));
    // console.log('-----------------');
    return '04' + Buffer.from(dv.buffer).toString('base64');
}

module.exports = {
    generateToken04,
    ErrorCode,
    KPrivilegeKey,
    KPrivilegeVal
};

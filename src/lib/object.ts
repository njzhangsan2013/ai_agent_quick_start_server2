/**
 * 判断两个对象是否相等
 * @param obj1
 * @param obj2
 * @returns
 */
export function isEqual(obj1: any, obj2: any) {
    // 检查是否为同一引用
    if (obj1 === obj2) {
        return true;
    }

    // 检查是否为 null 或非对象类型
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

    // 检查数组情况
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) return false;
        for (let i = 0; i < obj1.length; i++) {
            if (!isEqual(obj1[i], obj2[i])) return false;
        }
        return true;
    }

    // 检查对象情况
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

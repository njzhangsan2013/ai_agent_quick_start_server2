export function parseJSON<T = any>(jsonStr: string): T | null {
    try {
        return JSON.parse(jsonStr) as T
    } catch (error) {
        console.error(error)
        return null
    }
}

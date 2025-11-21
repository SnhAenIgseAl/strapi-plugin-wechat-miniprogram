export const useFetch = (
    url: string,
    option: RequestInit = {},
) => {
    return new Promise<any>((resolve, reject) => {
        fetch(url, option)
        .then(res => {
            if (res.ok) {
                resolve(res.json() as any)
            } else {
                reject(res.statusText)
            }
        })
    })
}
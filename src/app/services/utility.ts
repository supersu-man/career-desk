
export const openUrl = (url: string) => {
    const api = (window as any).api;
    api.openUrl(url)
}

export const openUrlBrowser = (url: string) => {
    const api = (window as any).api;
    api.openUrlBrowser(url)
}
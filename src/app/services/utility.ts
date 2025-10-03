
export const openUrl = (url: string) => {
    const api = (window as any).api;
    api.openUrl(url)
}
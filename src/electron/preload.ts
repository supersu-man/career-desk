import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    getCompanies: () => ipcRenderer.invoke('get-companies'),
    fetchJobs: (companyId: string, options: any) => ipcRenderer.invoke('fetch-jobs', companyId, options),
    openUrl: (url: string) => ipcRenderer.send('open-url', url)
})

contextBridge.exposeInMainWorld('storage', {
    getSavedJobs: () => ipcRenderer.invoke('get-saved-jobs'),
    toggleSaveJob: (company: any) => ipcRenderer.invoke('toggle-save-job', company),
})
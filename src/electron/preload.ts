import { contextBridge, ipcRenderer } from 'electron'
// Expose ipcRenderer.invoke via preload
contextBridge.exposeInMainWorld('api', {
    getCompanies: () => ipcRenderer.invoke('get-companies'),
    fetchJobs: (companyId: string, options: any) => ipcRenderer.invoke('fetch-jobs', companyId, options)
})
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    getCompanies: () => ipcRenderer.invoke('get-companies'),
    getCountries: (companyId: string) => ipcRenderer.invoke('get-countries', companyId),
    fetchJobs: (companyId: string, options: any) => ipcRenderer.invoke('fetch-jobs', companyId, options),
    openUrl: (url: string) => ipcRenderer.send('open-url', url)
})

contextBridge.exposeInMainWorld('storage', {
    getSavedJobs: () => ipcRenderer.invoke('get-saved-jobs'),
    getAppliedJobs: () => ipcRenderer.invoke('get-applied-jobs'),
    toggleJob: (company: any, type: string) => ipcRenderer.invoke('toggle-job', company, type),
})
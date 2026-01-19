import { contextBridge, ipcRenderer } from 'electron';
import { Company, CompanyPreference, ElectronAPI, JobPosting, ScraperOptions } from './interface';

const api: ElectronAPI = {
    getCompanies: (): Promise<Company[]> => ipcRenderer.invoke(IpcChannel.GetCompanies),
    getCountries: (companyId: string): Promise<{name: string, value: string}[]> => ipcRenderer.invoke(IpcChannel.GetCountries, companyId),
    fetchJobs: (companyId: string, options: ScraperOptions): Promise<JobPosting[]> => ipcRenderer.invoke(IpcChannel.FetchJobs, companyId, options),
    openUrl: (url: string) => ipcRenderer.send(IpcChannel.OpenUrl, url),
    openUrlBrowser: (url: string) => ipcRenderer.send(IpcChannel.OpenUrlBrowser, url),

    getSavedJobs: (): Promise<JobPosting[]> => ipcRenderer.invoke(IpcChannel.GetSavedJobs),
    getAppliedJobs: (): Promise<JobPosting[]> => ipcRenderer.invoke(IpcChannel.GetAppliedJobs),
    toggleJob: (job: JobPosting, type: 'save' | 'apply'): Promise<boolean> => ipcRenderer.invoke(IpcChannel.ToggleJob, job, type),

    getPreferences: (): Promise<CompanyPreference[]> => ipcRenderer.invoke(IpcChannel.GetPreferences),
    savePreferences: (prefs: CompanyPreference[]) => ipcRenderer.send(IpcChannel.SavePreferences, prefs),
    onUpdateProgress: (callback: (percent: number) => void) => ipcRenderer.on(IpcChannel.OnUpdateProgress, (event, percent) => callback(percent)),
};

contextBridge.exposeInMainWorld('api',  api)

enum IpcChannel {
    GetCompanies = 'get-companies',
    GetCountries = 'get-countries',
    FetchJobs = 'fetch-jobs',
    OpenUrl = 'open-url',
    OpenUrlBrowser = 'open-url-browser',
    GetSavedJobs = 'get-saved-jobs',
    GetAppliedJobs = 'get-applied-jobs',
    ToggleJob = 'toggle-job',
    GetPreferences = 'get-preferences',
    SavePreferences = 'save-preferences',
    OnUpdateProgress = 'on-update-progress'
}
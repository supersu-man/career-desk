import { contextBridge, ipcRenderer } from 'electron';
import { Company, ElectronAPI, JobPosting, ScraperOptions, Preferences } from './interface';

const api: ElectronAPI = {
    getCompanies: (): Promise<Company[]> => ipcRenderer.invoke(IpcChannel.GetCompanies),
    getCountries: (companyId: string): Promise<{name: string, value: string}[]> => ipcRenderer.invoke(IpcChannel.GetCountries, companyId),
    fetchJobs: (companyId: string, options: ScraperOptions): Promise<JobPosting[]> => ipcRenderer.invoke(IpcChannel.FetchJobs, companyId, options),
    openUrl: (url: string) => ipcRenderer.send(IpcChannel.OpenUrl, url),
    openUrlBrowser: (url: string) => ipcRenderer.send(IpcChannel.OpenUrlBrowser, url),

    toggleSaveJob: (job: JobPosting): void => ipcRenderer.send(IpcChannel.ToggleSaveJob, job),
    getSavedJobs: (): Promise<JobPosting[]> => ipcRenderer.invoke(IpcChannel.GetSavedJobs),
    
    applyJob: (job: JobPosting): void => ipcRenderer.send(IpcChannel.ApplyJob, job),
    getAppliedJobs: (): Promise<JobPosting[]> => ipcRenderer.invoke(IpcChannel.GetAppliedJobs),

    onUpdateProgress: (callback: (percent: number) => void) => ipcRenderer.on(IpcChannel.OnUpdateProgress, (event, percent) => callback(percent)),
    
    getPreferences: (): Promise<Preferences> => ipcRenderer.invoke(IpcChannel.GetPreferences),
    savePreferences: (prefs: Preferences) => ipcRenderer.send(IpcChannel.SavePreferences, prefs),
    getNewPostings: () => ipcRenderer.invoke(IpcChannel.GetNewPostings),
    saveNewPostings: (postings: JobPosting[]) => ipcRenderer.send(IpcChannel.SaveNewPostings, postings),
};

contextBridge.exposeInMainWorld('api',  api)

enum IpcChannel {
    GetCompanies = 'get-companies',
    GetCountries = 'get-countries',
    FetchJobs = 'fetch-jobs',
    OpenUrl = 'open-url',
    OpenUrlBrowser = 'open-url-browser',
    ToggleSaveJob = 'toggle-save-job',
    GetSavedJobs = 'get-saved-jobs',
    ApplyJob = 'apply-job',
    GetAppliedJobs = 'get-applied-jobs',
    OnUpdateProgress = 'on-update-progress',
    GetPreferences = 'get-preferences',
    SavePreferences = 'save-preferences',
    GetNewPostings = 'get-new-postings',
    SaveNewPostings = 'save-new-postings',
}
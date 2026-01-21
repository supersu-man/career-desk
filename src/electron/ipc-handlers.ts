import { ipcMain, shell } from "electron"
import { FileStorage } from "./storage"
import companiesJson from './companies.json';
import { scrapers } from './scrapers';
import { WindowManager } from './window-manager';
import { IpcChannel } from './enums';
import { Company, JobPosting, ScraperOptions, CompanyPreference } from "./interface";
import countries from './config/countries.json';

const companies = companiesJson as unknown as Company[];

export const setupIpcHandlers = (storage: FileStorage) => {
    ipcMain.handle(IpcChannel.GetCompanies, () => companies);

    ipcMain.handle(IpcChannel.GetCountries, (_, companyId: string) => {
        const company = companies.find(c => c.id === companyId);
        if (!company) throw new Error("Company not found");
        return (countries as any)[companyId] || (countries as any)[company.type] || []
    })

    ipcMain.handle(IpcChannel.FetchJobs, async (_, companyId: string, options: ScraperOptions) => {
        const company = companies.find(c => c.id === companyId);
        if (!company) throw new Error("Company not found");

        const scraper = scrapers[company.type as keyof typeof scrapers];
        if (!scraper) throw new Error("No scraper for this type");

        console.log(`Scraping ${company.companyName}`)
        const jobs = await scraper(company, options);
        const savedUrls = new Set(storage.getSavedJobs().map(j => j.url));
        const appliedUrls = new Set(storage.getAppliedJobs().map(j => j.url));
        return jobs.map(job => ({
            ...job,
            saved: savedUrls.has(job.url),
            applied: appliedUrls.has(job.url)
        }));
    });

    ipcMain.on(IpcChannel.OpenUrl, (event, url: string) => {
        WindowManager.createExternalWindow(url);
    });

    ipcMain.on(IpcChannel.OpenUrlBrowser, (event, url: string) => {
        shell.openExternal(url)
    })

    ipcMain.handle(IpcChannel.GetSavedJobs, () => {
        return storage.getSavedJobs()
    });

    ipcMain.handle(IpcChannel.ToggleJob, (_, job: JobPosting, type: 'save' | 'apply') => {
        return storage.toggleJob(job, type)
    });

    ipcMain.handle(IpcChannel.GetAppliedJobs, () => {
        return storage.getAppliedJobs()
    });

    ipcMain.handle(IpcChannel.GetPreferences, () => {
        return storage.getPreferences()
    });

    ipcMain.on(IpcChannel.SavePreferences, (_, prefs: CompanyPreference[]) => {
        storage.savePreferences(prefs)
    });
}
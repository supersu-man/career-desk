export interface Company {
  id: string;
  companyName: string;
  type: string;
  endpoint: string;
  site: string;
}

export interface Preferences {
  searchQuery: string;
  companyPreferences: CompanyPreference[];
  autoFetchSettings: AutoFetchSettings;
}

export interface CompanyPreference {
  companyId: string;
  enabled: boolean;
  defaultCountry?: string;
}

export interface AutoFetchSettings {
  enabled: boolean;
  interval: 30 | 60 | 360; // minutes
}

export interface ScraperOptions {
  query?: string;
  offset?: number;
  limit?: number;
  country?: string;
}

export interface JobPosting {
  title: string;
  location?: string;
  department?: string;
  postedOn?: string;
  url: string;
  saved: boolean;
  applied: boolean;
  company: string
}

export type ScraperFn = (company: any, options: ScraperOptions) => Promise<JobPosting[]>;

export interface ElectronAPI {
  getCompanies: () => Promise<Company[]>;
  getCountries: (companyId: string) => Promise<{ name: string, value: string }[]>;
  fetchJobs: (companyId: string, options: ScraperOptions) => Promise<JobPosting[]>;
  openUrl: (url: string) => void;
  openUrlBrowser: (url: string) => void;

  toggleSaveJob: (job: JobPosting) => void;
  getSavedJobs: () => Promise<JobPosting[]>;
  applyJob: (job: JobPosting) => void;
  getAppliedJobs: () => Promise<JobPosting[]>;
  
  onUpdateProgress: (callback: (percent: number) => void) => void;
  
  getPreferences: () => Promise<Preferences>;
  savePreferences: (prefs: Preferences) => void;

  getNewPostings: () => Promise<JobPosting[]>;
  saveNewPostings: (postings: JobPosting[]) => void;
}
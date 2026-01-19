export interface Company {
  id: string;
  companyName: string;
  type: string;
  endpoint: string;
  site: string;
}

export interface CompanyPreference {
  companyId: string;
  enabled: boolean;
  defaultCountry?: string;
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

  getSavedJobs: () => Promise<JobPosting[]>;
  getAppliedJobs: () => Promise<JobPosting[]>;
  toggleJob: (job: JobPosting, type: 'save' | 'apply') => Promise<boolean>;

  getPreferences: () => Promise<CompanyPreference[]>;
  savePreferences: (prefs: CompanyPreference[]) => void;

  onUpdateProgress: (callback: (percent: number) => void) => void;
}
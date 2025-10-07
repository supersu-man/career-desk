export interface Company {
    id: string;
    companyName: string;
    type: string;
    endpoint: string;
    site: string;
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

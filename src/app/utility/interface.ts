export interface Company {
    id: string;
    companyName: string;
    type: string;
    endpoint: string;
    site: string;
}

export interface JobPosting {
  title: string;
  location?: string;
  department?: string;
  postedOn?: string;
}

import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";

export async function scrapeAccenture(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    const headers = {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary22uERZWB7SJBY6Dx",
        "Referer": "https://www.accenture.com/in-en/careers/jobsearch?jk=software&sb=0"
    }
    const body = { startIndex: 0, maxResultSize: 12, jobKeyword: options.query || "", jobCountry: "India", jobLanguage: "en", countrySite: "in-en", sortBy: 0, searchType: "vectorSearch", minScore: 0.6, jobFilters: [] }
    const response = await axios.post(company.endpoint, body, { headers })
    const jobs = response.data.data
    return jobs.map((job: any): JobPosting => ({
        title: job.title,
        company: company.companyName,
        url: `${company.site}/jobdetails?id=${job.guid}`,
        saved: false,
        applied: false,
        location: job.feedCity
    }))
}

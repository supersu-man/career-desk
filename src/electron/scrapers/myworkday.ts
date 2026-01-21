import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";

export async function scrapeWorkday(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    const body: any = {
        appliedFacets: {},
        limit: 20,
        offset: 0
    }
    if (options.query) body.searchText = options.query
    if(options.country) body.appliedFacets.locationCountry = [options.country]
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    const response = await axios.post(company.endpoint, body, { headers });
    return response.data.jobPostings.map((job: any): JobPosting => ({
        title: job.title,
        location: job.locationsText,
        postedOn: job.postedOn,
        url: company.site + job.externalPath,
        saved: false,
        applied: false,
        company: company.companyName
    }));
}

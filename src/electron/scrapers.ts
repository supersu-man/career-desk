import axios from "axios";
import { Company, JobPosting, ScraperFn, ScraperOptions } from "./interface";

export const scrapers: Record<string, ScraperFn> = {
    myworkday: scrapeWorkday,
    verizon: scrapeVerizon,
};

async function scrapeWorkday(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log("Scraping workday")
    const body: any = {
        appliedFacets: {},
        limit: 20,
        offset: 0
    }
    if(options.query) body.searchText = options.query
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
        url: company.site + job.externalPath
    }));
}

function scrapeVerizon(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    return [] as any
}
import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";

export async function scrapeAmazon(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const params: any = { offset: 0, result_limit: 20, sort: "relevant" }
    if (options.country) params.country = options.country
    if (options.query) params.base_query = options.query
    const response = await axios.get(company.endpoint, { params, headers })
    const jobs = response.data.jobs
    return jobs.map((job: any): JobPosting => ({
        title: job.title,
        url: company.site + job.job_path,
        saved: false,
        applied: false,
        company: company.companyName,
        location: job.normalized_location,
        postedOn: job.posted_date
    }))
}

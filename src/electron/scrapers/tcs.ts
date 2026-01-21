import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";

export async function scrapeTCS(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    const body = { "jobCity": null, "jobSkill": null, "pageNumber": "1", "userText": options.query || "", "jobTitleOrder": null, "jobCityOrder": null, "jobFunctionOrder": null, "jobExperienceOrder": null, "applyByOrder": null, "regular": true, "walkin": true }
    const response = await axios.post(company.endpoint, body)
    const jobs = response.data.data.jobs
    return jobs.map((job: any): JobPosting => ({
        title: job.jobTitle,
        url: `${company.site}/${job.id}`,
        location: job.location,
        saved: false,
        applied: false,
        company: company.companyName
    }))
}

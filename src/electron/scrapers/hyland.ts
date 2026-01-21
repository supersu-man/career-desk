import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";
import * as cheerio from 'cheerio';

export async function scrapeHyland(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const params: any = { in_iframe: 1 }
    if (options.country) params.searchLocation = options.country
    if (options.query) params.searchKeyword = options.query
    const response = await axios.get(company.endpoint, { params, headers })
    const $ = cheerio.load(response.data)
    const jobs: JobPosting[] = []
    $('.iCIMS_JobsTable .row').each((_, el) => {
        const href = $(el).find('a').attr('href') as string;
        const title = $(el).find('h3').text()
        const location = $(el).find('.iCIMS_JobHeaderTag .iCIMS_JobHeaderData').eq(2).text().trim()
        jobs.push({
            title: title,
            url: href,
            location: location,
            saved: false,
            applied: false,
            company: company.companyName
        })
    })
    return jobs
}

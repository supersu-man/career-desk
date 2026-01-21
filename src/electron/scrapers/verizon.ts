import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";
import * as cheerio from 'cheerio';

export async function scrapeVerizon(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log("Scraping Verizon")
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const params: any = {}
    if (options.query) params["search"] = options.query
    if (options.country) params["country"] = options.country
    const response = await axios.get(company.endpoint, { headers, params })
    const $ = cheerio.load(response.data)

    const jobs: JobPosting[] = []

    $('#js-job-search-results .card-job').each((_, el) => {
        const anchor = $(el).find('h2.card-title > a');
        const title = anchor.text().trim();
        const link = company.site + (anchor.attr('href') ?? '');

        const jobmeta = $(el).find('ul.job-meta > li').first().text().trim();

        jobs.push({
            title,
            location: jobmeta,
            url: link,
            saved: false,
            applied: false,
            company: company.companyName
        });
    });
    return jobs
}
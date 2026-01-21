import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";
import * as cheerio from 'cheerio';

export async function scrapeEA(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const endpoint = company.endpoint + "/" + (options.query ?? '');
    const params: any = {}
    if (options.country) params['8171'] = options.country
    const response = await axios.get(endpoint, { headers, params })
    const $ = cheerio.load(response.data)

    const jobs: JobPosting[] = []

    $('.results.results--listed article').each((_, el) => {
        const title = $(el).find('.article__header__text__title').text().trim();
        const location = $(el).find('.list-item-location').text().trim();
        const link = $(el).find('.article__footer > a').attr('href') as string;

        jobs.push({
            title,
            location,
            url: link,
            saved: false,
            applied: false,
            company: company.companyName
        });
    });

    return jobs
}

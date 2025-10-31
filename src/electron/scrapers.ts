import axios from "axios";
import { Company, JobPosting, ScraperFn, ScraperOptions } from "./interface";
import * as cheerio from 'cheerio';

export const scrapers: Record<string, ScraperFn> = {
    myworkday: scrapeWorkday,
    verizon: scrapeVerizon,
    ea: scrapeEA,
    ibm: scrapeIBM,
    amazon: scrapeAmazon,
    hyland: scrapeHyland,
    tcs: scrapeTCS
};

async function scrapeWorkday(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log(`Scraping ${company.companyName}`)
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

async function scrapeVerizon(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log("Scraping Verizon")
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const params: any = {}
    if (options.query) params.search = options.query
    if (options.country) params.country = options.country
    const response = await axios.get(company.endpoint, { headers, params })
    const $ = cheerio.load(response.data)

    const jobs: JobPosting[] = []

    $('#js-job-search-results .card-job').each((_, el) => {
        const anchor = $(el).find('h3.card-title > a');
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

async function scrapeEA(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log("Scraping EA")
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

async function scrapeIBM(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log("Scraping IBM")
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const body: any = { "appId": "careers", "scopes": ["careers2"], "query": { "bool": { "must": [] as any } }, "size": 30, "lang": "zz", "sm": { "query": "", "lang": "zz" }, "_source": ["_id", "title", "url", "description", "language", "entitled", "field_keyword_17", "field_keyword_08", "field_keyword_18", "field_keyword_19"] }
    if (options.query) {
        body.query.bool.must.push({
            "simple_query_string": {
                "query": options.query,
                "fields": ["keywords^1", "body^1", "url^2", "description^2", "h1s_content^2", "title^3", "field_text_01"]
            }
        })
        body.sm.query = options.query
    }
    if (options.country) {
        body.post_filter = { "term": { "field_keyword_05": options.country } }
        body.aggs = {
            "field_keyword_172": { "filter": { "term": { "field_keyword_05": options.country } } },
            "field_keyword_083": { "filter": { "term": { "field_keyword_05": options.country } } },
            "field_keyword_184": { "filter": { "term": { "field_keyword_05": options.country } } }
        }
    }
    const response = await axios.post(company.endpoint, body, { headers })
    const hits = response.data.hits.hits as any[]
    const jobs: JobPosting[] = []
    hits.forEach(hit => {
        jobs.push({
            title: hit._source.title,
            location: hit._source.field_keyword_19,
            company: company.companyName,
            url: hit._source.url,
            saved: false,
            applied: false,
        })
    })
    return jobs
}

async function scrapeAmazon(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log("Scraping Amazon")
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const params: any = { offset: 0, result_limit: 20, sort: "relevant" }
    if(options.country) params.country = options.country
    if(options.query) params.base_query = options.query
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


async function scrapeHyland(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log(`Scraping ${company.companyName}`)
    const headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }
    const params: any = { in_iframe: 1 }
    if(options.country) params.searchLocation = options.country
    if(options.query) params.searchKeyword = options.query
    const response = await axios.get( company.endpoint, { params, headers } )
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

async function scrapeTCS(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
    console.log(`Scraping ${company.companyName}`)
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
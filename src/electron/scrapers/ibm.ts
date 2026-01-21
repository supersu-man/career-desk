import axios from "axios";
import { Company, JobPosting, ScraperOptions } from "../interface";

export async function scrapeIBM(company: Company, options: ScraperOptions): Promise<JobPosting[]> {
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

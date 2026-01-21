import { ScraperFn } from "../interface";
import { scrapeWorkday } from "./myworkday";
import { scrapeVerizon } from "./verizon";
import { scrapeEA } from "./ea";
import { scrapeIBM } from "./ibm";
import { scrapeAmazon } from "./amazon";
import { scrapeHyland } from "./hyland";
import { scrapeTCS } from "./tcs";
import { scrapeAccenture } from "./accenture";

export const scrapers: Record<string, ScraperFn> = {
    myworkday: scrapeWorkday,
    verizon: scrapeVerizon,
    ea: scrapeEA,
    ibm: scrapeIBM,
    amazon: scrapeAmazon,
    hyland: scrapeHyland,
    tcs: scrapeTCS,
    accenture: scrapeAccenture
};

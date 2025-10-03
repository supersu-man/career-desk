import { JobPosting } from "./interface"
import { app } from "electron";
import * as fs from "fs";
import path from 'path';

export class FileStorage {

    private savedJobsPath: string = path.join(app.getPath("userData"), "saved_jobs.json")

    private savedJobs: JobPosting[]

    constructor() {
        this.savedJobs = this.loadJobs(this.savedJobsPath);
    }

    private loadJobs(filePath: string): JobPosting[] {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, "utf-8"));
            }
        } catch (e) {
            console.error("Failed to load jobs", filePath, e);
        }
        return [];
    }

    private persist(filePath: string, jobs: JobPosting[]) {
        try {
            fs.promises.writeFile(filePath, JSON.stringify(jobs, null, 2));
        } catch (error) {
            console.error("Failed to persist jobs", filePath, error);
        }
    }

    toggleSaveJob(job: JobPosting) {
        const index = this.savedJobs.findIndex(j => j.url === job.url);
        if (index !== -1) {
            this.savedJobs.splice(index, 1);
        } else {
            this.savedJobs.push({ ...job, saved: true });
        }
        this.persist(this.savedJobsPath, this.savedJobs);
        return index === -1;
    }

    getSavedJobs = () => {
        return this.savedJobs
    }

}
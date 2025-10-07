import { JobPosting } from "./interface"
import { app } from "electron";
import * as fs from "fs";
import path from 'path';

export class FileStorage {

    private readonly savedJobsPath: string = path.join(app.getPath("userData"), "saved_jobs.json")

    private savedJobs: JobPosting[]

    constructor() {
        this.savedJobs = this.readFile(this.savedJobsPath);
    }

    private readFile(filePath: string): JobPosting[] {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, "utf-8"));
            }
        } catch (e) {
            console.error("Failed to load jobs", filePath, e);
        }
        return [];
    }

    private writeFile(filePath: string, jobs: JobPosting[]) {
        try {
            fs.promises.writeFile(filePath, JSON.stringify(jobs, null, 2));
        } catch (error) {
            console.error("Failed to persist jobs", filePath, error);
        }
    }

    toggleJob(job: JobPosting, type: 'save' | 'apply') {
        const index = this.savedJobs.findIndex(j => j.url === job.url);

        if (index >= 0) {
            const job = this.savedJobs[index]
            if (type == "apply" && job.saved) {
                job.applied = !job.applied
            } else if (type == "save" && job.applied) {
                job.saved = !job.saved
            } else {
                this.savedJobs.splice(index, 1);
            }
        }

        else if (type == "apply") {
            this.savedJobs.push({ ...job, applied: true });
        } else {
            this.savedJobs.push({ ...job, saved: true })
        }

        this.writeFile(this.savedJobsPath, this.savedJobs);
        return index === -1;
    }

    getSavedJobs = () => {
        return this.savedJobs.filter(x => x.saved)
    }

    getAppliedJobs = () => {
        return this.savedJobs.filter(x => x.applied)
    }

}
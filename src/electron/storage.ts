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

    private async writeFile(filePath: string, jobs: JobPosting[]) {
        try {
            await fs.promises.writeFile(filePath, JSON.stringify(jobs, null, 2));
        } catch (error) {
            console.error("Failed to persist jobs", filePath, error);
        }
    }

    async toggleJob(job: JobPosting, type: 'save' | 'apply') {
        const index = this.savedJobs.findIndex(j => j.url === job.url);

        if (index >= 0) {
            const existingJob = this.savedJobs[index];
            if (type === 'save') {
                existingJob.saved = !existingJob.saved;
            } else if (type === 'apply') {
                existingJob.applied = !existingJob.applied;
            }

            // Remove if no longer saved and no longer applied
            if (!existingJob.saved && !existingJob.applied) {
                this.savedJobs.splice(index, 1);
            }
        } else {
            const newJob = { ...job, saved: false, applied: false };
            if (type === 'save') {
                newJob.saved = true;
            } else if (type === 'apply') {
                newJob.applied = true;
            }
            this.savedJobs.push(newJob);
        }

        await this.writeFile(this.savedJobsPath, this.savedJobs);
        return true;
    }

    getSavedJobs = () => {
        return this.savedJobs.filter(x => x.saved)
    }

    getAppliedJobs = () => {
        return this.savedJobs.filter(x => x.applied)
    }

}
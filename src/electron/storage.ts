import { JobPosting, Preferences } from "./interface"
import { app } from "electron";
import * as fs from "fs";
import path from 'path';

export class FileStorage {

    private readonly storedJobsPath: string = path.join(app.getPath("userData"), "saved_jobs.json")
    private readonly prefsPath: string = path.join(app.getPath("userData"), "preferences.json")
    private readonly newPostingsPath: string = path.join(app.getPath("userData"), "new_postings.json")

    private storedJobs: JobPosting[]
    private prefs: Preferences
    private newPostings: JobPosting[]

    constructor() {
        this.storedJobs = this.readFile(this.storedJobsPath);
        this.prefs = this.readFile(this.prefsPath);
        this.newPostings = this.readFile(this.newPostingsPath);
    }

    private readFile(filePath: string): any {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, "utf-8"));
            }
        } catch (e) {
            console.error("Failed to load jobs", filePath, e);
        }
        return null;
    }

    private async writeFile(filePath: string, data: any) {
        try {
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error("Failed to persist data", filePath, error);
        }
    }

    async toggleSaveJob(job: JobPosting) {
        const index = this.storedJobs.findIndex(j => j.url === job.url);
        if (index >= 0) {
            const existingJob = this.storedJobs[index];
            existingJob.saved = !existingJob.saved;
            if (!existingJob.saved && !existingJob.applied) {
                this.storedJobs.splice(index, 1);
            }
        } else {
            const newJob = { ...job, saved: true, applied: false };
            this.storedJobs.push(newJob);
        }
        await this.writeFile(this.storedJobsPath, this.storedJobs);
        return true;
    }

    async applyJob(job: JobPosting) {
        console.log("Applying job")
        const index = this.storedJobs.findIndex(j => j.url === job.url);
        if (index >= 0) {
            const existingJob = this.storedJobs[index];
            existingJob.applied = true;
        } else {
            const newJob = { ...job, saved: false, applied: true };
            this.storedJobs.push(newJob);
        }
        await this.writeFile(this.storedJobsPath, this.storedJobs);
        return true;
    }

    getSavedJobs = () => {
        return this.storedJobs.filter(x => x.saved)
    }

    getAppliedJobs = () => {
        return this.storedJobs.filter(x => x.applied)
    }

    getPreferences = () => {
        return this.prefs
    }

    async savePreferences(prefs: Preferences) {
        this.prefs = prefs;
        await this.writeFile(this.prefsPath, this.prefs);
        return true;
    }

    getNewPostings = () => {
        return this.newPostings;
    }

    async saveNewPostings(postings: JobPosting[]) {
        this.newPostings = postings;
        await this.writeFile(this.newPostingsPath, this.newPostings);
        return true;
    }

}
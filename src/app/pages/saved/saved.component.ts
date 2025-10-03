import { Component, OnInit, signal } from '@angular/core';
import { JobCardComponent } from "../../components/job-card/job-card.component";
import { StorageService } from '../../services/storage.service';
import { JobPosting } from '../../../electron/interface';
import { JobsService } from '../../services/jobs.service';
import { openUrl } from '../../services/utility';

@Component({
  selector: 'app-saved',
  imports: [JobCardComponent],
  templateUrl: './saved.component.html',
  styles: ``
})
export class SavedComponent implements OnInit {

  constructor(public storageService: StorageService, public jobsService: JobsService) { }

  ngOnInit(): void {}

  toggleSave = async (job: JobPosting) => {
    await this.storageService.toggleSaveJob(job);
  }

  apply = (url:string) => {
    openUrl(url)
  }

}

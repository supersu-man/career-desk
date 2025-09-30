import { Component, input, output } from '@angular/core';
import { JobPosting } from '../../../electron/interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-job-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './job-card.component.html',
  styles: ``
})
export class JobCardComponent {
  job = input.required<JobPosting>()
  onApply = output<void>();
}

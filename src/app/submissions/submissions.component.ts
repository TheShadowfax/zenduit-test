import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { SubmissionsService } from './submissions.service';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss']
})
export class SubmissionsComponent implements OnInit, OnDestroy{
  
  viewType=new FormControl('list');
  filters!: { forms: { value: number; display: string; }[]; status: { value: number; display: string; }[]; };

  searchFormGroup !:FormGroup;
  subs = new Subscription()

  constructor(
    private submissionService: SubmissionsService,
    private dateParser: DatePipe
  ){}
  

  ngOnInit(): void {
    const today = this.dateParser.transform(new Date(), 'shortDate');

    this.searchFormGroup = new FormGroup({
      search: new FormControl(''),
      form: new FormControl(''),
      status: new FormControl(''),
      due: new FormControl(today)
    })
    this.submissionService.fetchFilters().subscribe((filters) => {
      this.filters = filters;
    })
    this.submissionService.setFilters({search: '', form: null, status: null, due: today});
    this.subs.add(
      this.searchFormGroup.valueChanges.pipe(debounceTime(500)).subscribe(() => {
        const due = this.dateParser.transform(this.searchFormGroup.value.due, 'shortDate')
          this.submissionService.setFilters({...this.searchFormGroup.value, due});
          this.submissionService.setPageNumber(0);
          this.submissionService.fetchNextPage();
      })
    )
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

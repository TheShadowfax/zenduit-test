import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { SubmissionsService } from '../submissions.service';
import { SelectionModel } from '@angular/cdk/collections';
import { map } from 'rxjs';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewComponent implements OnInit{
  displayedColumns: string[] = ['select','task', 'status','from', 'to', 'address', 'due'];


  selection = new SelectionModel();

  statusMap: any = {
    1: 'Low Risk',
    2: 'Uncompleted',
    3: 'Unassigned'
  }


  constructor(
    public submissionService: SubmissionsService
  ){}
  ngOnInit(): void {
    this.submissionService.fetchFirstPage();
  }

  pastDueDate(due: string) {
    return Date.parse(due) < Date.now();
  }

  onGoTo(page: number) {
    this.submissionService.fetchPage(page);
  }

  onNext(event: any) {
    this.submissionService.fetchNextPage();
  }

  onPrevious(event: any) {
    this.submissionService.setPageNumber(this.submissionService.currentPage-1);
    
  }

  ngAfterViewInit() {
   
  }
}


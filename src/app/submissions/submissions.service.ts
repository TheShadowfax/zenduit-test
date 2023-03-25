import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, of, timer } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SubmissionsService {

  currentPage = 0;

  private dataSource = new BehaviorSubject(new Array<any>());
  public dataSource$ = this.dataSource.asObservable();

  isLoading = false;
  isEndOfData = false;
  dataCount = 0;
  totalPages = 0;
  private filters: {search: string, form: number|null, status: number|null, due: string|null} | null = null;

  constructor(
    private http: HttpClient
  ) { }

  fetchFilters() {
    return of({
      forms: [
        { value: 1, display: 'Form 1' },
        { value: 2, display: 'Form 2' },
        { value: 3, display: 'Form 3' },
        { value: 4, display: 'Form 4' },
        { value: 5, display: 'Form 5' }
      ],
      status: [
        { value: 1, display: 'Low Risk' },
        { value: 2, display: 'Uncompleted' },
        { value: 3, display: 'Unassigned' }
      ]
    });
  }

  private fetchData(pageNum: number) {
    const start = (pageNum - 1) * 10;
    this.http.get<any[]>('/assets/data/dummy-data.json').pipe(
      map((value: any[]) => this.filterData(value).slice(start, start + 10) as any[])
    ).subscribe((value: any[]) => {      
     
      this.dataSource.next(value);
      this.isLoading = false;
      if (value.length < 10) {
        this.isEndOfData = true;
      }
    })
  }

  filterData(data: any[]) {
    if (!this.filters) return data;    
    data =  data.filter((value) =>{
      let res = true;
      if (this.filters?.search && !value.profile.name?.toLowerCase().includes(this.filters.search?.toLowerCase())){        
        res=false;
      }
      if (!this.filters?.search){
        res=true;
      } 

      if (this.filters?.form && value.form !== this.filters?.form){        
        res=false;
      }
      if (this.filters?.status && value.status !== this.filters?.status){
        res=false;
      }
      if (this.filters?.due && Date.parse(this.filters?.due ?? '') > Date.parse(value.due)){
        res=false;
      }
      
      return res ? value: null;
    });
    this.dataCount = data.length;
    this.totalPages = Math.ceil(data.length / 10);
    return data;
  }

  fetchFirstPage() {
    this.currentPage = 0;
    this.isLoading = true;
    timer(1000).subscribe(() => {
      this.fetchData(++this.currentPage);
    })
  }

  fetchNextPage() {
    this.isLoading = true;
    timer(1000).subscribe(() => {
      this.fetchData(++this.currentPage);
    })
  }

  fetchPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.isLoading = true;
    timer(1000).subscribe(() => {
      this.fetchData(pageNumber);
    })
  }
  
  setPageNumber(pageNumber: number) {
    this.currentPage = pageNumber;
    if (pageNumber === 0){
      this.isEndOfData = false;
    }
  }

  setFilters(filters: {search: string, form: number|null, status: number|null, due: string|null}){
    this.filters = filters;
    console.log(filters);
    
  }

}

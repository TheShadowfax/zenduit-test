import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  
  @Input() current: number = 0
  @Input() total: number = 0

  @Output() goTo: EventEmitter<number> = new EventEmitter<number>()
  @Output() next: EventEmitter<number> = new EventEmitter<number>()
  @Output() previous: EventEmitter<number> = new EventEmitter<number>()

  public pages: number[] = []

  private getPages(current:number, total:number): number[] {
    total = Math.ceil(total/10)
    if (total  > 5) {
      if (current >= 5) {
        if (current >= total - 4) {
          return [total - 4, total - 3, total - 2, total - 1, total]
        }
      }
      return [current, current+1, -1, total-1, total]
    }
  return new Array(total).fill('').map((x,i)=>i+1)
}

  public onGoTo(page: number): void {
    this.goTo.emit(page)
  }
  public onNext(): void {
    this.next.emit(this.current)
  }
  public onPrevious(): void {
    this.previous.next(this.current)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['current'] && changes['current'].currentValue) ||
      (changes['total'] && changes['total'].currentValue)
    ) {
      this.pages = this.getPages(this.current, this.total)
    }
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() top!: number;
  @Input() total!: number;
  @Output() EEPageChangeValue: EventEmitter<PageChangedEvent> = new EventEmitter<PageChangedEvent>();
  @Output() EEItemPerPage: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(){

  }
  
  ngOnInit(): void {

  }

  public pageChanged(event:PageChangedEvent){
    this.EEPageChangeValue.emit(event);
  }

  public itemPerPage(event:Event){
    this.EEItemPerPage.emit(event);
  }

}

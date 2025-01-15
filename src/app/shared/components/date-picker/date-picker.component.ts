import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { EmitDate } from '../../models/dateRangePicker.model';
declare var $: any;
import moment from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
  @Output() emitDateObject: EventEmitter<EmitDate> = new EventEmitter<EmitDate>();

  private dateObj: EmitDate = {
    startDate: '',
    endDate: ''
  };

  constructor(private cdRef: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const today = moment(); // Today's date
      const oneWeekAgo = moment().subtract(7, 'days'); // One week ago
  
      $('#daterange').daterangepicker({
        opens: 'left',
        showDropdowns: true,
        autoUpdateInput: true,
        startDate: oneWeekAgo, // Set startDate to 1 week ago
        endDate: today, // Set endDate to today
        maxDate: today, // Disable future dates
      });
  
      // Event listener for date range change
      $('#daterange').on('apply.daterangepicker', (ev: any, picker: any) => {
        const startDate = picker.startDate.format('YYYY-MM-DD');
        const endDate = picker.endDate.format('YYYY-MM-DD');
        this.dateObj.startDate = startDate;
        this.dateObj.endDate = endDate;
  
        $('#daterange').val(
          picker.startDate.format('MM/DD/YYYY') +
          ' - ' +
          picker.endDate.format('MM/DD/YYYY')
        );
  
        this.emitDateObject.emit(this.dateObj);
      });
  
      this.cdRef.detectChanges();
    }, 0);
  }
  
  
  public onChange(event: any) {
    this.dateObj.startDate = this.convertToYYYYMMDD((event.target.value as string).split('-')[0]);
    this.dateObj.endDate = this.convertToYYYYMMDD((event.target.value as string).split('-')[1]);
    this.emitDateObject.emit(this.dateObj);
  }

  private convertToYYYYMMDD(date: string): string {
    // recieving date in mm-dd-yyyy format
    const daateArr: string[] = date.split('/');
    return `${daateArr[2].trim()}-${daateArr[0].trim()}-${daateArr[1].trim()}`;
  }
}

import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  public showLoader: boolean = false;

  constructor(private loaderSevice:LoaderService){
    this.loaderSevice.showLoaderE.subscribe((res)=>{
      this.showLoader=res;
    })
  }
}

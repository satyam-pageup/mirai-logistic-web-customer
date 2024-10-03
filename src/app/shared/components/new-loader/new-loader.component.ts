import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-new-loader',
  templateUrl: './new-loader.component.html',
  styleUrl: './new-loader.component.scss'
})
export class NewLoaderComponent {
  public showLoader: boolean = false;

  constructor(private loaderSevice:LoaderService){
    this.loaderSevice.showNewLoaderE.subscribe(
      (res:boolean)=>{
        this.showLoader=res;
      }
    );
  }
}

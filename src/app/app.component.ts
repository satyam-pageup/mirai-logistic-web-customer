import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './shared/services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'MiraiCustomer';

  constructor(private firebaseService: FirebaseService){
    this.firebaseService.requestPermission();
    this.firebaseService.listen();
  }
  ngOnInit(): void {
  }
}

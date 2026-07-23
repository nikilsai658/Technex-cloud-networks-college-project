import { Component } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone:true,
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {
  images:any[]=[
    {name:'JNTUA College of Engineering Kalikiri',image:'../../../assets/TCN_logo.jpeg'},
    {name:'chaithaya college',image:'../../../assets/TCN_logo.jpeg'},
    {name:'chaithaya college',image:'../../../assets/TCN_logo.jpeg'}
  ]
}

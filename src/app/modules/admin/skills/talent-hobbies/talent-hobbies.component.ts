import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from '@angular/fire/compat/database';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  constructor(public db: AngularFireDatabase) { }


  ngOnInit(): void {
  }

}



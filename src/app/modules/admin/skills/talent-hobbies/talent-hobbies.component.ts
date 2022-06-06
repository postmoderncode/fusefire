import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  listRef: AngularFireList<any>;
  sublistRef: AngularFireList<any>;
  items: Observable<any[]>;
  model = new Talent('', '');

  constructor(public db: AngularFireDatabase) {

    this.items = db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents').valueChanges();

  }

  onSubmit(): void {

    //Placeholder variable to make sure dynamic paths are possible
    const fbkey: string = 'cQT4PtEZEAczJoAcbghuCtt7vDP2';

    this.listRef = this.db.list('/users/' + fbkey + '/talents');
    this.sublistRef = this.db.list('/talents/' + fbkey);

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    //Define Promise
    const promiseUpdateskill = this.listRef.push({ name: mname, description: mdescription });

    //Call Promise
    promiseUpdateskill
      .then(_ => this.sublistRef.push({ name: mname, description: mdescription }))
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  ngOnInit(): void { }

}

export class Talent {

  constructor(
    public name: string,
    public description: string

  ) { }

}



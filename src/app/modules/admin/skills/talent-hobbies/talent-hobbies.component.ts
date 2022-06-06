import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  listRef: AngularFireList<any>;
  sublistRef: AngularFireList<any>;

  model = new Talent('');

  constructor(public db: AngularFireDatabase) { }

  onSubmit(): void {

    //Placeholder variable to make sure dynamic paths are possible
    const fbkey: string = 'cQT4PtEZEAczJoAcbghuCtt7vDP2';

    this.listRef = this.db.list('/users/' + fbkey + '/talents');
    this.sublistRef = this.db.list('/talents/' + fbkey);

    //Cast model to variable for formReset
    const mname: string = this.model.name;

    //Define Promise
    const promiseUpdateskill = this.listRef.push({ name: mname });

    //Call Promise
    promiseUpdateskill
      .then(_ => this.sublistRef.push({ name: mname }))
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  ngOnInit(): void { }

}

export class Talent {

  constructor(
    public name: string,

  ) { }

}



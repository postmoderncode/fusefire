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
  itemRef: AngularFireObject<any>;
  subitemRef: AngularFireObject<any>;

  model = new Talent('');

  constructor(public db: AngularFireDatabase) { }

  onSubmit(): void {


    //Placeholder variable to make sure dynamic paths are possible
    const fbkey: string = 'cQT4PtEZEAczJoAcbghuCtt7vDP2';

    //Reference for single update
    //this.itemRef = this.db.object('/users/' + fbkey + '/talents');

    //Reference for second update
    this.subitemRef = this.db.object('/talents/' + fbkey);

    //Define Promise
    const promiseUpdateskill = this.listRef.push({ name: this.model.name });

    //Call Promise
    promiseUpdateskill
      .then(_ => this.sublistRef.push({ name: this.model.name }))
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  ngOnInit(): void {

    //Reference for list
    this.listRef = this.db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents');
    //Reference for list
    this.sublistRef = this.db.list('/talents/cQT4PtEZEAczJoAcbghuCtt7vDP2');

  }

}

export class Talent {

  constructor(
    public name: string,

  ) { }

}



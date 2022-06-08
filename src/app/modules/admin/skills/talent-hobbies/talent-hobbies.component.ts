import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  model = new Talent('', '');
  listRef: AngularFireList<any>;
  sublistRef: AngularFireObject<any>;
  itemRef: AngularFireObject<any>;
  subitemRef: AngularFireObject<any>;
  items: Observable<any[]>;
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];
  showaddtalent = false;
  //Placeholder variable to make sure dynamic paths are possible
  fbkey: string = 'cQT4PtEZEAczJoAcbghuCtt7vDP2';

  constructor(public db: AngularFireDatabase,) {

    this.items = db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents').snapshotChanges();

  }

  onSubmit(): void {

    this.listRef = this.db.list('/users/' + this.fbkey + '/talents');
    this.sublistRef = this.db.object('/talents/' + this.fbkey);

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    //Define Promise
    const promiseUpdateskill = this.listRef.push({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) });

    //this.db.object('/talents/' + this.fbkey + _.key).update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) });

    //Call Promise
    promiseUpdateskill
      .then(_ => this.db.object('/talents/' + this.fbkey + '/' + _.key).update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) }))
      .then(_ => this.showaddtalent = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  onEdit(key): void {
    console.log(key + ' edited');
    this.itemRef = this.db.object('/users/' + this.fbkey + '/talents/' + key);

  }

  onDelete(key): void {

    this.itemRef = this.db.object('/users/' + this.fbkey + '/talents/' + key);
    this.subitemRef = this.db.object('/talents/' + this.fbkey + '/' + key);
    this.itemRef.remove();
    this.subitemRef.remove();
    console.log(key + ' deleted');
    console.log('/talents/' + this.fbkey + '/' + key);
  }

  onShowAddForm(): void {
    this.showaddtalent = true;
  }

  onHideAddForm(): void {
    this.showaddtalent = false;
  }

  ngOnInit(): void { }

}

export class Talent {

  constructor(
    public name: string,
    public description: string

  ) { }

}



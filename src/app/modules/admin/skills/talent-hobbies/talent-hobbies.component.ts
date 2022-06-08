import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  model = new Talent('', '');
  listRef: AngularFireList<any>;
  sublistRef: AngularFireList<any>;
  updateitemRef: AngularFireObject<any>;
  items: Observable<any[]>;
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];
  showaddtalent = false;

  constructor(public db: AngularFireDatabase,) {

    this.items = db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents').snapshotChanges();

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
    const promiseUpdateskill = this.listRef.push({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) });

    //Call Promise
    promiseUpdateskill
      .then(_ => this.sublistRef.push({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) }))
      .then(_ => this.showaddtalent = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  onEdit(key): void {
    console.log(key + ' edited');
  }

  onDelete(key): void {
    console.log(key + ' deleted');
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



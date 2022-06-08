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

  model = new Talent('', '', '', '', '');
  listRef: AngularFireList<any>;
  item: Observable<any>;
  items: Observable<any[]>;
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];
  showaddtalent = false;
  showedittalent = false;

  //Placeholder variable to make sure dynamic paths are possible
  fbkey: string = 'cQT4PtEZEAczJoAcbghuCtt7vDP2';

  constructor(public db: AngularFireDatabase,) { }

  onSubmit(): void {

    this.listRef = this.db.list('/users/' + this.fbkey + '/talents');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    //Define Promise
    const promiseAddTalent = this.listRef.push({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) });

    //Call Promise
    promiseAddTalent
      .then(_ => this.db.object('/talents/' + this.fbkey + '/' + _.key).update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()) }))
      .then(_ => this.showaddtalent = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  onEdit(key): void {
    console.log(key + ' edited');
    //this.db.object('/users/' + this.fbkey + '/talents/' + key);

  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbkey + '/talents/' + key).remove();
    this.db.object('/talents/' + this.fbkey + '/' + key).remove();
    console.log(key + ' deleted');

  }

  onShowAddForm(): void {
    this.showedittalent = false;
    this.showaddtalent = true;
  }

  onHideAddForm(): void {
    this.showaddtalent = false;
  }

  onShowEditForm(key): void {
    this.showaddtalent = false;
    this.showedittalent = true;

    this.item = this.db.object('/users/' + this.fbkey + '/talents/' + key).valueChanges();
    this.item.subscribe(item => {
      this.model = new Talent(item.key, item.name, item.description, item.created, item.modified);
    });
    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedittalent = false;
    this.model = new Talent('', '', '', '', '');
  }

  ngOnInit(): void {
    this.items = this.db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents').snapshotChanges();
  }

}

// Empty Talent class
export class Talent {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string

  ) { }

}



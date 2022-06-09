import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {


  model = new Talent('', '', '', '', '', '');
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];
  listRef: AngularFireList<any>;
  item: Observable<any>;
  items: Observable<any[]>;
  showaddtalent = false;
  showedittalent = false;

  //Placeholder variable to make sure dynamic paths are possible
  //fbkey: string = 'cQT4PtEZEAczJoAcbghuCtt7vDP2';
  fbuserid: string = localStorage.getItem('fbuserid');

  configForm: FormGroup;

  /**
   * Constructor
   */
  constructor(private _formBuilder: FormBuilder, private _fuseConfirmationService: FuseConfirmationService, public db: AngularFireDatabase,) { }

  onSubmit(): void {

    this.listRef = this.db.list('/users/' + this.fbuserid + '/talents');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    //Define Promise
    const promiseAddTalent = this.listRef.push({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid });

    //Call Promise
    promiseAddTalent
      .then(_ => this.db.object('/talents/' + this.fbuserid + '/' + _.key).update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid }))
      .then(_ => this.showaddtalent = false)
      .catch(err => console.log(err, 'Error Submitting Talent!'));

  }

  onEdit(key): void {

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mdescription: string = this.model.description;

    this.db.object('/users/' + this.fbuserid + '/talents' + '/' + key).update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid })
    this.db.object('/talents/' + this.fbuserid + '/' + key).update({ name: mname, description: mdescription, created: Math.floor(Date.now()), modified: Math.floor(Date.now()), user: this.fbuserid })
    this.showedittalent = false
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/users/' + this.fbuserid + '/talents/' + key).remove();
    this.db.object('/talents/' + this.fbuserid + '/' + key).remove();
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

    //Define Observable
    this.item = this.db.object('/users/' + this.fbuserid + '/talents/' + key).valueChanges();

    //Subscribe to Observable
    this.item.subscribe(item => {
      this.model = new Talent(key, item.name, item.description, item.created, item.modified, item.user);
    });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedittalent = false;
    this.model = new Talent('', '', '', '', '', '');
  }

  ngOnInit(): void {

    this.items = this.db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents').snapshotChanges();

    this.configForm = this._formBuilder.group({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this item permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel'
        })
      }),
      dismissible: false
    });

  }

  openConfirmationDialog(key): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.onDelete(key)
      }
    });
  }

}

// Empty Talent class
export class Talent {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,

  ) { }



}



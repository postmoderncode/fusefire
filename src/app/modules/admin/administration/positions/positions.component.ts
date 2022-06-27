import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Scroll element
  @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Position();

  //Table Control
  displayedColumns = ['name', 'description', 'created', 'delete', 'edit'];

  //Firebase Observables
  item: Observable<any>;
  items: Observable<any[]>;
  listRef: AngularFireList<any>;

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;
  positionfilled = false;
  showcompensation = false;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }


  onAdd(): void {

    this.listRef = this.db.list('/positions');

    //Cast model to variable for formReset
    const mname: string = this.model.name;
    const mreportsto: string = this.model.reportsto;
    const mdescription: string = this.model.description;
    const mfilled: boolean = this.model.filled;
    const mheldby: string = this.model.heldby;
    const mcompensation: boolean = this.model.compensation;
    const mcomplower: string = this.model.complower;
    const mcompupper: string = this.model.compupper;
    const mdatenow = Math.floor(Date.now());

    //Define Promise
    const promiseAddItem = this.listRef
      .push({ name: mname, reportsto: mreportsto, description: mdescription, filled: mfilled, heldby: mheldby, compensation: mcompensation, complower: mcomplower, compupper: mcompupper, created: mdatenow, modified: mdatenow, user: this.fbuser.id });

    //Call Promise
    promiseAddItem
      .then(_ => this.showadditem = false)
      .catch(err => console.log(err, 'Error Submitting Position!'));

    this.cdkScrollable.scrollTo({ top: 0 });

  }

  onEdit(key): void {

    // //Cast model to variable for formReset
    // const mname: string = this.model.name;
    // const mdescription: string = this.model.description;
    // const mawardedby: string = this.model.awardedby;
    // const mawardedon: string = this.model.awardedon;
    // const mdatenow = Math.floor(Date.now());

    // this.db.object('/users/' + this.fbuser.id + '/training' + '/' + key)
    //   .update({ name: mname, description: mdescription, modified: mdatenow, awardedby: mawardedby, awardedon: mawardedon });
    // this.db.object('/training/' + this.fbuser.id + '/' + key)
    //   .update({ name: mname, description: mdescription, modified: mdatenow, awardedby: mawardedby, awardedon: mawardedon });
    // this.showedititem = false;
    // this.cdkScrollable.scrollTo({ top: 0 });
    console.log(key + ' edited');
  }

  onDelete(key): void {
    this.db.object('/positions/' + key).remove();


    console.log(key + ' deleted');

  }

  onShowAddForm(): void {
    this.showedititem = false;
    this.showadditem = true;
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  onHideAddForm(): void {
    this.showadditem = false;
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  onShowEditForm(key): void {
    this.showadditem = false;
    this.showedititem = true;
    this.cdkScrollable.scrollTo({ top: 0 });

    // //Define Observable
    // this.item = this.db.object('/users/' + this.fbuser.id + '/training/' + key).valueChanges();

    // //Subscribe to Observable
    // this.item.subscribe((item) => {
    //   this.model = new Training(key, item.name, item.description, item.created, item.modified, item.user, item.awardedby, item.awardedon);
    // });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    //this.model = new Training();
    this.cdkScrollable.scrollTo({ top: 0 });
  }

  //Compensation Checkbox
  onFilledChecked($event): void {
    if ($event.checked === true) { this.positionfilled = true; }
    else { this.positionfilled = false; }
  }

  //Compensation Checkbox
  onCompensationChecked($event): void {
    if ($event.checked === true) { this.showcompensation = true; }
    else { this.showcompensation = false; }
  }

  openConfirmationDialog(key): void {
    //Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.dialogconfigForm.value);

    //Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        //Call Actual Delete
        this.onDelete(key);
      }
    });
  }

  ngOnInit(): void {

    this.items = this.db.list('/positions').snapshotChanges();

    //Formbuilder for Dialog Popup
    this.dialogconfigForm = this._formBuilder.group({
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

}


// Empty Training class
export class Position {

  constructor(
    public key: string = '',
    public name: string = '',
    public description: string = '',
    public created: string = '',
    public modified: string = '',
    public user: string = '',
    public reportsto: string = '',
    public awardedon: string = '',
    public filled: boolean = false,
    public heldby: string = '',
    public compensation: boolean = false,
    public complower: string = '',
    public compupper: string = '',


  ) { }

}

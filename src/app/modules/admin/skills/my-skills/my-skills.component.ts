import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-my-skills',
  templateUrl: './my-skills.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MySkillsComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Skill('', '', '', '', '', '');
  catmodel = new CatalogState('', '', '');

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;

  //Object to Hold All Areas.
  areas: Observable<any>;

  //Object to Hold Current Category List.
  categories: object;

  //Object to Hold Current Skill List.
  skills: object;

  //General Component Variables
  selectedIndex = 0;
  tabTitle = 'Area';

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  //Function to Handle the Back Arrow
  goback(): void {
    switch (this.selectedIndex) {
      case 1: {
        console.log('goback 1');
        this.tabTitle = 'Area';
        this.selectedIndex = 0;
        this.catmodel.currentCategory = '';
        this.catmodel.currentSkill = '';
        break;
      }
      case 2: {
        console.log('goback 2');
        this.tabTitle = 'Category';
        this.selectedIndex = 1;
        this.catmodel.currentSkill = '';
        break;
      }
    }
  }

  //Function to call when an area is selected
  onAreaSelect(areaId) {

    //Populate Categories - Firebase List w/ Sort&Filter Query
    this.db.list('/skillcatalog/categories/', ref => ref
      .orderByChild("area")
      .equalTo(areaId))
      .snapshotChanges().subscribe(
        (results: object) => { this.categories = results; }
      );

    //Set the title
    this.tabTitle = 'Category';

    //Set the tab to categories
    this.selectedIndex = 1;

    this.catmodel.currentArea = areaId;

    console.log(this.tabTitle);

  }

  //Function to call when a category is selected
  onCategorySelect(categoryId) {

    console.log(categoryId);

    //Populate Categories - Firebase List w/ Sort&Filter Query
    this.db.list('/skillcatalog/skills/', ref => ref
      .orderByChild("category")
      .equalTo(categoryId))
      .snapshotChanges().subscribe(
        (results: object) => { this.skills = results; }
      );

    this.tabTitle = "Skill";
    this.selectedIndex = 2;
    this.catmodel.currentCategory = categoryId;
  }

  //Function to call when a category is selected
  selectSkill(skillId) {
    this.catmodel.currentSkill = skillId;
  }

  onAdd(): void {
    console.log('add clicked');
  }

  onEdit(key): void {

    // //Cast model to variable for formReset
    // const mname: string = this.model.name;
    // const mdescription: string = this.model.description;
    // const mdatenow = Math.floor(Date.now());

    // this.db.object('/users/' + this.fbuser.id + '/talents' + '/' + key)
    //   .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });
    // this.db.object('/talents/' + this.fbuser.id + '/' + key)
    //   .update({ name: mname, description: mdescription, created: mdatenow, modified: mdatenow, user: this.fbuser.id });
    // this.showedititem = false;
    console.log(key + ' edited');
  }

  onDelete(key): void {
    // this.db.object('/users/' + this.fbuser.id + '/talents/' + key).remove();
    // this.db.object('/talents/' + this.fbuser.id + '/' + key).remove();

    // //Decrement Count
    // this.db.object('/counts/' + this.fbuser.id + '/talents').query.ref.transaction(likes => {
    //   if (likes === null) {
    //     return likes = 0;
    //   } else {
    //     return likes - 1;
    //   }
    // })

    console.log(key + ' deleted');

  }

  //Contextual Button based on tabTitle
  onShowAddForm(type: string): void {
    this.showedititem = false;
    this.showadditem = true;
    console.log(type + ' Form Open');
  }

  onHideAddForm(): void {
    this.showadditem = false;
  }

  onShowEditForm(key): void {
    console.log('edit form shown');
    this.showadditem = false;
    this.showedititem = true;

    // //Define Observable
    // this.item = this.db.object('/users/' + this.fbuser.id + '/talents/' + key).valueChanges();

    // //Subscribe to Observable
    // this.item.subscribe((item) => {
    //   this.model = new Talent(key, item.name, item.description, item.created, item.modified, item.user);
    // });

    console.log(key + 'has been selected to edit');
  }

  onHideEditForm(): void {
    this.showedititem = false;
    this.model = new Skill('', '', '', '', '', '');
  }

  openConfirmationDialog(key): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.dialogconfigForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.onDelete(key);
      }
    });
  }

  ngOnInit(): void {

    //Populate Areas - Firebase List Object
    this.areas = this.db.list('/skillcatalog/areas/').snapshotChanges();


    //Formbuilder for Dialog Popup
    this.dialogconfigForm = this._formBuilder.group({
      title: 'Remove Item',
      message: 'Are you sure you want to remove this ' + this.tabTitle + ' permanently? <span class="font-medium">This action cannot be undone!</span>',
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

// Empty Skill class
export class Skill {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,

  ) { }

}

// Empty Skill class
export class CatalogState {

  constructor(
    public currentArea: string,
    public currentCategory: string,
    public currentSkill: string,

  ) { }

}


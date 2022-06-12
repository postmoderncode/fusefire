import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-skill-catalog',
  templateUrl: './skill-catalog.component.html',
  styleUrls: ['./skill-catalog.component.scss']
})
export class SkillCatalogComponent implements OnInit {

  fbuserid: string = localStorage.getItem('fbuserid');
  dialogconfigForm: FormGroup;
  value = 0;
  showadditem = false;
  showedititem = false;
  model = new Talent('', '', '', '', '', '');


  dbRef = this.db.database.ref("/skillcatalog/categories/");

  myObserver = {
    next: (x: number) => console.log('Observer got a next value: ' + x),
    error: (err: Error) => console.error('Observer got an error: ' + err),
    complete: () => console.log('Observer got a complete notification'),
  };

  //Initialize Varables
  //-------------------

  //Object to Hold All Areas. 
  areas: Observable<any>;

  //Object to Hold Current Category List. 
  categories: object;
  categories2: object;

  //Object to Hold Current Skill List. 
  skills: Observable<any>;

  //General Component Variables
  selectedIndex = 0;
  tabTitle = "Area"

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
        this.tabTitle = "Area";
        this.selectedIndex = 0;
        break;
      }
      case 2: {
        this.tabTitle = "Category.";
        this.selectedIndex = 1;
        break;
      }
    }
  }

  //Function to call when an area is selected
  loadCategories(categoryId) {

    //Populate Categories
    this.db.list('/skillcatalog/categories/', ref => ref.orderByChild("area").equalTo(parseInt(categoryId))).snapshotChanges().subscribe(
      (results: object) => {
        console.log(results);
        this.categories = results;
      }
    );

    //Set the title
    this.tabTitle = "Category";

    //Set the tab to categories
    this.selectedIndex = 1;

    console.log(this.tabTitle);
  }

  //Function to call when a category is selected
  loadSkills(categoryId) {

    console.log(categoryId);
    this.tabTitle = "Skill";
    this.selectedIndex = 2;
  }

  onAdd(): void {
    console.log('add clicked');
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

  ngOnInit(): void {

    //Populate the Areas Object
    this.areas = this.db.list('/skillcatalog/areas/').snapshotChanges();

    //Populate Categories
    this.db.list('/skillcatalog/categories/', ref => ref.orderByChild("area").equalTo(4)).snapshotChanges().subscribe(
      (results: object) => {
        console.log(results);
        this.categories2 = results;
      }
    );

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

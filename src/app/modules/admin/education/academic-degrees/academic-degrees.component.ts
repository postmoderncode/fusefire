import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-academic-degrees',
  templateUrl: './academic-degrees.component.html',
  styleUrls: ['./academic-degrees.component.scss']
})
export class AcademicDegreesComponent implements OnInit {

  //Initialize Varables
  //-------------------

  //Current User
  fbuser = JSON.parse(localStorage.getItem('fbuser'));

  //Confirmation Dialog
  dialogconfigForm: FormGroup;

  //Empty Model
  model = new Education('', '', '', '', '', '', '', '', '');

  //Form Visibility Modifiers
  showadditem = false;
  showedititem = false;

  //Autocomplete Data
  fieldfilteredData;
  schoolfilteredData;

  schooloptions: string[] = ["Ball State University", "Indiana University", "Notre Dame", "Purdue University", "Indiana Tech"];
  fieldoptions: string[] = ["Accounting", "Advertising", "African-American Studies", "Agriculture", "Animal Science", "Anthropology", "Aerospace Engineering", "Archaeology", "Architecture", "Art History", "Arts Management", "Asian-American Studies", "Astronomy and Astrophysics", "Bilingual/Crosscultural Education", "Athletic Training", "Biochemistry", "Biology", "Biomedical Engineering", "Business", "Chemical Engineering", "Chemistry", "Civil Engineering", "Classical Studies", "Communication Disorders Sciences and Services", "Communications", "Comparative Literature", "Computer Engineering", "Computer Information Systems", "Computer Science", "Construction Services", "Cosmetology Services", "Creative Writing", "Criminology", "Culinary Arts", "Cybersecurity", "Design", "Economics", "Education", "Electrical Engineering", "Elementary Education", "Engineering", "English Language and Literature", "Entomology", "Environmental Engineering", "Film and Video Production", "Film-Video Arts", "Finance", "Fine Arts", "Fire Safety Science", "Food Science", "Foreign Languages", "Forestry", "Gender Studies", "Genetics", "Geology", "Graphic Design", "Health Sciences", "History", "Hospitality Management", "Human Ecology", "Industrial Technology", "International Business", "International Relations", "Journalism", "Kinesiology", "Latin American Studies", "Liberal Studies", "Library Science", "Linguistics", "Logistics Management", "Marketing", "Mathematics", "Mechanical Engineering", "Medical Technology", "Metallurgical Engineering", "Meteorology", "Microbiology", "Military Technology", "Mining and Mineral Engineering", "Music", "Mythology and Folklore", "Naval Architecture and Marine Engineering", "Neuroscience", "Nuclear Engineering", "Nursing", "Oceanography", "Occupational Health and Safety", "Parks, Recreation, and Leisure Studies", "Performing Arts", "Petroleum Engineering", "Pharmacology", "Philosophy", "Photography", "Physics", "Physiology", "Plant Science", "Political Science", "Pre-Law", "Psychology", "Public Administration", "Puppetry", "Religious Studies", "Rhetoric", "Social Work", "Sociology", "Software Engineering", "Special Education", "Sports Medicine", "Statistics", "Student Counseling", "Supply Chain Management", "Theater Arts", "Viticulture", "Zoology"]

  degreelevels;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  applyFilterFields(evt: string) {
    evt = evt + "";
    if (!evt) this.fieldfilteredData = this.fieldoptions;
    else {
      this.fieldfilteredData = this.fieldoptions.filter(item => (item + "") === evt || item.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0);
    }
  }

  applyFilterSchools(evt: string) {
    evt = evt + "";
    if (!evt) this.schoolfilteredData = this.schooloptions;
    else {
      this.schoolfilteredData = this.schooloptions.filter(item => (item + "") === evt || item.toLocaleLowerCase().indexOf(evt.toLocaleLowerCase()) >= 0);
    }
  }

  onDateChange(event: MatDatepickerInputEvent<any>, control: AbstractControl): void {

    this.model.awardedon = ((event.value.valueOf()).toString());
  }

  onShowAddForm(): void {
    this.showedititem = false;
    this.showadditem = true;
  }

  onHideAddForm(): void {
    this.showadditem = false;
  }

  onShowEditForm(key): void {
    this.showadditem = false;
    this.showedititem = true;

  };

  onHideEditForm(): void {
    this.showedititem = false;

  }

  onStateChange(ob) {

    let selectedState = ob.value;
    console.log(selectedState);

    //TODO: Fill School Dropdown 
  }

  ngOnInit(): void {

    this.fieldfilteredData = this.fieldoptions;
    this.schoolfilteredData = this.schooloptions;

  }

}

// Empty Education class
export class Education {

  constructor(
    public key: string,
    public name: string,
    public description: string,
    public created: string,
    public modified: string,
    public user: string,
    public awardedby: string,
    public awardedon: string,
    public expireson: string,

  ) { }

}


import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.scss']
})
export class MyReportsComponent implements OnInit {

  listRef: AngularFireList<any>;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  onBtnClk(): void {
    console.log('button clicked');
    // online array maker https://codepen.io/jtfm/pen/apxJXG
    // online csv to array https://www.convertsimple.com/convert-csv-to-javascript-array/
    let arr = [10, 20, 30, 40];

    for (var val of arr) {
      console.log(val);
      // this.db.list('/certifications').push({ name: val });
    }


  }

  ngOnInit(): void {
  }

}

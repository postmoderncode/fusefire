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

  fbuserid: string = localStorage.getItem('fbuserid');
  dialogconfigForm: FormGroup;
  value = 0;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public db: AngularFireDatabase
  ) { }

  ngOnInit(): void {

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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  listRef: AngularFireList<any>;
  itemRef: AngularFireObject<any>;
  subitemRef: AngularFireObject<any>;
  obskill: Observable<any>;

  model = new Talent('');

  constructor(public db: AngularFireDatabase) { }

  onSubmit(): void {


    //Placeholder variable to make sure dynamic paths are possible
    const fbkey: string = "cQT4PtEZEAczJoAcbghuCtt7vDP2";

    //Reference for single update
    //this.itemRef = this.db.object('/users/' + fbkey + '/talents');

    //Reference for second update
    this.subitemRef = this.db.object('/talents/' + fbkey);

    //Define Promise
    const promise_updateskill = this.listRef.push({ name: this.model.name });

    //Call Promise
    promise_updateskill
      .then(_ => //Update 2nd List
        this.subitemRef.update({ name: this.model.name })
      )
      .catch(err => //Handle Error
        console.log(err, 'Error Submitting Talent!')
      );

  }

  ngOnInit(): void {

    //Reference for list
    this.listRef = this.db.list('/users/cQT4PtEZEAczJoAcbghuCtt7vDP2/talents');
    //Observable for list
    this.obskill = this.listRef.valueChanges();

    //Log changes to Console
    //db.list<any>('users').valueChanges().subscribe(console.log);

    // Push item to List
    //this.listRef.push({ name: data.skillname, rating: data.skillrating });

    // Set item (Destructive Update)
    //this.itemRef.set({ name: data.skillname, rating: data.skillrating });

    // Update item (Non-Destructive Update)
    //this.itemRef.update({ name: data.skillname, rating: data.skillrating });

    // Delete item
    //this.itemRef.remove(); 



  }

}

export class Talent {

  constructor(
    public name: string,

  ) { }

}



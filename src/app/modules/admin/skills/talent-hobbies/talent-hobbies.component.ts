import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from '@angular/fire/compat/database';

@Component({
  selector: 'app-talents',
  templateUrl: './talent-hobbies.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TalentHobbiesComponent implements OnInit {

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer', 'Solves Crimes'];

  model = new Hero(18, 'Ghetto Detective', this.powers[0], 'Pooky Watson');

  submitted = false;

  constructor(public db: AngularFireDatabase) { }

  onSubmit(): void { this.submitted = true; }

  newHero(): void {
    this.model = new Hero(42, '', '');
  }

  ngOnInit(): void {
  }

}

export class Hero {

  constructor(
    public id: number,
    public name: string,
    public power: string,
    public alterEgo?: string
  ) { }

}

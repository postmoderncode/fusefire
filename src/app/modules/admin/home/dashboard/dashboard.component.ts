import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer', 'Solves Crimes'];

  model = new Hero(18, 'Ghetto Detective', this.powers[0], 'Pooky Watson');

  submitted = false;

  constructor() { }

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

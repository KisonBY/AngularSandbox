import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { SpinnerService } from '../spinner.service';
import { trigger, state, style, transition, animate, query } from '@angular/animations';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        // style({opacity: 0, transform: 'translateX(-90%)'}),
        style({height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, marginTop: 0, opacity: 0}),
        animate(250),
      ]),
      transition(':leave', [
        animate(250, style({transform: 'scale(0.01)', height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, marginTop: 0, opacity: 0}))
        //animate(300, style({transform: 'scale(0.01)', opacity: 0}))
      ])
    ])
  ]
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  showListSpinner: boolean;
  showAddHeroSpinner: boolean;

  constructor(
    private heroService: HeroService,
    private spinnerService: SpinnerService) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.showListSpinner = true;
    this.heroService.getHeroes()
      .subscribe(h => {
        this.showListSpinner = false;
        this.heroes = h;
      });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) return;
    this.showAddHeroSpinner = true;
    this.heroService.addHero({name} as Hero)
      .subscribe(h => {
        this.showAddHeroSpinner = false;
        this.heroes.push(h);
      });
  }

  delete(hero: Hero): void {
    var spinnerName = `deleteHeroSpinner-${hero.id}`;
    this.spinnerService.show(spinnerName);
    this.heroService.deleteHero(hero)
      // .pipe(
      //   tap(_ => this.spinnerService.hide(spinnerName)),
      //   delay(1),
      //   tap(_ => this.heroes = this.heroes.filter(h => h !== hero))
      // ).subscribe();
      .subscribe(_ => {
        this.spinnerService.hide(spinnerName);
        this.heroes = this.heroes.filter(h => h !== hero);
      });
  }
}
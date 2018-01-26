import { Injectable } from "@angular/core";
import { Hero } from "./hero";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, delay } from 'rxjs/operators';

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    this.log('Fetching Heroes...');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        delay(Math.floor(Math.random() * 1000) + 200), // Simulate slowness
        tap(h => this.log('Fetched Heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    this.log(`Fetching Hero (ID = ${id})...`);
    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url).pipe(
      delay(Math.floor(Math.random() * 1000) + 200), // Simulate slowness
      tap(h => this.log(`Fetched Hero (ID = ${id})`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  updateHero(hero: Hero): Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.log(`Updating Hero (ID = ${hero.id})...`);
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      delay(Math.floor(Math.random() * 2000) + 1000), // Simulate slowness
      tap(h => this.log(`Updated Hero (ID = ${hero.id})`)),
      catchError(this.handleError<Hero>(`updateHero id=${hero.id}`))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      delay(Math.floor(Math.random() * 1000) + 200), // Simulate slowness
      tap(h => this.log(`Added Hero (ID = ${h.id})`)),
      catchError(this.handleError<Hero>(`addHero`))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      delay(Math.floor(Math.random() * 3000) + 1000), // Simulate real slowness
      tap(_ => this.log(`Deleted Hero (ID = ${id})`)),
      catchError(this.handleError<Hero>(`deleteHero id=${id}`))
    )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      delay(Math.floor(Math.random() * 300) + 200), // Simulate slowness
      tap(heroes => this.log(`Found ${heroes.length} heroes matching term "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`ERROR: ${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`${new Date().toLocaleTimeString()} - Hero Service: ${message}`);
  }
}
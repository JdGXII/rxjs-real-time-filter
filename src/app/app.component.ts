import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, fromEvent } from 'rxjs';
import { filter,debounceTime } from 'rxjs/operators';

interface Pokemon{
  name: string;
}
interface PokemonResponse {
  results: Pokemon[];
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {
  filter: string;
  pokemonList: Pokemon[];
  filteredList: Pokemon[];



  constructor(private http: HttpClient) { }

  ngOnInit(){
    this.apiCall().subscribe(data => {
      this.filteredList = data.results; 
      this.pokemonList = data.results;
    });
    const input = document.querySelector('input');
    const filterSource = fromEvent(input, 'keyup').pipe(debounceTime(1000));
    filterSource.subscribe(x => {
      this.filteredList = [];
      const listSource = from(this.pokemonList).pipe(
      filter(x => x.name.includes(this.filter))
      );
        listSource.subscribe(x => {      
          this.filteredList.push(x);
        });

    });
  }

  apiCall(){
    return this.http.get<PokemonResponse>("https://pokeapi.co/api/v2/pokemon?limit=964");
  }
}

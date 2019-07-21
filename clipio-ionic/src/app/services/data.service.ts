import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http: HttpClient ) { }

  /*Obtiene el json de todos los elementos*/
  getElementos() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }
  getHabitaciones() {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

}
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShAPIService {
  public baseURL:string;
  
  constructor(private http: HttpClient) { 
    this.baseURL = 'https://superheroapi.com/api.php/' + environment.access_token + '/';
  }

  public search(input_value:string): Observable<any> {
    // console.log(environment.access_token)
    // console.log(this.baseURL + "search/" + input_value)
    return this.http.get( this.baseURL + "search/" + input_value)
  }
  
}

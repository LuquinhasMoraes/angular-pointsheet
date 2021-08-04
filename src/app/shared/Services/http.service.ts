
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, of, pipe } from 'rxjs';
import { map, catchError, tap, retry, finalize } from 'rxjs/operators';

import 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// CONSTANT
@Injectable()
export class HttpService {
  private environment = "http://pointsheet-api.azurewebsites.net/";
  private tokenCadastroExterno;
  private tokenRemuneracao;
  private domain: string = '';
  public isSessionExpireOnce = false;
  idEscitorio: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}


  prepareUrl(endpoint, data: Array<any> = null): string {
    let url = `${this.environment}${endpoint}`;
    if (data) {
      url += '?';
    }
    for (const prop in data) {
      if (data[prop] !== null) {
        url += `${prop}=${data[prop]}&`;
      }
    }
    return url;
  }

  postObs(endpoint: string, data: any = null): Observable<any> {
    
    const headers = this.setUpHeaders();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post<any>(`${this.environment}${endpoint}`, data, { headers: headers })
      .pipe(this.responseHandler)
      .pipe(catchError(this.errorHandlerObs))
      .pipe(finalize(() => {
      }));
  }

  putObs(endpoint: string, data: any = null, exibeLoading: boolean = true): Observable<any> {
    
    const headers = this.setUpHeaders();
    headers.append('Content-Type', 'application/json');

    // const url = this.prepareUrl(endpoint, data);
    console.log(endpoint);
    return this.http
      .put<any>(`${this.environment}${endpoint}`, data, { headers: headers })
      .pipe(this.responseHandler)
      .pipe(catchError(this.errorHandlerObs))
      .pipe(finalize(() => {
      }));
  }

  deleteObsWithBody(endpoint: string, data: any = null): Observable<any> {
   
    const headers = this.setUpHeaders();
    headers.append('Content-Type', 'application/json');

    const options = {
      headers: headers,
      body: data,
    };
    
    return this.http
      .delete(`${this.environment}${endpoint}`, options)
      .pipe(map(this.responseHandler))
      .pipe(catchError(this.handleErrorRefactory('deleteObs', [])))
      .pipe(finalize(() => {
      }));
  }

  deleteObs(endpoint: string, data: any = null): Observable<any> {
    const headers = this.setUpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = this.prepareUrl(endpoint, data);
    console.log(url);
    
    
    return this.http
      .delete(url, { headers: headers })
      .pipe(map(this.responseHandler))
      .pipe(catchError(this.handleErrorRefactory('deleteObs', [])))
      .pipe(finalize(() => {
      }));
  }

  getObs(endpoint: string, data: any = null, exibeLoading: boolean = true): Observable<any> {
    
    const headers = this.setUpHeaders();
    const url = this.prepareUrl(endpoint, data);
    return this.http
      .get<any>(url, { headers: headers })
      .pipe(tap(this.responseHandler.bind(this)))
      .pipe(catchError(this.handleErrorRefactory('getObs', [])))
      .pipe(finalize(() => {
      }));
  }
  
  getObs3(url: string, data: any = null): Observable<any> {
    
    const headers = this.setUpHeaders();

    return this.http
      .get<any>(url, { headers: headers })
      .pipe(tap(this.responseHandler))
      .pipe(catchError(this.handleErrorRefactory('getObs3', [])))
      .pipe( finalize( () => {
      }));
  }

  getObs2(endpoint: string, data: any = null): Observable<any> {

    const headers = this.setUpHeaders();
    const url = this.prepareUrl(endpoint);


    return this.http
      .get<any>(url, { headers: headers, ...data })
      .pipe(tap(this.responseHandler))
      .pipe(catchError(this.handleErrorRefactory('getObs2', [])))
      .pipe(finalize(() => {
      }));
  }

  setUpHeaders(): HttpHeaders {
    let headers: any;
    headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    });
    return headers;
  
  }

  redirectLogin() {
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('domainGuid');
      localStorage.setItem('userLogged', '0');
      this.router.navigate(['/login']);
    }, 1000);
  }

  private responseHandler(response: any) {
    if (response.status === 401 && response.object === 403) {
      
      if(!this.isSessionExpireOnce) {
        this.isSessionExpireOnce = true;

        if (response.message != null) {
          // this.alertService.danger(response.message);
        } else {
          // this.alertService.danger('Sessão expirada, acesse novamente');
        }

        this.redirectLogin();
      }

    } else {
      return response;
    }
  }

  removeAllItemsOfLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('domainGuid');
    localStorage.setItem('userLogged', '0');
    localStorage.removeItem('classAtiva');
  }


  //TODO: Melhorar este código
  private handleErrorRefactory<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      
      if (result != null) {
        console.log('Resultado do erro ao solicitar API', result);
      }

      if (error.status === 401 || error.status === 0) {
        if(!this.isSessionExpireOnce) {
          this.isSessionExpireOnce = true;
          this.redirectLogin();
        }
      } 
      console.log(error);
      return of(result as T);
    };
  }

  errorHandler(error: any) {
    const erroPadrao = 'Erro ao realizar ação. Tente novamente mais tarde';
    if (error.status === 403 || error.status === 401) {
      if (error.url.includes('login')) {
        return Promise.reject(error);
      }
      this.router.navigate(['/']);
      return null;
    } else if (error.status === 400) {
    } else if (error.status === 500) {
      error.message = erroPadrao;
    }
    return Promise.reject(error.message || erroPadrao);
  }
  errorHandlerObs(error: any) {
    const erroPadrao = 'Erro ao realizar ação. Tente novamente mais tarde';
    if (error.status === 403 || error.status === 401) {
      if (error.url.includes('login')) {
        return throwError(new Error(error.message || erroPadrao));
      }
      this.router.navigate(['/']);
      return null;
    } else if (error.status === 400) {
      error.message = error.json().mensagem;
    } else if (error.status === 500) {
      error.message = erroPadrao;
    }
    return throwError(new Error(error.message || erroPadrao));
  }
}

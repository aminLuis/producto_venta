import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../models/Categoria.interface';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL = environment.URL_API_CATEGORIA;

@Injectable({
  providedIn: 'root'
})
export class CategoriaServiceService {

  private refresh = new Subject<void>();

  get reload(){
    return this.refresh;
  }

  constructor(private http:HttpClient) { }

  getCategorias():Observable<Categoria[]>{
    return this.http.get<Categoria[]>(URL)
    .pipe(
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

  getCategoria(ID:BigInt):Observable<Categoria>{
    return this.http.get<Categoria>(URL+"/"+ID)
    .pipe(
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

  saveCategoria(nueva:Categoria):Observable<Categoria>{
    return this.http.post<Categoria>(URL,nueva)
    .pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

  updateCategoria(categoria:Categoria):Observable<Categoria>{
    return this.http.put<Categoria>(URL+"/"+categoria.id,categoria)
    .pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

  deleteCategoria(ID:BigInt):Observable<{}>{
    return this.http.delete<Categoria>(URL+"/"+ID)
    .pipe(
      tap(()=>{
        this.refresh.next();
      }),
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

}

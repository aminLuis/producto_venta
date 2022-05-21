import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/Producto.interface';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL = environment.URL_API_PRODUCTO;


@Injectable({
  providedIn: 'root'
})
export class ProductoServiceService {

  private refresh = new Subject<void>();

  get reload(){
    return this.refresh;
  }

  constructor(private http:HttpClient) { }

  getProductos():Observable<Producto[]>{
    return this.http.get<Producto[]>(URL)
    .pipe(
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

  getProducto(ID:BigInt):Observable<Producto>{
    return this.http.get<Producto>(URL+"/"+ID)
    .pipe(
      catchError(e=>{
        console.log(e);
        return throwError(e);
      })
    );
  }

  saveProducto(nuevo:Producto):Observable<Producto>{
    return this.http.post<Producto>(URL,nuevo)
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

  updateProducto(producto:Producto):Observable<Producto>{
    return this.http.put<Producto>(URL+"/"+producto.id,producto)
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

  deleteProducto(ID:BigInt):Observable<{}>{
    return this.http.delete<Producto>(URL+"/"+ID)
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

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {retry, catchError, map} from "rxjs/operators";
import {throwError, zip} from "rxjs";
import {Product, CreateProductDTO, UpdateProductDTO} from "../../models/product.model";
import { environment } from './../../environments/environment';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl =`${environment.API_URL}/api/products`;
    //
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number){
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, {params})
    .pipe(
      retry(3),
      map(products => products.map(item => {
      return {
        ...item,
        taxes: .16 * item.price,
      }
      }))
    );
  }
  getProduct(id: string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse)=>{
          if(error.status === HttpStatusCode.Conflict){
            return throwError(()=> new Error('Algo salio mal en el server'));
          }
          if(error.status === HttpStatusCode.NotFound){
            return throwError(() => new Error("El producto no existe"));
          }
          if(error.status === HttpStatusCode.Unauthorized){
            return throwError(() => new Error("No esta autorizado"));
          }
          return throwError(() => new Error("Ups"));
        })
      )
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO){
    return  zip(
      this.getProduct(id),
      this.update(id,dto)
    );
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`,{
      params: { limit, offset }
    })

  }
  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }
  delete(id: string){
    return this.http.get<boolean>(`${this.apiUrl}/${id}`)
  }
}


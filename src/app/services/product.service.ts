import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Corrigido: sempre envia favorite e bought como false ao criar produto
  addProduct(product: Omit<Product, 'id' | 'favorite' | 'bought'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, {
      ...product,
      favorite: false,
      bought: false
    });
  }

  // Corrigido: permite enviar todos os campos necessários no update
  updateProduct(id: string, updatedProduct: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, updatedProduct);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateBought(id: string, bought: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/bought`, { bought });
  }
  
}
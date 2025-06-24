import { Component, inject, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addCircle, pricetag, star, starOutline, peopleOutline, peopleCircleOutline, checkboxOutline, cloudUpload, statsChart } from 'ionicons/icons';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  productService = inject(ProductService);
  products!: Observable<Product[]>;
  favoriteProducts!: Observable<Product[]>;
  error: string | null = null;

  constructor() {
    addIcons({
      addCircle,
      pricetag,
      star,
      starOutline,
      peopleOutline,
      peopleCircleOutline,
      checkboxOutline,
      cloudUpload,
      statsChart,
    });
    this.reloadProducts();
  }

  ngOnInit() { }

  reloadProducts() {
    this.products = this.productService.getProducts();
    this.favoriteProducts = this.products.pipe(
      map(products => products.filter(p => p.favorite))
    );
  }

  toggleFavorite(product: Product): void {
    this.productService.updateProduct(product.id, {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      bought: product.bought,
      favorite: !product.favorite
    }).subscribe({
      next: () => this.reloadProducts(),
      error: (err) => {
        this.error = 'Erro ao atualizar produto';
        console.error('Erro ao favoritar:', err);
      }
    });
  }
}
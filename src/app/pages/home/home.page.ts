import { Component, inject, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import { addCircle, pricetag, star, starOutline, peopleOutline, peopleCircleOutline, checkboxOutline, cloudUpload, statsChart } from 'ionicons/icons';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  productService = inject(ProductService);
  products = this.productService.getProducts();

  constructor() {
    addIcons({addCircle,pricetag,star,starOutline,peopleOutline,peopleCircleOutline,checkboxOutline,cloudUpload,statsChart,});
  }

  ngOnInit() {}

  // Get only favorite products
  favoriteProducts = () => this.products().filter((p) => p.favorite);

  toggleFavorite(productId: string) {
    const product = this.products().find((p: any) => p.id === productId);
    if (product) {
      this.productService.updateProduct(productId, {
        favorite: !product.favorite,
      });
    }
  }
}

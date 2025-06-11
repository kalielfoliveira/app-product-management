import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { create, trash, alertCircle, add, star, starOutline, ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrls: ['./products-list.page.scss'],
  standalone: false,
})
export class ProductsListPage implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products = this.productService.getProducts();

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(33)]],
    description: ['', [Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(1)]],
  });

  editingProduct: Product | null = null;

  constructor() {
    addIcons({
      create,
      trash,
      alertCircle,
      add,
      star,
      starOutline,
      ellipseOutline,
      checkmarkCircle,
    });
  }

  ngOnInit(): void {
    console.log('ProductsListPage initialized');
  }

  hasError(field: string, error: string) {
    const formControl = this.productForm.get(field);
    return formControl?.touched && formControl?.errors?.[error]
  }

  ngAfterViewInit(): void {
    console.log('View initialized');
  }

  ngOnDestroy(): void {
    console.log('ProductsListPage destroyed');
    console.log('Future Feature: save state to localStorage.');
  }

  onSubmit(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
      });
      this.editingProduct = null;
    } else {
      const newProduct: Omit<Product, 'id' | 'favorite' | 'bought'> = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
      };
      this.productService.addProduct(newProduct);
    }
    this.productForm.reset();
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  }

  cancel(): void {
    this.editingProduct = null;
    this.productForm.reset();
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id);
  }

  toggleBought(product: Product): void {
    this.productService.updateProduct(product.id, { bought: !product.bought });
  }

  toggleFavorite(product: Product): void {
    this.productService.updateProduct(product.id, {
      favorite: !product.favorite,
    });
  }
}

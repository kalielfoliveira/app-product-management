import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addIcons } from 'ionicons';
import { create, trash, alertCircle, add, star, starOutline, ellipseOutline, checkmarkCircle } from 'ionicons/icons';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrls: ['./products-list.page.scss'],
  standalone: false,
})
export class ProductsListPage implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private toastController = inject(ToastController);

  products: Product[] = [];
  loading = false;
  error: string | null = null;

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(100)]],
    price: [[Validators.required, Validators.min(1)]],
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
    this.loadProducts();
  }

  async showToastError(header: string, message: string) {
    const toast = await this.toastController.create({
      message,
      header,
      color: 'danger',
      position: 'top',
      duration: 4000,
      buttons: [
        { text: 'X', role: 'cancel' }
      ]
    });
    toast.present();
  }

  loadProducts(): void {
  this.loading = true;
  this.productService.getProducts().subscribe({
    next: (data) => {
      this.products = data.sort((a, b) => a.name.localeCompare(b.name));
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Erro ao carregar produtos';
      this.loading = false;
      this.showToastError('Erro ao carregar produtos!', err.error?.message || 'Erro ao carregar produtos');
      console.error(err);
    }
  });
}

  hasError(field: string, error: string) {
    const formControl = this.productForm.get(field);
    return formControl?.touched && formControl?.errors?.[error];
  }

  onSubmit(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        bought: this.editingProduct?.bought,
        favorite: this.editingProduct?.favorite
      }).subscribe({
        next: () => {
          this.loadProducts();
          this.editingProduct = null;
          this.productForm.reset();
        },
        error: (error) => {
          this.error = 'Erro ao atualizar produto';
          this.showToastError('Erro ao atualizar produto!', error.error?.message || 'Erro ao atualizar produto');
          console.error(error);
        }
      });
    } else {
      const newProduct: Omit<Product, 'id' | 'favorite' | 'bought'> = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
      };
      this.productService.addProduct(newProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.productForm.reset();
        },
        error: (error) => {
          this.error = 'Erro ao adicionar produto';
          this.showToastError('Erro ao adicionar produto!', error.error?.message || 'Erro ao adicionar produto');
          console.error(error);
        }
      });
    }
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
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (error) => {
        this.error = 'Erro ao deletar produto';
        this.showToastError('Erro ao deletar produto!', error.error?.message || 'Erro ao deletar produto');
        console.error(error);
      }
    });
  }

  toggleBought(product: Product): void {
  this.productService.updateBought(product.id, !product.bought).subscribe({
    next: () => this.loadProducts(),
    error: (error: any) => {
      this.error = 'Erro ao atualizar produto';
      this.showToastError('Erro ao atualizar produto!', error.error?.message || 'Erro ao atualizar produto');
      console.error(error);
    }
  });
}

  toggleFavorite(product: Product): void {
    this.productService.updateProduct(product.id, {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      bought: product.bought,
      favorite: !product.favorite
    }).subscribe({
      next: () => this.loadProducts && this.loadProducts(),
      error: (error) => {
        this.error = 'Erro ao atualizar produto';
        this.showToastError('Erro ao favoritar produto!', error.error?.message || 'Erro ao atualizar produto');
        console.error('Erro ao favoritar:', error);
      }
    });
  }

  
}
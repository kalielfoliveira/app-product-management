import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = signal<Product[]>([]);

  constructor() {
    this.initializeProducts();
  }

  private initializeProducts(): void {
    const initialData = [
      {
        id: 'm856pnjw6sa28b8h6',
        name: 'Livro de ANGULAR',
        description: 'Livro sobre aprendizado de código do Framework ANGULAR',
        price: 50,
        favorite: true,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt',
        name: 'Mouse Razer',
        description: 'Mouse gamer com RGB e 16000 DPI',
        price: 250,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt2',
        name: 'Teclado Mecânico XPG',
        description: 'Teclado mecânico com iluminação RGB e switches mecânicos',
        price: 900,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt3',
        name: 'Monitor 4K LG',
        description: 'Monitor 4K com taxa de atualização de 144Hz',
        price: 2000,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt4',
        name: 'Cadeira Gamer DXRacer',
        description: 'Cadeira gamer ergonômica com apoio para os pés',
        price: 1500,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt5',
        name: 'Fone de Ouvido Bluetooth Sony',
        description: 'Fone de ouvido Bluetooth com cancelamento de ruído',
        price: 800,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt6',
        name: 'Webcam Logitech 1080p',
        description: 'Webcam com resolução 1080p e microfone embutido',
        price: 300,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt7',
        name: 'Carregador Portátil Anker',
        description: 'Carregador portátil com capacidade de 20000mAh',
        price: 150,
        favorite: false,
        bought: false,
      },
      {
        id: 'm856pnjxcx8ivsfwt8',
        name: 'Livro Framework IONIC',
        description: 'Livro sobre aprendizado de código do Framework IONIC',
        price: 50,
        favorite: true,
        bought: false,}
    ];
    this.products.set(initialData);
  }

  getProducts() {
    return this.products.asReadonly();
  }

  addProduct(product: Omit<Product, 'id' | 'favorite' | 'bought'>): void {
    this.products.update((items) => [
      ...items,
      {
        ...product,
        id: this.generateId(),
        favorite: false,
        bought: false,
      },
    ]);
  }

  updateProduct(id: string, updatedProduct: Partial<Product>): void {
    this.products.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, ...updatedProduct } : item
      )
    );
  }

  deleteProduct(id: string): void {
    this.products.update((items) => items.filter((item) => item.id !== id));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
  }
}

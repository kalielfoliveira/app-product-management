import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListPage } from './products-list.page';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RealPipe } from 'src/app/pipes/realpipe.pipe';
import { ProductService } from '../../services/product.service';
import { By } from '@angular/platform-browser';
import { Product } from '../../models/product';

const productServiceSpy = jasmine.createSpyObj('ProductService', [
  'getProducts',
  'addProduct',
  'updateProduct',
  'deleteProduct',
]);

productServiceSpy.getProducts.and.returnValue(() => []);

describe('ProductsListPage', () => {
  let component: ProductsListPage;
  let fixture: ComponentFixture<ProductsListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        CommonModule,
        RealPipe,
      ],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Form Validation', () => {
    it('should mark the form invalid if name is empty', () => {
      component.productForm.controls['name'].setValue('');
      expect(component.productForm.valid).toBeFalse();
    });

    it('should mark the form invalid if price is less than 1', () => {
      component.productForm.controls['price'].setValue(0);
      expect(component.productForm.controls['price'].valid).toBeFalse();
      expect(
        component.productForm.controls['price'].hasError('min')
      ).toBeTrue();
    });

    it('should mark the form invalid if description exceeds maximum length', () => {
      component.productForm.controls['description'].setValue('a'.repeat(101));
      expect(component.productForm.controls['description'].valid).toBeFalse();
      expect(
        component.productForm.controls['description'].hasError('maxlength')
      ).toBeTrue();
    });

    it('should mark the form as valid when all fields are valid', () => {
      component.productForm.setValue({
        name: 'Test Product',
        description: 'Valid desc',
        price: 10,
      });
      expect(component.productForm.valid).toBeTrue();
    });
  });

  describe('Service Method Calls', () => {
    it('should call addProduct when submitting a new product', () => {
      component.productForm.setValue({
        name: 'New Product',
        description: 'New desc',
        price: 15,
      });
      component.editingProduct = null;
      component.onSubmit();
      expect(productServiceSpy.addProduct).toHaveBeenCalledWith({
        name: 'New Product',
        description: 'New desc',
        price: 15,
      });
    });

    it('should call updateProduct when editing an existing product', () => {
      const fakeProduct: Product = {
        id: '123',
        name: 'Old Name',
        description: 'Old desc',
        price: 5,
        favorite: false,
        bought: false,
      };
      component.editingProduct = fakeProduct;
      component.productForm.setValue({
        name: 'Updated Name',
        description: 'Updated desc',
        price: 20,
      });
      component.onSubmit();
      expect(productServiceSpy.updateProduct).toHaveBeenCalledWith('123', {
        name: 'Updated Name',
        description: 'Updated desc',
        price: 20,
      });
    });
  });

  describe('DOM Interactions', () => {
    it('should display an error note when price is invalid', () => {
      component.productForm.controls['price'].setValue(0);
      fixture.detectChanges();
      const errorNote = fixture.debugElement.query(
        By.css('ion-note[slot="error"]')
      );
      expect(errorNote).toBeTruthy();
      expect(errorNote.nativeElement.textContent).toContain(
        'Price must be greater than 0'
      );
    });

    it('should call deleteProduct when the delete button is clicked', async () => {
      const fakeProduct: Product = {
        id: '456',
        name: 'Test Product',
        description: 'Desc',
        price: 20,
        favorite: false,
        bought: false,
      };
      productServiceSpy.getProducts.and.returnValue(() => [fakeProduct]);
      component.products = productServiceSpy.getProducts();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const deleteButtonDe = fixture.debugElement.query(By.css('.delete-btn'));
      console.log('Delete deleteButtonDe:', deleteButtonDe);
      deleteButtonDe.nativeElement.click();
      fixture.detectChanges();

      expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('456');
    });


    it('should reset the form when the cancel button is clicked', () => {
      component.editingProduct = {
        id: '321',
        name: 'Edit Product',
        description: 'Edit Desc',
        price: 50,
        favorite: false,
        bought: false,
      };
      component.productForm.setValue({
        name: 'Edit Product',
        description: 'Edit Desc',
        price: 50,
      });
      fixture.detectChanges();

      const cancelButtonDe = fixture.debugElement.query(By.css('#cancel-btn'));
      console.log('cancelButtonDe:', cancelButtonDe);

      expect(cancelButtonDe).toBeTruthy();

      cancelButtonDe.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.editingProduct).toBeNull();
      expect(component.productForm.value.name).toBeNull();
      expect(component.productForm.value.description).toBeNull();
      expect(component.productForm.value.price).toBeNull();
    });
  });
});

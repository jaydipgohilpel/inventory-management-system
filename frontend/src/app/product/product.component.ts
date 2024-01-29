import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Category, Product, ProductDialogData } from '../interface/products.interface';
import { NotificationService } from '../services/notification.service';
import { ProductsService } from '../services/products.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  products: Product[] = [];
  categories: Category[] = [];
  displayedColumns: string[] = ['no', 'product_name', "description", 'category_name', 'cost_price', 'selling_price',
    'quantity_in_stock', 'reorder_point', 'actions'];

  dataSource = new MatTableDataSource<Product>(this.products);
  selectedProduct: Product | null = null;

  constructor(
    private productsService: ProductsService,
    public notificationService: NotificationService,
    private sharedService: SharedService,
    public dialog: MatDialog,
  ) {
    this.sharedService.setIsAuthentic('Products');
  }

  ngOnInit(): void {
    this.getProductList();
    this.sharedService.deleteDialogResult$.subscribe(show => {
      if (show.component === this.constructor.name && show.confirm) this.deleteProduct();
    })
    this.getCategoryList();
  }

  getProductList(): void {
    try {
      this.productsService.getProductsList().subscribe((product) => {
        if (!product.data) return;
        this.products = product.data;
        this.loadData();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  getCategoryList(): void {
    try {
      this.productsService.getCategoryList().subscribe((category) => {
        if (!category.data) return;
        this.categories = category.data;
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  loadData(): void {
    this.dataSource = new MatTableDataSource<Product>(this.products);
    this.dataSource.paginator = this.paginator;
  }


  openAddProductDialog(element: null | Product = null): void {
    const dialogRef = this.dialog.open(ProductDialog, {
      data: { isUpdate: element ? true : false, data: element, categories: this.categories },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || !result.form.valid) return;
      try {
        if (element) {
          this.productsService.updateProduct(
            element._id as string,
            result.form.value,
          ).subscribe((product) => {
            if (!product.data || !product?.data?.modifiedCount) return;

            const index = this.products.findIndex(product => product._id == element?._id);
            if (index !== -1) {
              const category = this.categories.find(category => category._id === result?.form?.value?.category_id);
              this.products[index] = {
                ...this.products[index],
                ...result.form.value,
                category_name: category?.category_name || ''
              };
              this.loadData();
            }
            this.notificationService.showSuccess('Product Updated Successfully!');
          })
        }
        else {
          this.productsService.addProduct(
            result.form.value,
          ).subscribe((product) => {
            if (!product.data) return;
            this.products.unshift(product.data);
            this.loadData();
            this.notificationService.showSuccess('Product Added Successfully!');
          })
        }
      } catch (error: any) {
        this.notificationService.showError('Something went wrong:' + error);
      }
    });
  }

  public openDeleteModel(element: Product): void {
    this.selectedProduct = element;
    this.sharedService.setIsDeleteDialogShow(true, this.constructor.name);
  }

  deleteProduct(): void {
    if (!this.selectedProduct?._id) return;
    try {
      this.productsService.deleteProduct(
        this.selectedProduct._id as string
      ).subscribe((product) => {
        if (!product.data || !product?.data?.deletedCount) return;
        this.notificationService.showSuccess('Product deleted Successfully!');
        const indexToRemove = this.products.findIndex(category => category._id == this.selectedProduct?._id);
        if (indexToRemove !== -1) {
          this.products.splice(indexToRemove, 1);
          this.loadData();
        }
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }
}

NgModule({
  declarations: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
  ]
})
@Component({
  selector: 'product-dialog',
  templateUrl: 'product-dialog.html',
  styleUrls: ['./product.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatIconModule
  ],
})
export class ProductDialog {
  productForm: FormGroup;
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
  ) {
    if (!data.isUpdate) {
      this.productForm = this.fb.group({
        product_name: ['', [Validators.required, Validators.maxLength(30)]],
        description: [''],
        category_id: ['', Validators.required],
        cost_price: ['', Validators.required],
        selling_price: ['', Validators.required],
        quantity_in_stock: ['', Validators.required],
        reorder_point: [''],
      });
    } else {
      const formValue = this.data.data;
      this.productForm = this.fb.group({
        product_name: [formValue.product_name, [Validators.required, Validators.maxLength(30)]],
        description: [formValue.description],
        category_id: [formValue.category_id, Validators.required],
        cost_price: [formValue.cost_price, Validators.required],
        selling_price: [formValue.selling_price, Validators.required],
        quantity_in_stock: [formValue.quantity_in_stock, Validators.required],
        reorder_point: [formValue.reorder_point],
      });
    }
    this.categories = this.data?.categories;
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onSaveClick(): void {
    this.data.form = this.productForm;
    this.dialogRef.close(this.data);
  }

}

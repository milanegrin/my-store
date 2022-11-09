import {Component, OnInit} from '@angular/core';
import {switchMap } from 'rxjs/operators';
import {zip } from 'rxjs';

import {Product, CreateProductDTO, UpdateProductDTO} from "../../../models/product.model";

import {StoreService} from '../../services/store.service';
import {ProductsService} from "../../services/products.service";

import {subscribeOn} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = []
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';
  // today = new Date();
  // date = new Date(2021,1,20);

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductsByPage(10, 0)
      .subscribe(data => {
        this.products = data;
      });
  }

  OnAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
    //this.total = this.myShoppingCart.reduce((sum, item) => sum + item.price, 0);
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.toggleProductDetail();
    this.productsService.getProduct(id)
      .subscribe(data => {
        this.productChosen = data;
        this.statusDetail = 'success';
      },errorMsg => {
        this.statusDetail = 'error';
        Swal.fire({
          title: errorMsg,
          text: errorMsg,
          icon: 'error',
          confirmButtonText:'Bye'
        })
      })
  }

  readAndUpdate(id: string){
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product) => this.productsService.update(product.id,{title:'change'})),
          )
        .subscribe(data => {
          console.log();
        });
    this.productsService.fetchReadAndUpdate(id, {title:'change'})
    .subscribe(response =>{
      const read = response[0];
      const update = response[1];
    })
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo producto',
      description: 'bla bla',
      price: 1000,
      images: [`https://placeimg.com/640/480/any?random=${Math.random()}`],
      categoryId: 2,
    }
    this.productsService.create(product)
      .subscribe(data => {
        this.products.unshift(data);
      })
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'change title',
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
      .subscribe(data => {
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products[productIndex] = data;
        this.productChosen = data;
        // const product = this.products

      })
  }

  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id)
      .subscribe(data =>{
        const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
  }

  loadMore() {
    this.productsService.getProductsByPage(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
      }
}

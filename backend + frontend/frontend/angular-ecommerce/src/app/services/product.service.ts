import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { NumberSymbol } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number) {
    const productUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(productUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage: number, 
    thePageSize: number, 
    theCategoryId: number): Observable<GetResponseProducts>{

   // need to build URL based on category id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {

    // build url based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(
    thePage: number, 
    thePageSize: number, 
    theKeyword: string): Observable<GetResponseProducts>{

   // need to build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductsCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }




}


interface GetResponseProducts{
  _embedded:{
    products: Product[];
  }
  page:{
    size: number,
    totalElements: number,
    totaPages: number,
    number:number
  }
}

interface GetResponseProductsCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}

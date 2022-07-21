import { collection } from "../../config/dbCollection";
import { IService } from "../../config/interface";
import {Request} from "express"
import { paginationAndSortAggregate } from "../../utils/sort&pagination";

class ProductsServices implements IService {
  public db1Collection;

  constructor(collection: any) {
    this.db1Collection = collection.db1Inst;
  }

  async createProducts(body:Record<string,unknown>) {
    return this.db1Collection.instance.models.Products.create(body)
  }

  async getAllProducts(query: Request['query']) {
    const paginationAndSort = paginationAndSortAggregate(query);
    return this.db1Collection.instance.models.Products.aggregate([
      paginationAndSort
    ]);
  }
  
  async getProductById(id:string) {
    return this.db1Collection.instance.models.Products.findById(id)
  }

  async editProducts(id:string,where:Record<string,unknown>) {
    return this.db1Collection.instance.models.Products.findByIdAndUpdate(id,where,{new:true})
  }

  async deleteProducts(id:string) {
    return this.db1Collection.instance.models.Products.findByIdAndDelete(id)
  }


}

export const productsServices = new ProductsServices(collection);

import { collection } from "../../config/dbCollection";
import { IService } from "../../config/interface";
import {Request} from "express"
import { paginationAndSortAggregate } from "../../utils/sort&pagination";

class CategoriesServices implements IService {
  public db1Collection;

  constructor(collection: any) {
    this.db1Collection = collection.db1Inst;
  }

  async createCategories(body:Record<string,unknown>) {
    return this.db1Collection.instance.models.Categories.create(body)
  }

  async getAllCategories(query: Request['query']) {
    const paginationAndSort = paginationAndSortAggregate(query);
    return this.db1Collection.instance.models.Categories.aggregate([
      paginationAndSort
    ]);
  }
  
  async getProductById(id:string) {
    return this.db1Collection.instance.models.Categories.findById(id)
  }

  async editCategories(id:string,where:Record<string,unknown>) {
    return this.db1Collection.instance.models.Categories.findByIdAndUpdate(id,where,{new:true})
  }

  async deleteCategories(id:string) {
    return this.db1Collection.instance.models.Categories.findByIdAndDelete(id)
  }


}

export const categoriesServices = new CategoriesServices(collection);

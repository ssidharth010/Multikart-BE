import { collection } from "../../config/dbCollection";
import { IService } from "../../config/interface";
import {Request} from "express"
import { paginationAndSortAggregate } from "../../utils/sort&pagination";

class SubCategoriesServices implements IService {
  public db1Collection;

  constructor(collection: any) {
    this.db1Collection = collection.db1Inst;
  }

  async createSubCategories(body:Record<string,unknown>) {
    return this.db1Collection.instance.models.SubCategories.create(body)
  }

  async getAllSubCategories(query: Request['query']) {
    const paginationAndSort = paginationAndSortAggregate(query);
    return this.db1Collection.instance.models.SubCategories.aggregate([
      paginationAndSort
    ]);
  }
  
  async getSubCategoryById(id:string) {
    return this.db1Collection.instance.models.SubCategories.findById(id)
  }

  async getSubCategoryByCategoryId(id:string) {
    return this.db1Collection.instance.models.SubCategories.find( { category_id: id } )
  }

  async editSubCategories(id:string,where:Record<string,unknown>) {
    return this.db1Collection.instance.models.SubCategories.findByIdAndUpdate(id,where,{new:true})
  }

  async deleteSubCategories(id:string) {
    return this.db1Collection.instance.models.SubCategories.findByIdAndDelete(id)
  }


}

export const subcategoriesServices = new SubCategoriesServices(collection);

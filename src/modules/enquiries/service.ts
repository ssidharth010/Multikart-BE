import { collection } from "../../config/dbCollection";
import { IService } from "../../config/interface";
import {Request} from "express"

class EnquiriesServices implements IService {
  public db1Collection;

  constructor(collection: any) {
    this.db1Collection = collection.db1Inst;
  }

  async createEnquiries(body:Record<string,unknown>) {
    return this.db1Collection.instance.models.Enquiries.create(body)
  }

  async getAllEnquiries(query: Request['query']) {
    return this.db1Collection.instance.models.Enquiries.find()
  }

  async deleteEnquiries(id:string) {
    return this.db1Collection.instance.models.Enquiries.findByIdAndDelete(id)
  }


}

export const enquiriesServices = new EnquiriesServices(collection);

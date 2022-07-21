import { Router } from "express";

export default abstract class Db {
  public options: any;
  public orm: any;
  public instance: any;

  constructor(orm: any) {
    this.orm = orm;
  }

  abstract connect(): void;
}

export interface IDbCollection {
  db1Inst: any;
  init(): Promise<this>;
}

export interface IRouter {
  publicRouter: Router;
  privateRouter: Router;
  getRoutes(): void;
}

export interface IService {
  db1Collection: IDbCollection["db1Inst"];
}

export interface StoreObj {
  avg_people_visit: string;
  avg_footfall: string;
  rating: string;
  equipment_cycle_prices: string
}

export interface IPopulation {
  population_id: {
    _doc: {
      marketing_profile: {
        marketing_id:{
          _doc: Record<string,unknown>
        },
        interest:number
      }[];
      service_profile: {
        service_id:{
          _doc: Record<string,unknown>
        },
        interest:number
      }[]
    }
  },
  percent: number
}

export interface IAddPopulation {
  marketing_profile: { marekting_id: string; interest: number }[];
  service_profile: { service_id: string; interest: number }[];
  name: string;
  image:string;
} 

export interface IEquipment {
  name:string;
  purchase_price:string;
  rent_price:string;
  rating:string;
  capacity:string;
  usage:string
}

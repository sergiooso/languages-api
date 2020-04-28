import {Request,Response} from "express";

import {Category, ICategory} from "../models/category.model";

import { MongooseDocument } from "mongoose";


class CategoryHelpers{

    GetCategory(filter: any):Promise<ICategory>{        
        return new Promise<ICategory>( (resolve) => {
            Category.find(filter,(err:Error,category:ICategory)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(category);
                }
            }); 
        });
    }
}


export class CategoryService extends CategoryHelpers{
    public getAll(req:Request, res:Response){
        Category.find({},(err:Error, categories: MongooseDocument)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(categories);
            }
            
        });
    }

    public async NewOne(req: Request, res: Response){        
        const c = new Category(req.body);
        const old_cat:any = await super.GetCategory({name:c.name});

        if( old_cat.length === 0 ){
            await c.save((err:Error, category: ICategory)=>{
                if(err){
                    res.status(401).send(err);
                }else{
                    res.status(200).json( category? {successed:true, category: category } : {successed:false} );
                }            
            });
        }else{
            res.status(200).json({successed:false});
        }        

    }

}

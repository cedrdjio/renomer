import { Category } from "./category";
import { Pos } from "./pos";

export class Product {
    id: number;
    name: string;
    image: string;
    description: string;
    category: Category;
    categoryId: string;
    price: number;
    reductionRate: number;
    quantity: string;
    pos: Pos;
    pointOfSaleId : string;
    isPromotion: boolean;
    addedAt: Date;
    publishDate: Date;
}

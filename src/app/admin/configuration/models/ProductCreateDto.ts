export class ProductCreateDto {
    name: string;
    description: string;
    price: number;
    quantity: number;
    reductionRate: number;
    pointOfSaleId: string;
    categoryId: string;

    constructor(
      name: string,
      description: string,
      price: number,
      quantity: number,
      reductionRate: number,
      pointOfSaleId: string,
      categoryId: string
    ) {
      this.name = name;
      this.description = description;
      this.price = price;
      this.quantity = quantity;
      this.reductionRate = reductionRate;
      this.pointOfSaleId = pointOfSaleId;
      this.categoryId = categoryId;
    }
  }

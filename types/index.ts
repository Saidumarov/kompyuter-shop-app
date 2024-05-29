export interface Product {
  _id: string;
  name: string;
  user: {
    id: string;
  };
  titel: string;
  imgags: { img: string }[];
  description: string;
  realPrice: number;
  oldPrice: number;
  perMonth: number;
  piece: number;
  category: string;
  brend: string;
  isDiscounts: boolean;
  count: number;
  like: boolean;
  __v: number;
}

import Product from '@/Models/Product';

export default interface Cart {
    id: number;
    amount: number;
    product_id: number;
    product: Product;
}

import axios from 'axios';

export interface PurchaseItem {
    product_id: number;
    amount: number;
    user_id: number;
}

class TransactionApi {
    public static async purchase(cart: PurchaseItem[]) {
        const response = await axios.post('/api/transactions', { cart });
        return response.data;
    }
}

export default TransactionApi

import axios from 'axios';

class CartApi {
    public static async index() {
        const response = await axios.get('/api/cart');
        return response.data;
    }
    public static async update(productId: number, amount: number) {
        const response = await axios.post('/api/cart/update', { product_id: productId, amount });
        return response.data;
    }
    public static async remove(productId: number) {
        const response = await axios.delete(`/api/cart/${productId}`);
        return response.data;
    }
}

export default CartApi;

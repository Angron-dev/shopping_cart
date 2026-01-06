import axios from 'axios';

class ProductApi {
    public static async list() {
        const response = await axios.get('/api/products');
        return response.data;
    }
}

export default ProductApi

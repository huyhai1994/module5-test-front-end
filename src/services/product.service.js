import {PRODUCTS_API_URL} from '../config/backend.config';
import axios from 'axios';

class ProductService {
    static async getAllProducts() {
        return await axios.get(PRODUCTS_API_URL);
    }
}

export default ProductService;
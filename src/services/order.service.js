import {ORDERS_API_URL} from '../config/backend.config';
import axios from 'axios';

class OrderService {
    static async getAllOrders() {
        return await axios.get(ORDERS_API_URL + '?_embed=product');
    }
}

export default OrderService;
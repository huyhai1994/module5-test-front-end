import {ORDERS_API_URL} from '../config/backend.config';
import axios from 'axios';

class OrderService {
    static async getAllOrders() {
        return await axios.get(ORDERS_API_URL + '?_embed=product');
    }

    static async getOrderById(id) {
        return await axios.get(ORDERS_API_URL + '/' + id);
    }

    static async updateOrder(id, updatedValues) {
        return await axios.put(ORDERS_API_URL + '/' + id, updatedValues);
    }

    static async createOrder(orderData) {
        return await axios.post(ORDERS_API_URL, orderData);
    }
}

export default OrderService;
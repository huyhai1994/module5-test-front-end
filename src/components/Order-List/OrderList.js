import React, {useEffect, useState} from 'react';
import {Button, Pagination, Table} from 'react-bootstrap';
import orderService from "../../services/order.service"; // Assuming you have an order service
import {useNavigate} from 'react-router-dom';
import './OrderList.css'; // Make sure to create and update this CSS file
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        orderService.getAllOrders().then(response => {
            setOrders(response.data);
        });
    }, []);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (<div className="container">
            <h4 className="card-title text-center my-5">Order List</h4>
            <div className='table-responsive'>
                <Button className='btn btn-primary float-end' onClick={() => navigate('/order-add')}>Add Order</Button>
                <Table dark striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Product Type</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentOrders.map((order, index) => (<tr key={order.id}>
                            <td className="number">{indexOfFirstOrder + index + 1}</td>
                            <td>{order.id}</td>
                            <td>{order.product.name}</td>
                            <td className="number">{order.product.price}</td>
                            <td>{order.product.type}</td>
                            <td>{order.date}</td>
                            <td className="number">{order.quantity}</td>
                            <td className="number">{order.product.price * order.quantity}</td>
                            <td className="__action-button-center">
                                <Button className='btn btn-primary' onClick={() => navigate('/order-edit/' + order.id)}>
                                    <FontAwesomeIcon icon={faPen}/>
                                </Button>
                            </td>
                        </tr>))}
                    </tbody>
                </Table>
                <Pagination className="d-flex justify-content-center">
                    {Array.from({length: Math.ceil(orders.length / ordersPerPage)}, (_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage}
                                         onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </Pagination.Item>))}
                </Pagination>
            </div>
        </div>);
};

export default OrderList;
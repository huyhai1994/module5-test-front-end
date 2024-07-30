import React, {useEffect, useState} from 'react';
import {Button, Pagination, Table} from 'react-bootstrap';
import orderService from "../../services/order.service"; // Assuming you have an order service
import {useNavigate} from 'react-router-dom';
import './OrderList.css'; // Make sure to create and update this CSS file
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {toast} from "react-toastify";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        orderService.getAllOrders().then(response => {
            const sortedOrders = response.data.sort((b, a) => b.product.price - a.product.price);
            setOrders(sortedOrders);
        });
    }, []);

    const handleFilter = () => {
        orderService.getAllOrders().then(response => {
            const filteredOrders = response.data.filter(order => {
                const orderDate = new Date(order.date);
                return (!startDate || orderDate >= new Date(startDate)) && (!endDate || orderDate <= new Date(endDate));
            });
            if (filteredOrders.length === 0) {
                toast.error('Không tìm thấy đơn hàng trong ngày bạn chọn..');
            }
            setOrders(filteredOrders);
        });
    };

    const formatDate = (dateString) => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    function setTopOrders(number) {
        const sortedOrders = [...orders].sort((a, b) => b.product.price - a.product.price);
        setOrders(sortedOrders.slice(0, number));
        setOrdersPerPage(number);
        setCurrentPage(1); // Reset to the first page
    }

    return (<div className="container">
        <h4 className="card-title text-center my-5">Thống kê đơn hàng</h4>
        <div className="d-flex justify-content-between mb-3">
            <div>
                <label htmlFor="startDate">Start Date: </label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
            </div>
            <div>
                <label htmlFor="endDate">End Date: </label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
            </div>
            <Button className="btn btn-primary" onClick={handleFilter}>Tìm kiếm </Button>
            <div>
                <label htmlFor="topOrders">Top: </label>
                <select id="topOrders" value={ordersPerPage} onChange={(e) => setTopOrders(Number(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={10}>10</option>
                </select>
            </div>
        </div>
        <div className='table-responsive'>
            <Button className='btn btn-success float-end' onClick={() => navigate('/order-add')}>Thêm mới đơn
                hàng</Button>
            <Table dark striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Mã đơn hàng</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Giá</th>
                    <th>Loại Sản Phẩm</th>
                    <th>Ngày mua</th>
                    <th>Số lượng</th>
                    <th>Tổng Tiền (USD)</th>
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
                    <td>{formatDate(order.date)}</td>
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
import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import {useFormik} from "formik";
import OrderService from "../../services/order.service";
import ProductService from "../../services/product.service";

const OrderEdit = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = React.useState(null);
    const [products, setProducts] = React.useState([]);

    const editSchema = Yup.object().shape({
        product: Yup.string().required("Trường này phải nhập"),
        price: Yup.number().required("Trường này phải nhập"),
        date: Yup.date().required("trường này phải nhập").max(new Date(), "Ngày mua không được lớn hơn ngày hiện tại"),
        quantity: Yup.number().required("Trường này phải nhập"),
    });

    const getProductNameById = (productId, products) => {
        const product = products.find(prod => prod.id === productId);
        return product ? product.name : '';
    };

    const editForm = useFormik({
        initialValues: {
            product: '', price: '', date: '', quantity: ''
        }, validationSchema: editSchema, onSubmit: (values) => {
            const product = products.find(prod => prod.name === values.product);
            const updatedValues = {...values, productId: product.id};
            OrderService.createOrder(updatedValues).then(response => {
                alert("Update succeeded");
                navigate('/');
            });
        }
    });

    useEffect(() => {
        ProductService.getAllProducts().then(response => {
            setProducts(response.data);
        });

        OrderService.getOrderById(id)
            .then(response => {
                setOrder(response.data);
                editForm.setValues({
                    product: getProductNameById(response.data.productId, products),
                    price: response.data.price,
                    date: response.data.date,
                    quantity: response.data.quantity
                });
            })
            .catch(error => {
                console.error('Error fetching order: ', error);
            });
    }, [id]);

    return (<div className='container mt-5'>
        <h1 className='text-center'>Tạo mới sản phẩm</h1>
        <form className='border p-3 rounded-3' onSubmit={editForm.handleSubmit}>
            <div className="mb-3">
                <label htmlFor="product" className="form-label">Sản phẩm</label>
                <select
                    name="product"
                    className="form-control"
                    id="product"
                    value={editForm.values.product}
                    onChange={editForm.handleChange}>
                    <option value="">Chọn sản phẩm</option>
                    {products.map(product => (<option key={product.id} value={product.name}>
                        {product.name}
                    </option>))}
                </select>
                {editForm.errors.product && <div className="text-danger">{editForm.errors.product}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="price" className="form-label">Giá tiền</label>
                <input
                    type="number"
                    name="price"
                    value={editForm.values.price}
                    className="form-control"
                    onChange={editForm.handleChange}
                    id="price"
                />
                {editForm.errors.price && <div className="text-danger">{editForm.errors.price}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                    type="date"
                    name="date"
                    className="form-control"
                    onChange={editForm.handleChange}
                    value={editForm.values.date}
                    id="date"
                />
                {editForm.errors.date && <div className="text-danger">{editForm.errors.date}</div>}
            </div>
            <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Số lượng</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    onChange={editForm.handleChange}
                    value={editForm.values.quantity}
                    id="quantity"
                />
                {editForm.errors.quantity && <div className="text-danger">{editForm.errors.quantity}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100">Gửi</button>
        </form>
    </div>);
};

export default OrderEdit;
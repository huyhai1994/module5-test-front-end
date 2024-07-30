import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import orderService from "../../services/order.service";
import productService from "../../services/product.service";
import {toast} from "react-toastify";

const OrderAdd = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const validationSchema = Yup.object().shape({
        product: Yup.string().required('Trường này cần phải điền'),
        price: Yup.number().required('trường này cần phải điền ').positive('Giá phải lớn hơn 0'),
        date: Yup.date().required('trường này cần phải điển ').max(new Date(), "Ngày mua không được lớn hơn ngày hiện tại"),
        quantity: Yup.number().required('Trường này cần phải điền ').min(1, 'số lượng phải là số nguyên lớn hơn 0')
    });

    useEffect(() => {
        productService.getAllProducts().then(response => {
            setProducts(response.data);
        }).catch(error => {
            toast.error('Failed to fetch products');
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            product: '', price: '', date: '', quantity: ''
        }, validationSchema: validationSchema, onSubmit: (values, {setSubmitting, resetForm}) => {
            const product = products.find(prod => prod.name === values.product);
            const orderData = {...values, productId: product.id};


            orderService.createOrder(orderData).then(() => {
                toast.success('Thêm sản phẩm mới thành công !');
                resetForm();
                navigate('/');
            }).catch(error => {
                toast.error('Sản phẩm thêm thất bại!');
            }).finally(() => {
                setSubmitting(false);
            });
        }
    });

    return (
        <div className="container">
            <h4 className="card-title text-center my-5">Thêm mới sản phẩm</h4>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="product" className="form-label">Sản phẩm</label>
                    <select
                        name="product"
                        value={formik.values.product}
                        onChange={formik.handleChange}
                        className="form-control"
                        id="product"
                    >
                        <option value="">Vui lòng chọn sản phẩm</option>
                        {products.map(product => (
                            <option key={product.id} value={product.name}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    {formik.errors.product && <div className="text-danger">{formik.errors.product}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Giá </label>
                    <input
                        type="number"
                        name="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        className="form-control"
                        id="price"
                    />
                    {formik.errors.price && <div className="text-danger">{formik.errors.price}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Ngày mua</label>
                    <input
                        type="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        className="form-control"
                        id="date"
                        max={new Date().toISOString().split("T")[0]} // This sets the maximum date to today
                    />
                    {formik.errors.date && <div className="text-danger">{formik.errors.date}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Số lượng</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        className="form-control"
                        id="quantity"
                    />
                    {formik.errors.quantity && <div className="text-danger">{formik.errors.quantity}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}>
                    Add Order
                </button>
            </form>
        </div>
    );
};

export default OrderAdd;
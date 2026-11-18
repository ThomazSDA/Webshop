import { useParams } from "react-router";
import type { OrderDTO } from "../types/models";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../App";
import { format } from "date-fns";
import '../styles/shoppingcart.css';

const ThankYouPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const numericOrderId = Number(orderId);

    const { data: order, isLoading, error} = useQuery<OrderDTO>({
        queryKey: ['order'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/orders/${orderId}`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error("Order not found");
        }
        return response.json();
        },
    });

    if (isLoading) return <p>Loading user...</p>;

    if (error) return <p>Error!</p>;

    if (!order) return  <p>No order found!</p>;

    return (
        <>
        <h2>Thank you for your order!</h2>
        <span>Order #{numericOrderId}</span>
        <hr />
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Price/pc</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {order.orderItems.map(item => (
            <tr key={item.id}>
                <td><img src={item.ImageURL} width={50} height={50}/></td>
                <td>{item.productName}</td>
                <td>{item.amount}</td>
                <td>{item.priceAtPurchase.toFixed(2)}</td>
                <td>{(item.priceAtPurchase * item.amount).toFixed(2)}</td>
            </tr>
        ))}
            </tbody>
        </table>
        
        <span>Order placed on { format(new Date(order.createdAt), "dd-MM-yyyy" )}</span>
        <div className="price-table">
            <div className="row">
                <div className="cell label">Subtotal</div>
                <div className="cell currency">€</div>
                <div className="cell amount">{order.subTotalPrice.toFixed(2)}</div>
                <div className="cell note"></div>
            </div>

            <div className="row">
                <div className="cell label">Shipping</div>
                <div className="cell currency">€</div>
                <div className="cell amount">{order.shippingCost.toFixed(2)}</div>
                <div className="cell note">({order.shippingMethod})</div>
            </div>

            <div className="row total">
                <div className="cell label">Total</div>
                <div className="cell currency">€</div>
                <div className="cell amount">{order.totalPrice.toFixed(2)}</div>
                <div className="cell note"></div>
            </div>
        </div>
        <img src="/images/other/feest.jpg" width="250" height="250"/>
        </>
    )
}

export default ThankYouPage;
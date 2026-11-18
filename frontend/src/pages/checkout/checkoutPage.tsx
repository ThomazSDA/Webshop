import { useMutation } from "@tanstack/react-query";
import { clearCart, useCartStore } from "../../components/stores/cartStore";
import type { PlaceOrderRequest, ShippingMethodDTO } from "../../types/models";
import { API_URL } from "../../App";
import { useNavigate } from "react-router";
import { useState } from "react";
import '../../styles/shoppingcart.css';
import BillingAddress from "./BillingAddress";
import ShippingMethods from "./ShippingMethods";
import PaymentMethods from "./PaymentMethods";

const CheckoutPage = () => {
    const { cart } = useCartStore();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [shipping, setShipping] = useState<ShippingMethodDTO | null>(null);

    const placeOrderMutation = useMutation({
        mutationFn: async (data : PlaceOrderRequest) => {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to place order");
            }
            return response.json();
        },
        onSuccess: (order) => {
            clearCart();
            localStorage.removeItem("cartId");
            navigate(`/thankyou/${order.id}`);
        }
    })

    if (!cart) return <p>Cart not found</p>;

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!shipping) {
            alert("Please select a shipping method");
            return;
        }

        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        placeOrderMutation.mutate({ shippingMethod: shipping.code });
    }

    return (
        <div>
            <h2>Checkout</h2>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => navigate("/shoppingcarts")}>Back</button>
            </div>
            <hr />
            <form onSubmit={(handleSubmit)}>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr" }}>
                <div>
                    <BillingAddress />
                    <hr />
                    <ShippingMethods
                    value={shipping}
                    onChange={setShipping}
                    />
                    <hr />
                    <PaymentMethods
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    />
                </div>
                <div className="summary">
                    <h2>Total price</h2>
                    <hr />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
                        <div>Subtotal:</div>
                        <div className="summary-price">{cart.totalPrice.toFixed(2)}</div>
                        <div>Shipping:</div>
                        <div className="summary-price">{shipping ? shipping.price.toFixed(2) : "0.00"}</div>
                        <div>Total:</div>
                        <div className="summary-price">{(cart.totalPrice + (shipping?.price ?? 0)).toFixed(2)}</div>
                    </div>
                    <button
                        type="submit"
                        disabled={placeOrderMutation.isPending}>Buy now</button>
                </div>
                </div>
                </form>
        </div>
    )
}

export default CheckoutPage;
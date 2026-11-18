interface PaymentMethodProps {
    paymentMethod: string;
    setPaymentMethod: (paymentMethod: string) => void;
}

const PaymentMethods = ({ paymentMethod, setPaymentMethod}: PaymentMethodProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    }

    return (
        <>
            <h2>Payment</h2>
                <input
                    type="radio"
                    name="paymentMethod"
                    value="iDEAL"
                    checked={paymentMethod === "iDEAL"}
                    onChange={handleChange}
                    />
                <label>iDEAL</label>
                <br />
                <input
                    type="radio"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={paymentMethod === "Credit Card"}
                    onChange={handleChange}
                    />
                <label>Credit Card</label>
                <br />
                <input
                    type="radio"
                    name="paymentMethod"
                    value="Afterpay"
                    checked={paymentMethod === "Afterpay"}
                    onChange={handleChange}
                    />
                <label>Afterpay</label>
        </>
    )
}

export default PaymentMethods;
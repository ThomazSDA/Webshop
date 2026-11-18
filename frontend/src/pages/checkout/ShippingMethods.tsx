import { useQuery } from "@tanstack/react-query";
import type { ShippingMethodDTO } from "../../types/models";
import { API_URL } from "../../App";

interface ShippingMethodProps {
    value: ShippingMethodDTO | null;
    onChange: (method: ShippingMethodDTO) => void;
}

const ShippingMethods = ({ value, onChange}: ShippingMethodProps) => {

    const { data: shippingMethods } = useQuery<ShippingMethodDTO[]>({
        queryKey: ["shipping-methods"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/shoppingcarts/shipping-methods`);
            if (!response.ok) {
                throw new Error("Failed to fetch shipping methods");
            }
            return response.json();
        }
    });

    const handleChange = (method: ShippingMethodDTO) => {
        onChange(method);
    }

    return (
        <>
            <h2>Shipping</h2>
                {shippingMethods?.map(method => (
                    <label key={method.code}>
                        <input
                            type="radio"
                            name="shippingMethod"
                            value={method.code}
                            checked={value?.code === method.code}
                            onChange={() => handleChange(method)}
                        />
                        {/* <img src={`/images/other/${method.code}-Logo.png`} width={125} height={100}/> */}
                        {method.name} (€{method.price.toFixed(2)})
                        <br />
                    </label>
                ))}
        </>
    )
}

export default ShippingMethods;
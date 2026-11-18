import { useQuery } from "@tanstack/react-query";
import type { UserDTO } from "../../types/models";
import { API_URL } from "../../App";

const BillingAddress = () => {

    const { data, isLoading, error} = useQuery<UserDTO>({
        queryKey: ['user', 'me'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users/me`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error("User not found");
        }
        return response.json();
        },
    });

    if (isLoading) return <p>Loading user...</p>;

    if (error) return <p>Error!</p>;

    if (!data) return  <p>No data found!</p>;

    return (
        <>
            <h3>Billing address</h3>
            <p>{data.firstName} {data.lastName}
            <br />{data.streetName} {data.houseNumber}
            <br />{data.zipCode}
            <br />{data.city}</p>
        </>
    )
}

export default BillingAddress;
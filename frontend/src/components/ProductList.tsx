
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductAttributeDTO, ProductBaseDTO, ProductDTO } from "../types/models";
import { API_URL } from "../App";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { useState } from "react";
import "../styles/App.css";

interface StockUpdateDTO {
    variantId: number;
    newStock: number;
}

const ProductList = () => {
    const [editedStock, setEditedStock] = useState<Record<number, number>>({});

    const queryClient = useQueryClient();

    const updateStockToBackend = useMutation({
        mutationFn: async (formData: StockUpdateDTO) => {
            const response = await fetch(`${API_URL}/products/stock`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to update stock");
            }

            return response.json();
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            console.log("Stock updated successfully", data);
        },
    });

    const {
        data: products,
        isLoading,
        error,
    } = useQuery<ProductBaseDTO[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/products`);

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            return response.json();
        },
    });

    if (isLoading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>Error: {error.message}</div>;
    }

    const handleStockChange = (variantId: number, newStock: number) => {
        setEditedStock((previousStock) => ({
            ...previousStock,
            [variantId]: newStock,
        }));
    };

    const updateStock = (variantId: number, currentStock: number) => {
        const newStock = editedStock[variantId] ?? currentStock;

        updateStockToBackend.mutate({
            variantId,
            newStock,
        });
    };

    return (
        <>
            <div>
                <h2>Products</h2>
                {products && products.length > 0 ? (
                    <ul>
                        {products.map((product: ProductBaseDTO) => (
                            <li key={product.id}>
                                <Accordion>
                                    <AccordionItem header={product.name}>
                                        <strong>Brand:</strong> {product.productBrand}{" "}
                                        <button>Edit Base Product</button>
                                        <br />

                                        <strong>Variants:</strong>
                                        {product.productVariants.map((variant: ProductDTO) => (
                                            <li key={variant.id}>
                                                Stock: {variant.stock}
                                                {variant.attributes.map((attribute: ProductAttributeDTO) => (
                                                    <span key={attribute.id}>
                                                        {" | "}
                                                        {attribute.attribute}: {attribute.value}
                                                    </span>
                                                ))}

                                                {" "}
                                                <input
                                                    type="number"
                                                    value={editedStock[variant.id] ?? variant.stock}
                                                    placeholder="New stock"
                                                    onChange={(event) =>
                                                        handleStockChange(
                                                            variant.id,
                                                            Number(event.target.value)
                                                        )
                                                    }
                                                />

                                                <button
                                                    onClick={() =>
                                                        updateStock(variant.id, variant.stock)
                                                    }
                                                >
                                                    Update Stock
                                                </button>
                                            </li>
                                        ))}
                                    </AccordionItem>
                                </Accordion>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </>
    );
};

export default ProductList;
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { MutationError, ProductBaseDTO, SelectedAttributes } from "../types/models";
import { API_URL } from "../App";
import { useEffect, useState } from "react";
import '../styles/product.css'
import { createCart, setCart, useCartStore } from "../components/stores/cartStore";

const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const numericProductId = Number(productId);
    const { cart } = useCartStore();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data: product, isLoading, error } = useQuery<ProductBaseDTO>({
        queryKey: ['product', numericProductId],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/products/${productId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product")
            }
            return response.json();
        },
    });

    const addToCartMutation = useMutation({
        mutationFn: async ({
            cartId,
            productId,
            amount,
        }: {
            cartId: number;
            productId: number;
            amount: number;
        }) => {
            const response = await fetch(`${API_URL}/shoppingcarts/${cartId}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, amount }),
            });
            if (!response.ok) {
                const errorBody = await response.json();

                throw {
                    message: errorBody.message ?? "Failed to add item to cart.",
                    status: response.status,
                } as MutationError;
                // throw new Error("Failed to add product to cart");
            }
            return response.json();
        },
        onSuccess: (updatedCart) => {
            setCart(updatedCart);
            alert("item added to cart!");
        },
        onError: (error) => {
            setErrorMessage(error.message);
        }
    })

    const allAttributes = product?.productVariants.flatMap(variants => variants.attributes);

    const attributeMap = new Map<string, Set<string>>();

    allAttributes?.forEach(attr => {
        const name = attr.attribute;
        const value = attr.value;

        if (!attributeMap.has(name)) {
            attributeMap.set(name, new Set());
        }
        attributeMap.get(name)!.add(value);
    })

    // Logic for autoSelecting dropdowns
    useEffect(() => {
    if (!attributeMap.size) return;

    const autoSelected: SelectedAttributes = {};

    attributeMap.forEach((values, attributeName) => {
        if (values.size === 1) {
            autoSelected[attributeName] = Array.from(values)[0];
        }
    });

    setSelectedAttributes(prev => ({
        ...autoSelected,
        ...prev, // user choice always wins
        }));
    }, [product]);

    const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttributes>({});
    const [quantity, setQuantity] = useState(1);

    const selectedVariant = product?.productVariants.find(variant =>
        variant.attributes.every(attr => selectedAttributes[attr.attribute] === attr.value)
    );

    useEffect(() => {
        setQuantity(1);
        setErrorMessage(null);
    }, [selectedVariant]);

    const isOptionOutOfStock = (attributeName: string,  value: string) => {
        return !product?.productVariants.some(variant => {
            
            const matchesSelected = Object.entries(selectedAttributes).every(
                ([attr, val]) =>
                    attr === attributeName ||
                    variant.attributes.some(at => at.attribute === attr && at.value === val)
            );

            const matchesThisOption = variant.attributes.some(
                a => a.attribute === attributeName && a.value === value
            );

            return matchesSelected && matchesThisOption && variant.stock > 0;
        });
    };

    const variantInCart = cart?.cartItems.find(
        item => item.product.productId === selectedVariant?.id
    );

    const inCartAmount = variantInCart?.amount ?? 0;

    const remainingStock = selectedVariant ? selectedVariant.stock - inCartAmount : 0;
    const isOutOfStock = selectedVariant && remainingStock === 0;
    const isLowStock = selectedVariant && remainingStock !== null && remainingStock > 0 && remainingStock <= 2;

    const handleAddToCart = async () => {
        console.log("[ADD TO CART]", {
        cart,
        cartId: cart?.id,
        selectedVariant,
        quantity
    });

        if (!selectedVariant) {
            console.warn("Blocked AddToCart");
            return;
        }

        let activeCart = cart;
        if (!activeCart) {
            activeCart = await createCart();
        }

        addToCartMutation.mutate({
            cartId: activeCart!.id,
            productId: selectedVariant.id,
            amount: quantity,
        });
    }

    if (isLoading) return <p>Loading product...</p>

    if (error) return <p>Error!</p>

    return (
        <div className="product-page">
            <div className="image">
                <div className="card">
                    {selectedVariant && (selectedVariant.salePercentage && selectedVariant?.salePercentage < 1)  && <span className="sale">
                        SALE {Math.round((1 - selectedVariant.salePercentage) * 100)}% OFF</span>}
                    <img src={selectedVariant?.imageURL ?? product?.defaultImageURL} alt={product?.name}/>
                </div>
            </div>

            <div className="options">
                <h1>{product?.name}</h1>
                
                {Array.from(attributeMap.entries()).map(([attributeName, values]) => (
                <div key={attributeName} className="options-row">
                    <b><label>{attributeName} </label></b>

                    <select
                        value={selectedAttributes[attributeName] ?? ""}
                        onChange={(e) =>
                            setSelectedAttributes(data => ({
                                ...data,
                                [attributeName]: e.target.value,
                            }))
                        }
                    >
                        <option value="" disabled>
                            -- Select {attributeName} --
                        </option>
                        {Array.from(values).map(value => (
                            <option key={value} value={value} disabled={isOptionOutOfStock(attributeName, value)}>
                                {value} {isOptionOutOfStock(attributeName, value) ? "(Sold out)" : ""}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            </div>

            <div className="details">
                <div className="details-info">
                    <p><b>Description:</b> {product?.description}</p>
                    <p><b>Brand:</b> {product?.productBrand}</p>

                    <div>
                        <b>Price: </b>
                        <span style={{ display: "inline-block" }} className={`price ${selectedVariant && selectedVariant.salePercentage < 1 ? "old-price" : ""}`}>
                            {selectedVariant ? `€${(selectedVariant.price * quantity).toFixed(2)}` : "select options to see price"}
                        </span>
                        <span style={{ display: "inline-block", textIndent: 5 }}>
                            {selectedVariant && selectedVariant.salePercentage < 1 && <div className="sale-price">
                            €{(selectedVariant.price * selectedVariant.salePercentage * quantity).toFixed(2)}</div>}
                        </span>
                    </div>
                </div>

                <div className="details-attributes">
                    <h2>Product specifications:</h2>
                    {product?.attributes.map(attr => (
                        <div key={attr.id}>
                            <b>{attr.attribute}:</b> {attr.value}
                        </div>
                    ))}
                </div>

                <div className="details-actions">
                    <div className="quantity">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={!selectedVariant || remainingStock === 0}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min={1}
                            // max={selectedVariant?.stock ?? 1}
                            max={remainingStock}
                            value={quantity}
                            onChange={(e) =>
                                // setQuantity(Math.min(selectedVariant?.stock ?? 1,
                                    setQuantity(Math.min(remainingStock,
                                    Math.max(1, Number(e.target.value))
                                ))
                            }
                            disabled={!selectedVariant || remainingStock === 0}
                        />
                        <button
                            // onClick={() => setQuantity(q => Math.min(selectedVariant!.stock, q + 1))}
                            onClick={() => setQuantity(q => Math.min(remainingStock, q + 1))}
                            disabled={!selectedVariant || remainingStock === 0 || quantity >= remainingStock}
                        >
                            +
                        </button>
                        {isOutOfStock && <div style={{ display: "inline-block", color: "red" }} className="low-stock">Already in your cart</div>}
                        {isLowStock && <div style={{ display: "inline-block" }} className="low-stock">Only {remainingStock} left in stock!</div>}
                    </div>
                    {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
                    <button
                        disabled={!selectedVariant || remainingStock === 0}
                        className="add-to-cart"
                        style={{ width: 115 }}
                        onClick={handleAddToCart}
                        >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage;
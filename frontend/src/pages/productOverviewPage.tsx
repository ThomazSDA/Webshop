import { useQuery } from "@tanstack/react-query";
import type { ProductBaseDTO, ProductFilters } from "../types/models";
import { API_URL } from "../App";
import '../styles/card.css';
import { useNavigate, useOutletContext } from "react-router";
 
 
const ProductOverviewPage = () => {
    const navigate = useNavigate();
    const { filters } = useOutletContext<{ filters: ProductFilters }>();
    if (!filters) return null;
 
    const { data: products, isLoading, error } = useQuery<ProductBaseDTO[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) {
                throw new Error("Failed to fetch products")
            }
            return response.json();
        },
    });
 
    const filteredProducts = products?.filter(product => {
        if (filters.categories.length && !filters.categories.includes(product.category)) {
            return false;
        }

        if (filters.brands.length && !filters.brands.includes(product.productBrand)) {
            return false;
        }

        if (filters.onSale) {
            const hasSaleVariant = product.productVariants.some(
                v => v.salePercentage < 1);
            if (!hasSaleVariant) return false;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            const matchesPrice = product.productVariants.some(v => {
                const price = v.price * v.salePercentage;

                if (filters.minPrice !== undefined && price < filters.minPrice) return false;
                if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;

                return true;
            });
            if (!matchesPrice) return false;
        }

        return true;
    });
 
    if (isLoading) { return <p>Loading products...</p> }
 
    if (error) { return <p>Error!</p> }

    if (filteredProducts !== undefined) {
        return (
            <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => navigate(`/products/${product.id}`)} className={`card ${product.totalStock === 0 ? "card-disabled" : ""}`}>
                            <h3>{product.name} from {product.productBrand}</h3>
                            <p>{product.description}</p>
                            <div className="container">
                            <img src={product.defaultImageURL} alt={product.name} style={{ height: 250 }}/>
                            {product.totalStock ===0 && <span className="out-of-stock">Out of Stock</span>}
                            </div>
                            {product.productVariants.some(variant => variant.salePercentage < 1 ) && <span className="sale-overview">SALE</span>}
                        </div>
                    ))
                    }
                </div>
            </>
        );
    }
}
 
export default ProductOverviewPage;
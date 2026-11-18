import { useLocation } from "react-router";
import "../styles/sidebar.css"
import type { ProductFilters } from "../types/models";
import { useEffect } from "react";
import PriceRangeFilter from "./priceRangeFilter";
import { useQuery } from "@tanstack/react-query";
import type { ProductFilterSidebarDTO } from "../types/models";
import { API_URL } from "../App";

interface SideBarProps {
    filters: ProductFilters;
    setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
    onApply: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ filters, setFilters, onApply, isOpen, onClose }: SideBarProps) => {

    const location = useLocation();
    const isOverviewPage = location.pathname === "/products";
    // const PRICE_MIN = 0;
    // const PRICE_MAX = 1000;

    useEffect(() => {
        if (!isOpen) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const { data: filterData, isLoading, error } = useQuery<ProductFilterSidebarDTO>({
        queryKey: ['productFilters'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/products/filters`);
            if (!response.ok) {
                throw new Error("Failed to fetch products")
            }
            return response.json();
        },
    });

    // console.log("Filters: ",filterData);
    const { categories, brands, minPrice: minLimit, maxPrice: maxLimit } = filterData ?? {
        categories: [],
        brands: [],
        minPrice: 0,
        maxPrice: 1000,
    };

    const hasActiveFilters = filters.categories.length > 0 || filters.brands.length > 0 || filters.sizes.length > 0 || filters.onSale === true ||
    filters.minPrice !== minLimit || filters.maxPrice !== maxLimit;

    // const CATEGORIES = ["T-Shirts", "Pants", "Shoes", "Hoodies", "Caps", "Socks", "Other"];
    // const BRANDS = ["Generic", "Webshop", "In Da Hood", "Gramfel", "Mozza", "Iphoney", "Mike"]
    // const COLORS = ["Red", "Blue", "White", "Black", "Orange", "Gray", "Khaki"];
    // const SIZES = ["XS", "S", "M", "L", "XL"];
    const EMPTY_FILTERS: ProductFilters = {
        categories: [],
        brands: [],
        sizes: [],
        onSale: false,
        // minPrice: PRICE_MIN,
        // maxPrice: PRICE_MAX,
        minPrice: minLimit,
        maxPrice: maxLimit,
    }

    const handleCheckboxChange = (
        group: "categories" | "brands" | "sizes",
        value: string,
        checked: boolean
    ) => {
        setFilters(data => ({
            ...data,
            [group]: checked
            ? [...data[group], value]
            : data[group].filter(val => val !== value),
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onApply();
        onClose();
    };

    const handleClearFilters = () => {
        setFilters(EMPTY_FILTERS);
    }

    if (isLoading) return <p>Loading filters...</p>;

    if (error) return <p>Failed to load filters</p>;

    if (!filterData) return null;
    
    return (
        <form onSubmit={handleSubmit}>
            {isOpen && (
            <div className="sidebar-overlay" onClick={onClose}>
                <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                    <button className="close" onClick={onClose}>X</button>

                    Categories
                    {/* {CATEGORIES.map(category => ( */}
                    {categories.map(category => (
                        <div key={category}>
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(category)}
                                onChange={(e) => 
                                    handleCheckboxChange("categories", category, e.target.checked)
                                }
                            />
                            <label>{category}</label>
                        </div>
                    ))}
                    <br/>
                    Brands
                    {/* {BRANDS.map(brand => ( */}
                    {brands.map(brand => (
                        <div key={brand}>
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={(e) =>
                                    handleCheckboxChange("brands", brand, e.target.checked)
                                }
                            />
                            <label>{brand}</label>
                        </div>
                    ))}
                    <br/>
                {/* Sizes
                {SIZES.map(size => (
                    <div key={size}>
                        <input
                            type="checkbox"
                            checked={filters.sizes.includes(size)}
                            onChange={(e) =>
                                handleCheckboxChange("sizes", size, e.target.checked)
                            }
                        />
                        <label>{size}</label>
                    </div>
                ))}
                <br/> */}
                    Price (€)
                    <PriceRangeFilter
                        min={filters.minPrice}
                        max={filters.maxPrice}
                        minLimit={minLimit}
                        maxLimit={maxLimit}
                        onChange={(min, max) =>
                            setFilters(data => ({
                                ...data,
                                minPrice: min,
                                maxPrice: max,
                            }))
                        }
                    />
                    <input
                        type="checkbox"
                        checked={filters.onSale ?? false}
                        onChange={(e) => 
                            setFilters(data => ({
                                ...data,
                                onSale: e.target.checked,
                            }))
                        }
                    />
                    <label>On Sale</label>
                    <br/>
                    {!isOverviewPage && hasActiveFilters && <button type="submit">Apply Filters</button>}
                    {hasActiveFilters && <button type="button" onClick={handleClearFilters}>Clear Filters</button>}
                </div>
            </div>)}
        </form>
    )
}

export default Sidebar;
export interface CartItemCreateDTO {
    productId: number;
    amount: number;
}

export interface CartItemDTO {
    id: number;
    product: CartProductDTO;
    amount: number;
}

export interface CartProductDTO {
    productBaseId: number;
    productId: number;
    name: string;
    imageURL: string;
    description: string;
    price: number;
    salePercentage: number;
    stock: number;
    attributes: {
        attribute: string;
        value: string;
    }[];
}

export interface CartItemSummaryDTO {
}

export interface CartItemUpdateDTO {
    amount: number;
}

export interface ShoppingCartCreateDTO {
    userId: number;
}

export interface ShoppingCartDTO {
    id: number;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        roles: string[];
    } | null;
    cartItems: CartItemDTO[];
    totalPrice: number;
}

export interface ShoppingCartSummaryDTO {
}

export interface ShoppingCartUpdateDTO {
    id: number;
    cartItems: CartItem[];
}

export interface ProductBaseDTO {
    id: number,
    productCode: string,
    defaultImageURL: string,
    category: string,
    name: string,
    description: string,
    productBrand: string,
    totalStock: number,
    productVariants: ProductDTO[],
    attributes: ProductAttributeDTO[],
}

export interface ProductDTO {
    id: number,
    imageURL: string,
    price: number,
    salePercentage: number,
    stock: number,
    attributes: ProductAttributeDTO[],
}

export interface ProductAttributeDTO {
    id: number,
    attribute: string,
    value: string,
    type: "PRODUCT" | "VARIANT",
}

export interface LoginDTO {
    email: string,
    password: string,
}

export interface RegisterDTO {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    zipCode: string,
    houseNumber: string,
    streetName: string,
    city: string,
}

export interface UserSummaryDTO {
    id: number,
    firstName: string,
    lastName: string,
    roles: string[],
}

export interface UserDTO {
    id: number,
    firstName: string,
    lastName: string,
    roles: string[],
    email: string,
    zipCode: string,
    houseNumber: string,
    streetName: string,
    city: string,
    shoppingCarts: ShoppingCartDTO[],
}

export interface UserCreateDTO {
    firstName: string;
    lastName: string;
    roles: string[];
    email: string;
    password: string;
    zipCode: string;
    houseNumber: string;
    streetName: string;
    city: string;
}

export interface UserUpdateDTO {
    firstName: string;
    lastName: string;
    email: string;
    zipCode: string;
    houseNumber: string;
    streetName: string;
    city: string;
}

export interface Product {
    id: number;
    price: number;
    salePercentage: number;
    stock: number;
    productBase: ProductBase;
    productAttributes: ProductAttribute[];
    product: ProductBase;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    roles: string[];
    email: string;
    zipCode: string;
    houseNumber: string;
    streetName: string;
    city: string;
}

export interface CartItem {
    id: number;
    product: Product;
    amount: number;
    shoppingCart: ShoppingCart;
}

export interface ProductBase {
    id: number;
    productCode: string;
    name: string;
    description: string;
    productBrand: string;
    productVariants: Product[];
    productAttributes: ProductAttribute[];
}

export interface ProductAttribute {
    id: number;
    attribute: string;
    value: string;
    type: AttributeType;
    productBase: ProductBase;
    product: Product;
}

export interface ProductFilterSidebarDTO {
    categories: string[];
    brands: string[];
    minPrice: number;
    maxPrice: number;
}

export interface ShoppingCart {
    id: number;
    user: User;
    cartItemList: CartItem[];
}

export type AttributeType = "PRODUCT" | "VARIANT";

export type MutationError = {
    message: string,
    status?: number,
}

 export type SelectedAttributes = {
    [attributeName: string]: string
    }

export type ProductFilters = {
    categories: string[],
    brands: string[],
    // colors: string[],
    sizes: string[],
    onSale: boolean;
    minPrice?: number;
    maxPrice?: number;
}

export interface CartItemAmountUpdateDTO {
    quantity: number,
}

export interface ShippingMethodDTO {
    code: string;
    name: string;
    price: number;
}

export type ShippingMethod = "POSTNL" | "DHL" | "UPS";

export interface PlaceOrderRequest {
    shippingMethod: string;
}

export interface OrderDTO {
    id: number;
    subTotalPrice: number;
    shippingCost: number;
    shippingMethod: string;
    totalPrice: number;
    createdAt: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    id: number;
    productName: string;
    ImageURL: string;
    priceAtPurchase: number;
    amount: number;
}
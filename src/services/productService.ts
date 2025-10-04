const API_BASE_URL = 'http://localhost/homefood-api';

export interface Product {
    id: number;
    seller_id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    available: boolean;
}

export const productService = {
    async getProducts(category?: string): Promise<{success: boolean; products: Product[]}> {
        try {
            const url = category ? 
                `${API_BASE_URL}/products.php?category=${category}` : 
                `${API_BASE_URL}/products.php`;
            
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return { success: false, products: [] };
        }
    }
};
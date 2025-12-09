import type { Stock, CreateStockData } from '../../types/product';
import { apiClient } from '../apiClient';

export const stockService = {
    async getStocksByProductId(productId: string): Promise<Stock[]> {
        console.log('Fetching stocks for product ID:', productId);
        try {
            // Get stocks filtered by productId from real API
            const stocks = await apiClient.get<Stock[]>('/stocks', { productId });
            console.log(`Found ${stocks.length} stocks for product ${productId}`);
            return stocks;
        } catch (error) {
            console.error('Failed to fetch stocks for product:', error);
            // Fallback: get all stocks and filter on frontend
            try {
                const allStocks = await this.getAllStocks();
                const filtered = allStocks.filter(stock => stock.productId === productId);
                console.log(`Fallback: Found ${filtered.length} stocks for product ${productId}`);
                return filtered;
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                return [];
            }
        }
    },

    async getAllStocks(): Promise<Stock[]> {
        console.log('Fetching all stocks from database');
        try {
            return await apiClient.get<Stock[]>('/stocks');
        } catch (error) {
            console.error('Failed to fetch all stocks:', error);
            return [];
        }
    },

    async getStockById(stockId: string): Promise<Stock | null> {
        console.log('Fetching stock by ID:', stockId);
        try {
            return await apiClient.get<Stock>(`/stocks/${stockId}`);
        } catch (error) {
            console.error('Failed to fetch stock by ID:', error);
            return null;
        }
    },

    async createStock(data: CreateStockData): Promise<Stock> {
        try {
            console.log('Sending stock data to API:', data)
            return await apiClient.post<Stock>('/stocks', data);
        } catch (error) {
            console.error('Failed to create stock:', error);
            throw error;
        }
    },

    async updateStock(id: string, data: Partial<CreateStockData>): Promise<Stock> {
        try {
            console.log('Updating stock with data:', data)
            return await apiClient.put<Stock>(`/stocks/${id}`, data);
        } catch (error) {
            console.error('Failed to update stock:', error);
            throw error;
        }
    },

    async deleteStock(id: string): Promise<void> {
        try {
            await apiClient.delete(`/stocks/${id}`);
        } catch (error) {
            console.error('Failed to delete stock:', error);
            throw error;
        }
    }
};

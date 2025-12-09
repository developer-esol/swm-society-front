import type { Stock, CreateStockData } from '../../types/product';
import { apiClient } from '../apiClient';

export const stockService = {
    async getStocksByProductId(productId: string): Promise<Stock[]> {
        // Simulate backend response with comprehensive stock data
        const allStocks: Stock[] = [
            // Product 1 - Puffer Jacket
            
        
        ];
        
        // Filter stocks by productId (simulating backend filtering)
        const filteredStocks = allStocks.filter(stock => stock.productId === productId);
        return Promise.resolve(filteredStocks);
    },

    async getAllStocks(): Promise<Stock[]> {
        try {
            return await apiClient.get<Stock[]>('/stocks?page=1&limit=100');
        } catch (error) {
            console.error('Failed to fetch all stocks:', error);
            return [
                {
                    id: 'stock-1-1',
                    productId: '2d393119-edf9-4618-9e4b-3edccc7cd974',
                    size: 'S',
                    color: 'Red',
                    quantity: 15,
                    price: 89.99,
                    imageUrl: '/d1.jpg',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                },
                {
                    id: 'stock-1-2',
                    productId: '2d393119-edf9-4618-9e4b-3edccc7cd974',
                    size: 'M',
                    color: 'Blue',
                    quantity: 20,
                    price: 89.99,
                    imageUrl: '/d1.jpg',
                    isActive: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                }
            ];
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

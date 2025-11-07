import type { Stock } from '../../types/product';

export const stockService = {
    async getStocksByProductId(productId: string): Promise<Stock[]> {
        // Simulate backend response with comprehensive stock data
        const allStocks: Stock[] = [
            // Product 1 - Puffer Jacket
            {
                id: 'stock-1-1',
                productId: '1',
                size: 'S',
                color: 'Red',
                quantity: 15,
                price: 89.99,
                url: '/d1.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-1-2',
                productId: '1',
                size: 'M',
                color: 'Red',
                quantity: 20,
                price: 89.99,
                url: '/d1.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-1-3',
                productId: '1',
                size: 'L',
                color: 'Red',
                quantity: 12,
                price: 89.99,
                url: '/d1.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-1-4',
                productId: '1',
                size: 'S',
                color: 'Black',
                quantity: 18,
                price: 89.99,
                url: '/d1.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-1-5',
                productId: '1',
                size: 'M',
                color: 'Black',
                quantity: 16,
                price: 89.99,
                url: '/d1.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-1-6',
                productId: '1',
                size: 'L',
                color: 'Black',
                quantity: 14,
                price: 89.99,
                url: '/d1.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            
            // Product 2 - Project Zero's Jacket
            {
                id: 'stock-2-1',
                productId: '2',
                size: 'S',
                color: 'White',
                quantity: 18,
                price: 120.00,
                url: '/d2.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-2-2',
                productId: '2',
                size: 'M',
                color: 'White',
                quantity: 25,
                price: 120.00,
                url: '/d2.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            },
            {
                id: 'stock-2-3',
                productId: '2',
                size: 'L',
                color: 'Black',
                quantity: 12,
                price: 120.00,
                url: '/d2.jpg',
                isActive: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z'
            }
        ];
        
        // Filter stocks by productId (simulating backend filtering)
        const filteredStocks = allStocks.filter(stock => stock.productId === productId);
        return Promise.resolve(filteredStocks);
    }
};

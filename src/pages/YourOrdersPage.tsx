import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { colors } from '../theme';
import { orderService } from '../api/services/orderService';
import type { Order } from '../types/order';

const YourOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getUserOrders();
        setOrders(response.orders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#10b981';
      case 'Shipped':
        return '#f59e0b';
      case 'Processing':
        return '#3b82f6';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getColorDot = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      Orange: '#ea580c',
      Blue: '#3b82f6',
      Red: '#dc2626',
      Black: '#000000',
      White: '#ffffff',
      Green: '#10b981',
      Purple: '#a855f7',
    };
    return colorMap[colorName] || '#6b7280';
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.background.default,
          mt: { xs: 10, md: 12 },
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.background.default, width: '100%', minHeight: '100vh' }}>
      <Box sx={{ pt: { xs: 4, md: 6 } }} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: colors.text.primary,
            mb: 4,
          }}
        >
          Your Orders
        </Typography>

        {/* Orders List */}
        {orders.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {order.items.map((item, index) => (
                    <Box key={item.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          p: 3,
                        }}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{
                            width: 100,
                            height: 120,
                            bgcolor: '#f3f4f6',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.productName}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: colors.text.primary,
                              mb: 1,
                            }}
                          >
                            {item.productName}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.text.primary,
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            £{item.price}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              mb: 1,
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6b7280',
                              }}
                            >
                              {order.orderDate}
                            </Typography>

                            {/* Color Dot */}
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: getColorDot(item.color),
                                border: '2px solid #e5e7eb',
                              }}
                            />

                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6b7280',
                              }}
                            >
                              {item.color}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6b7280',
                              }}
                            >
                              Size: {item.size}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Order Status */}
                        <Box
                          sx={{
                            textAlign: 'right',
                            minWidth: '150px',
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#6b7280',
                              display: 'block',
                              mb: 0.5,
                            }}
                          >
                            Order Status
                          </Typography>
                          <Chip
                            label={item.status}
                            sx={{
                              bgcolor: getStatusColor(item.status),
                              color: 'white',
                              fontWeight: 600,
                              height: 28,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Divider between items */}
                      {index < order.items.length - 1 && (
                        <Divider sx={{ my: 0 }} />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#6b7280',
                mb: 2,
              }}
            >
              You haven't placed any orders yet.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#9ca3af',
              }}
            >
              Start shopping to see your orders here.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default YourOrdersPage;

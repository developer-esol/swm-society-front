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
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#10b981';
      case 'shipped':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getColorDot = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      Orange: colors.order.orange,
      Blue: colors.order.blue,
      Red: colors.order.red,
      Black: colors.order.black,
      White: colors.order.white,
      Green: colors.order.green,
      Purple: colors.order.purple,
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
      {/* Add top padding to account for fixed navbar */}
      <Box sx={{ pt: { xs: 4, md: 6 } }} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: colors.text.primary,
            mb: 4,
          }}
        >
          My Orders
        </Typography>

        {/* Orders List */}
        {orders.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: 'none',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Order Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      bgcolor: colors.background.light,
                      borderBottom: `1px solid ${colors.border.default}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.primary,
                        fontSize: '1rem',
                      }}
                    >
                      Order ID: {order.id.substring(0, 8)}...
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.text.primary,
                        fontSize: '0.8rem',
                      }}
                    >
                      Date: {order.orderDate}
                    </Typography>
                  </Box>

                  {/* Products List */}
                  {order.items.map((item, index) => (
                    <Box key={`${order.id}-${index}`}>
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
                            bgcolor: colors.background.lighter,
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
                            src={item.imageUrl}
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
                            £{Number(item.price).toFixed(2)} x {item.quantity}
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
                            {/* Color Dot */}
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: getColorDot(item.color),
                                border: `2px solid ${colors.border.default}`,
                              }}
                            />

                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.text.disabled,
                                opacity: 0.7,
                              }}
                            >
                              {item.color}
                            </Typography>

                            <Typography
                              variant="caption"
                              sx={{
                                color: colors.text.disabled,
                                fontSize: '0.875rem',
                              }}
                            >
                              Size: {item.size}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Divider between items */}
                      {index < order.items.length - 1 && (
                        <Divider sx={{ my: 0 }} />
                      )}
                    </Box>
                  ))}

                  {/* Order Total */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: colors.background.light,
                      borderTop: `1px solid ${colors.border.default}`,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ color: colors.text.primary, fontSize: '0.9rem', fontWeight: 600 }}>
                          Subtotal:
                        </Typography>
                        <Typography sx={{ color: colors.text.primary, fontSize: '0.9rem', fontWeight: 600 }}>
                          £{order.subtotal ? Number(order.subtotal).toFixed(2) : '0.00'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography sx={{ color: colors.text.primary, fontSize: '1rem', fontWeight: 700 }}>
                          Total:
                        </Typography>
                        <Typography sx={{ color: colors.text.primary, fontSize: '1rem', fontWeight: 700 }}>
                          £{Number(order.totalPrice).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={(order as any).status || 'Processing'}
                      sx={{
                        bgcolor: getStatusColor((order as any).status || 'Processing'),
                        color: 'white',
                        fontWeight: 600,
                        height: 32,
                        textTransform: 'capitalize',
                        fontSize: '0.875rem',
                        px: 2,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="body1"
              sx={{
                color: colors.text.disabled,
                mb: 2,
              }}
            >
              You haven't placed any orders yet.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colors.button.primaryDisabled,
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

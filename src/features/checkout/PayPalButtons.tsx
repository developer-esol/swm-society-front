import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Box, CircularProgress, Alert } from '@mui/material';
import { paymentService } from '../../api/services/paymentService';

interface PayPalButtonsComponentProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess: (paymentDetails: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export const PayPalButtonsComponent: React.FC<PayPalButtonsComponentProps> = ({
  orderId,
  amount,
  currency = 'GBP',
  onSuccess,
  onError,
  onCancel,
}) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  console.log('[PayPal Component] SDK State:', { isPending, isResolved, isRejected });
  console.log('[PayPal Component] Props:', { orderId, amount, currency });

  if (isPending) {
    console.log('[PayPal Component] SDK is loading...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isResolved || isRejected) {
    console.error('[PayPal Component] SDK failed to load. isResolved:', isResolved, 'isRejected:', isRejected);
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load PayPal SDK. Please check your internet connection and Client ID, then refresh the page.
      </Alert>
    );
  }

  console.log('[PayPal Component] SDK loaded successfully, rendering buttons');

  // Extra defensive logging and validation to help diagnose sandbox failures
  const handleOnClick = (data: any, actions: any) => {
    console.log('[PayPal] onClick', { data, amount, currency });
    if (!amount || Number(amount) <= 0) {
      const err = new Error('Invalid payment amount for PayPal: ' + amount);
      console.error('[PayPal] Aborting onClick -', err.message);
      // notify parent and block PayPal popup
      try {
        onError(err);
      } catch (e) {
        // ignore
      }
      // actions.reject may exist in some SDK versions
      if (actions && typeof actions.reject === 'function') {
        return actions.reject();
      }
      return Promise.reject(err);
    }

    return Promise.resolve();
  };

  return (
    <Box sx={{ mt: 3 }}>
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        onClick={handleOnClick}
        createOrder={async (data, actions) => {
          console.log('[PayPal] Creating PayPal order (backend preferred):', { amount, currency });

          // Validate amount
          const value = Number(amount);
          if (!isFinite(value) || value <= 0) {
            const err = new Error('Invalid amount for PayPal createOrder: ' + amount);
            console.error('[PayPal] createOrder aborted -', err.message);
            onError(err);
            return Promise.reject(err as any);
          }

          // Try server-side create first (recommended): server returns PayPal order id string
          try {
            // Only include a local orderId if it's a valid UUID. The backend expects a UUID
            // for an existing order; if we don't have one yet, omit it so backend creates
            // a PayPal order without linking to a local order record.
            const payload: any = {
              amount: value,
              currency,
            };
            const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (orderId && uuidRegex.test(orderId)) {
              payload.orderId = orderId;
            }

            console.log('[PayPal] createPayPalOrder payload:', payload);
            const resp = await paymentService.createPayPalOrder(payload);

            console.log('[PayPal] Backend createPayPalOrder response:', resp);

            if (resp && resp.paypalOrderId) {
              // Return the PayPal order id string to the SDK
              return resp.paypalOrderId;
            }

            console.warn('[PayPal] Backend did not return paypalOrderId, falling back to client-side create');
          } catch (err) {
            console.warn('[PayPal] Backend createPayPalOrder failed, falling back to client-side create:', err);
          }

          // Fallback to client-side order creation
          try {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: currency,
                  value: value.toFixed(2),
                },
                description: 'SWM Society Order',
              }],
            });
          } catch (err) {
            console.error('[PayPal] client-side createOrder failed:', err);
            onError(err);
            throw err;
          }
        }}
        onApprove={async (data, actions) => {
          try {
            console.log('[PayPal] Payment approved (onApprove) data:', data);

            // Prefer server-side capture to ensure backend records payment
            try {
              const captureResp = await paymentService.capturePayPalOrder({
                paypalOrderId: data.orderID,
                orderId: orderId || `temp-${Date.now()}`,
              });

              console.log('[PayPal] Backend capturePayPalOrder response:', captureResp);

              if (captureResp && captureResp.success && captureResp.payment) {
                onSuccess({
                  paypalOrderId: data.orderID,
                  paypalTransactionId: captureResp.payment.paypalTransactionId,
                  amount: captureResp.payment.amount,
                  status: captureResp.payment.status,
                  payer: {},
                });
                return;
              }
            } catch (err) {
              console.warn('[PayPal] Backend capture failed, falling back to client-side capture:', err);
            }

            // Fallback: capture via client SDK
            const details = await actions.order.capture();
            console.log('[PayPal] Payment captured by PayPal (client):', details);

            onSuccess({
              paypalOrderId: data.orderID,
              paypalTransactionId: details.purchase_units?.[0]?.payments?.captures?.[0]?.id,
              amount: parseFloat(details.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || String(amount)),
              status: details.status,
              payer: details.payer,
            });
          } catch (error) {
            console.error('[PayPal] Failed to capture payment:', error);
            onError(error);
          }
        }}
        onCancel={() => {
          console.log('[PayPal] Payment cancelled by user');
          if (onCancel) {
            onCancel();
          }
        }}
        onError={(err) => {
          console.error('[PayPal] Payment error:', err);
          onError(err);
        }}
      />
    </Box>
  );
};

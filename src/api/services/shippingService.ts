import type { ShippingFeature, ShippingOption, FAQ } from '../../types/common';

// Dummy data
export const shippingFeatures: ShippingFeature[] = [
  {
    id: 'free-shipping',
    icon: 'LocalShipping',
    title: 'Free Shipping',
    description: 'On all orders over £100',
  },
  {
    id: 'quick-delivery',
    icon: 'AccessTime',
    title: 'Quick Delivery',
    description: '3-5 business days standard',
  },
  {
    id: 'worldwide',
    icon: 'Public',
    title: 'Worldwide',
    description: 'Shipping to most countries',
  },
  {
    id: 'order-tracking',
    icon: 'CardGiftcard',
    title: 'Order Tracking',
    description: 'Track your order anytime',
  },
];

export const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    method: 'Standard Shipping',
    deliveryTime: '3-5 business days',
    cost: '£4.95',
    freeShippingMinimum: 'Orders over £100',
  },
  {
    id: 'express',
    method: 'Express Shipping',
    deliveryTime: '1-2 business days',
    cost: '£9.95',
    freeShippingMinimum: 'Orders over £200',
  },
  {
    id: 'next-day',
    method: 'Next Day Delivery',
    deliveryTime: 'Next business day (order by 2pm)',
    cost: '£14.95',
    freeShippingMinimum: 'Not available',
  },
  {
    id: 'international',
    method: 'International Shipping',
    deliveryTime: '7-14 business days',
    cost: '£19.95',
    freeShippingMinimum: 'Orders over £300',
  },
];

export const shippingFAQs: FAQ[] = [
  {
    id: 'when-ship',
    question: 'When will my order ship?',
    answer:
      'Orders are typically processed within 24 hours of being placed. Once processed, shipping times depend on the shipping method selected at checkout.',
  },
  {
    id: 'track-order',
    question: 'How can I track my order?',
    answer:
      'Once your order ships, you\'ll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history.',
  },
  {
    id: 'international',
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please note that customers are responsible for any customs fees or import taxes that may apply.',
  },
  {
    id: 'lost-damaged',
    question: 'What if my package is lost or damaged?',
    answer:
      'If your package is lost or arrives damaged, please contact our customer service team within 48 hours of the delivery date. We\'ll work with you to resolve the issue promptly.',
  },
];

// Service functions
export const getShippingFeatures = (): ShippingFeature[] => {
  return shippingFeatures;
};

export const getShippingOptions = (): ShippingOption[] => {
  return shippingOptions;
};

export const getShippingFAQs = (): FAQ[] => {
  return shippingFAQs;
};

export const getShippingPolicyDescription = (): string => {
  return 'At SWM SOCIETY, we\'re committed to getting your order to you as quickly and safely as possible. We offer several shipping options to meet your needs, and we ship to most countries worldwide.';
};

export const getContactDescription = (): string => {
  return 'If you have any questions about shipping or need assistance with your order, our customer service team is here to help.';
};

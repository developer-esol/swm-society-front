import type { ReturnFeature, ReturnCondition, ReturnStep } from '../../types/common';

// Dummy data
export const returnFeatures: ReturnFeature[] = [
  {
    id: 'returns-30-days',
    icon: 'AssignmentReturn',
    title: '30-Day Returns',
    description: 'Return unworn items within 30 days of delivery',
  },
  {
    id: 'free-returns',
    icon: 'LocalShipping',
    title: 'Free Returns',
    description: 'Free return shipping on all UK orders',
  },
  {
    id: 'easy-process',
    icon: 'CheckCircle',
    title: 'Easy Process',
    description: 'Simple online return request process',
  },
];

export const eligibleConditions: ReturnCondition[] = [
  {
    id: 'unworn-tags',
    text: 'Unworn items with original tags attached',
  },
  {
    id: 'original-packaging',
    text: 'Items in original packaging',
  },
  {
    id: 'within-30-days',
    text: 'Items returned within 30 days of delivery',
  },
  {
    id: 'proof-purchase',
    text: 'Items with proof of purchase',
  },
];

export const notEligibleConditions: ReturnCondition[] = [
  {
    id: 'worn-damaged',
    text: 'Worn, washed, or damaged items',
  },
  {
    id: 'no-tags',
    text: 'Items without original tags',
  },
  {
    id: 'after-30-days',
    text: 'Items returned after 30 days',
  },
  {
    id: 'final-sale',
    text: 'Items marked as final sale',
  },
];

export const returnSteps: ReturnStep[] = [
  {
    id: 'start-return',
    title: 'Start Your Return',
    description: [
      'Log into your account and navigate to your order history. Select the order containing the item you wish to return and click "Return Items".',
      'Alternatively, contact our customer service team to initiate a return.',
    ],
  },
  {
    id: 'package-return',
    title: 'Package Your Return',
    description: [
      'Place the unworn item(s) in the original packaging with all tags attached. Include the return form that was included with your order.',
      'If you don\'t have the original packaging, use a secure box or envelope to prevent damaging during transit.',
    ],
  },
  {
    id: 'ship-return',
    title: 'Ship Your Return',
    description: [
      'Use the prepaid return shipping label provided (for UK orders) and drop off your package at any authorized shipping location.',
      'For international returns, you\'ll need to arrange and pay for return shipping to our warehouse.',
    ],
  },
  {
    id: 'refund-processing',
    title: 'Refund Processing',
    description: [
      'Once we receive your return, we\'ll inspect the item(s) and process your refund within 5-7 business days.',
      'Refunds are issued to the original payment method used for the purchase.',
    ],
  },
];

// Service functions
export const getReturnFeatures = (): ReturnFeature[] => {
  return returnFeatures;
};

export const getEligibleConditions = (): ReturnCondition[] => {
  return eligibleConditions;
};

export const getNotEligibleConditions = (): ReturnCondition[] => {
  return notEligibleConditions;
};

export const getReturnSteps = (): ReturnStep[] => {
  return returnSteps;
};

export const getReturnPolicyDescription = (): string => {
  return 'We want you to love your SWM SOCIETY purchase. If you\'re not completely satisfied, we offer a hassle-free return policy for most items.';
};

export const getExchangesDescription = (): string => {
  return 'We currently don\'t offer direct exchanges. If you need a different size or color, please return your item for a refund and place a new order for the desired item. This ensures you get the item you want as quickly as possible, as inventory can change rapidly.';
};

export const getHelpDescription = (): string => {
  return 'If you have any questions about our return policy or need assistance with a return, our customer service team is ready to help.';
};

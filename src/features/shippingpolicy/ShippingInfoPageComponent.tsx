import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { colors } from '../../theme';
import { OurShippingPolicy } from './OurShippingPolicy';
import { ShippingOptions } from './ShippingOptions';
import { FrequentlyAskedQuestions } from './FrequentlyAskedQuestions';
import { NeedMoreInformation } from './NeedMoreInformation';
import {
  getShippingFeatures,
  getShippingOptions,
  getShippingFAQs,
  getShippingPolicyDescription,
  getContactDescription,
} from '../../api/services/shippingService';

export const ShippingInfoPageComponent: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch data from service
  const shippingFeatures = getShippingFeatures();
  const shippingOptions = getShippingOptions();
  const faqs = getShippingFAQs();
  const policyDescription = getShippingPolicyDescription();
  const contactDescription = getContactDescription();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 6, color: colors.text.primary }}>
        Shipping Information
      </Typography>

      <OurShippingPolicy policyDescription={policyDescription} shippingFeatures={shippingFeatures} />
      <ShippingOptions shippingOptions={shippingOptions} />
      <FrequentlyAskedQuestions faqs={faqs} />
      <NeedMoreInformation contactDescription={contactDescription} />
    </Container>
  );
};

import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { colors } from '../../theme';
import { OurReturnPolicy } from './OurReturnPolicy';
import { ReturnConditions } from './ReturnConditions';
import { HowToReturn } from './HowToReturn';
import { Exchanges } from './Exchanges';
import { NeedHelpWithReturn } from './NeedHelpWithReturn';
import {
  getReturnFeatures,
  getEligibleConditions,
  getNotEligibleConditions,
  getReturnSteps,
  getReturnPolicyDescription,
  getExchangesDescription,
  getHelpDescription,
} from '../../api/services/returnPolicyService';

export const ReturnPolicyPageComponent: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch data from service
  const returnFeatures = getReturnFeatures();
  const eligibleConditions = getEligibleConditions();
  const notEligibleConditions = getNotEligibleConditions();
  const returnSteps = getReturnSteps();
  const policyDescription = getReturnPolicyDescription();
  const exchangesDescription = getExchangesDescription();
  const helpDescription = getHelpDescription();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 6, color: colors.text.primary }}>
        Returns & Exchanges
      </Typography>

      <OurReturnPolicy policyDescription={policyDescription} returnFeatures={returnFeatures} />
      <HowToReturn returnSteps={returnSteps} />
      <ReturnConditions
        eligibleConditions={eligibleConditions}
        notEligibleConditions={notEligibleConditions}
      />
      <Exchanges exchangesDescription={exchangesDescription} />
      <NeedHelpWithReturn helpDescription={helpDescription} />
    </Container>
  );
};

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import {
  getShippingFeatures,
  getShippingOptions,
  getShippingFAQs,
  getShippingPolicyDescription,
  getContactDescription,
} from '../api/services/shippingService';

const iconMap = {
  LocalShipping: LocalShippingIcon,
  AccessTime: AccessTimeIcon,
  Public: PublicIcon,
  CardGiftcard: CardGiftcardIcon,
};

const ShippingInfoPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Fetch data from service
  const shippingFeatures = getShippingFeatures();
  const shippingOptions = getShippingOptions();
  const faqs = getShippingFAQs();
  const policyDescription = getShippingPolicyDescription();
  const contactDescription = getContactDescription();

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 6 }}>
        Shipping Information
      </Typography>

      {/* Shipping Policy Section */}
      <Box sx={{ mb: 8 }}>
        <Card sx={{ mb: 4, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Our Shipping Policy
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#666', lineHeight: 1.7, mb: 4 }}
            >
              {policyDescription}
            </Typography>

            {/* Shipping Features Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 3,
              }}
            >
              {shippingFeatures.map((feature) => {
                const IconComponent = iconMap[feature.icon];
                return (
                  <Box key={feature.id} sx={{ textAlign: 'center' }}>
                    <IconComponent
                      sx={{
                        fontSize: 48,
                        color: '#d32f2f',
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Shipping Options Table */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Shipping Options
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f3f4f6' }}>
                <TableCell sx={{ fontWeight: 600, color: '#111' }}>
                  Shipping Method
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#111' }}>
                  Delivery Time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#111' }}>
                  Cost
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#111' }}>
                  Free Shipping Minimum
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shippingOptions.map((option) => (
                <TableRow key={option.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ color: '#333' }}>{option.method}</TableCell>
                  <TableCell sx={{ color: '#333' }}>
                    {option.deliveryTime}
                  </TableCell>
                  <TableCell sx={{ color: '#333' }}>{option.cost}</TableCell>
                  <TableCell sx={{ color: '#333' }}>
                    {option.freeShippingMinimum}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {faqs.map((faq) => (
            <Card
              key={faq.id}
              sx={{
                boxShadow: 'none',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
              }}
              onClick={() => toggleFAQ(faq.id)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: expandedFAQ === faq.id ? 2 : 0,
                    color: '#111',
                  }}
                >
                  {faq.question}
                </Typography>
                {expandedFAQ === faq.id && (
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Contact Section */}
      <Card sx={{ boxShadow: 'none', border: '1px solid #e5e7eb' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Need More Information?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#666', mb: 4, lineHeight: 1.7 }}
          >
            {contactDescription}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: '#d32f2f',
                color: '#fff',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': { bgcolor: '#b71c1c' },
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: '#d32f2f',
                borderColor: '#d32f2f',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#b71c1c',
                  color: '#b71c1c',
                },
              }}
            >
              View Returns Policy
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ShippingInfoPage;

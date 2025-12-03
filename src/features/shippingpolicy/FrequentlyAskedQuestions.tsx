import { useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { colors } from '../../theme';
import type { FAQ } from '../../types/common';

interface FrequentlyAskedQuestionsProps {
  faqs: FAQ[];
}

export const FrequentlyAskedQuestions: React.FC<FrequentlyAskedQuestionsProps> = ({ faqs }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
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
              border: `1px solid ${colors.border.default}`,
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
                  color: colors.text.primary,
                }}
              >
                {faq.question}
              </Typography>
              {expandedFAQ === faq.id && (
                <Typography variant="body2" sx={{ color: colors.text.lightGray, lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

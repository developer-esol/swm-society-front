import React, { useState } from 'react';
import { Box, Typography} from '@mui/material';
import { colors } from '../../theme';
import type { ReturnStep } from '../../types/common';

interface HowToReturnProps {
  returnSteps: ReturnStep[];
}

export const HowToReturn: React.FC<HowToReturnProps> = ({ returnSteps }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        How to Return an Item
      </Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        {returnSteps.map((step, index) => (
          <Box
            key={step.id}
            sx={{
              display: 'flex',
              gap: 3,
              pb: 2,
              borderBottom: index < returnSteps.length - 1 ? `1px solid ${colors.border.default}` : 'none',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => toggleStep(step.id)}
          >
            {/* Step Number Circle */}
            <Box
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: colors.button.primary,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
                flexShrink: 0,
                mt: 0.5,
              }}
            >
              {index + 1}
            </Box>

            {/* Step Content */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: expandedStep === step.id ? 1.5 : 0,
                  color: colors.text.primary,
                }}
              >
                {step.title}
              </Typography>
              {expandedStep === step.id && (
                <Box>
                  {step.description.map((desc, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      sx={{
                        color: colors.text.lightGray,
                        lineHeight: 1.7,
                        mb: idx < step.description.length - 1 ? 1.5 : 0,
                      }}
                    >
                      {desc}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

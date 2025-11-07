import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

interface NavLinkProps {
  to: string;
  label: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, label }) => {
  return (
    <Button
      component={Link}
      to={to}
      color="inherit"
      sx={{ 
        textTransform: 'none',
        fontSize: { xs: '1rem', md: '1.125rem' },
        fontWeight: 400,
      }}
    >
      {label}
    </Button>
  );
};
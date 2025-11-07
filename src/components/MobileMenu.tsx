import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  menuItems: { label: string; to: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  menuItems,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              onClick={onClose}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
      </List>
    </Drawer>
  );
};
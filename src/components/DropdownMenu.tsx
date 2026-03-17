import React, { useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DropdownMenuProps {
  label: string;
  items: { name: string; path: string }[];
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        endIcon={<ChevronDown size={18} />}
        onClick={handleOpen}
        sx={{ 
          textTransform: 'none',
          fontSize: { xs: '1rem', md: '1.125rem' },
          fontWeight: 400,
        }}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        MenuListProps={{ onMouseLeave: handleClose }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'black',
              color: 'white',
              '& .MuiMenuItem-root': {
                fontSize: '1rem',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.21)',
                }
              }
            }
          }
        }}
      >
        {items.map((item) => {
          const [pathname, search] = item.path.split('?');
          // Collapse any repeated hyphens and slashes in the pathname, preserve querystring
          const fixedPath = pathname
            .replace(/-+/g, '-')
            .replace(/\/+/g, '/')
            .replace(/\/-/g, '/-');
          const normalizedPathname = fixedPath.startsWith('/') ? fixedPath : `/${fixedPath}`;
          const finalPath = search ? `${normalizedPathname}?${search}` : normalizedPathname;
          return (
            <MenuItem
              key={item.name}
              component={Link}
              to={finalPath}
              onClick={handleClose}
            >
              {item.name}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
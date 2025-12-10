import React from 'react'
import { Breadcrumbs, Link as MuiLink, Typography, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { colors } from '../theme'

interface Crumb {
  label: string
  to?: string
}

interface AdminBreadcrumbsProps {
  items: Crumb[]
}

const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) return null

  // Remove a leading 'Admin' root if present, then ensure breadcrumbs start with Dashboard
  const withoutAdmin = items.filter((it, idx) => {
    if (idx === 0 && (it.label || '').toString().toLowerCase().trim() === 'admin') return false
    return true
  })

  const dashboardCrumb: Crumb = { label: 'Dashboard', to: '/admin' }

  let displayItems: Crumb[] = []
  if (withoutAdmin.length === 0) {
    displayItems = [dashboardCrumb]
  } else if ((withoutAdmin[0].label || '').toString().toLowerCase().trim() === 'dashboard') {
    displayItems = withoutAdmin
  } else {
    displayItems = [dashboardCrumb, ...withoutAdmin]
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Breadcrumbs aria-label="breadcrumb" separator="/">
        {displayItems.map((it, idx) => {
          const isLast = idx === displayItems.length - 1
          if (isLast) {
            return (
              <Typography key={idx} sx={{ color: colors.text.primary, fontWeight: 600 }}>
                {it.label}
              </Typography>
            )
          }

          return (
            <MuiLink
              key={idx}
              component={RouterLink}
              to={it.to || '#'}
              underline="hover"
              sx={{ color: colors.text.primary, fontWeight: 500 }}
            >
              {it.label}
            </MuiLink>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}

export default AdminBreadcrumbs

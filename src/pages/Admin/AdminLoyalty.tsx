import { useState } from 'react'
import { Box, Container, Typography, TextField, Select, MenuItem, FormControl, Pagination, Stack, Autocomplete, IconButton } from '@mui/material'
import { Search as SearchIcon } from 'lucide-react'
import { useAdminLoyalty } from '../../hooks/admin'
import { adminLoyaltyService } from '../../api/services/admin/loyaltyService'
import { EditPointsModal, LoyaltyTable, CustomerInfoBox } from '../../features/Admin/loyalty'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import type { LoyaltyTransactionType } from '../../types/Admin/loyalty'

const AdminLoyalty = () => {
  const { customerData, transactions, currentPage, totalPages, filterType, isLoading, handlePageChange, handleFilterChange, handleAddPoints, handleSelectCustomer } = useAdminLoyalty()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ name: string; id: string }>>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleEditBalance = () => {
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
  }

  const handleSavePoints = async (points: number, reason: string) => {
    try {
      await handleAddPoints(points, reason)
      handleCloseEditModal()
    } catch (error) {
      console.error('Failed to save points:', error)
      throw error
    }
  }

  const handleSearchChange = async (_event: React.SyntheticEvent, value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      const results = await adminLoyaltyService.searchCustomers(value)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleCustomerSelect = (_event: React.SyntheticEvent, value: { name: string; id: string } | null) => {
    if (value) {
      handleSelectCustomer(value.id)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 3, sm: 4, md: 4 },
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
        }}
      >
        {/* Header */}
        <AdminBreadcrumbs items={[{ label: 'Admin', to: '/admin' }, { label: 'Loyalty', to: '/admin/loyalty' }]} />

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.text.primary,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              mb: 2,
            }}
          >
            Loyalty Management
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Autocomplete
              options={searchResults}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              inputValue={searchQuery}
              onInputChange={handleSearchChange}
              onChange={handleCustomerSelect}
              sx={{
                width: 250,
                '& .MuiOutlinedInput-root': {
                  bgcolor: colors.background.default,
                  borderRadius: 1,
                  paddingLeft: '12px',
                  '& fieldset': {
                    borderColor: colors.border.default,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.border.default,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.border.default,
                    borderWidth: '1px',
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search customers..."
                  variant="outlined"
                  size="small"
                />
              )}
            />
            <IconButton
              sx={{
                bgcolor: '#C62C2B',
                color: 'white',
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: '#A82421' },
              }}
            >
              <SearchIcon size={16} />
            </IconButton>
          </Box>
        </Box>

        {/* Customer Info and Stats */}
        {customerData && <CustomerInfoBox customerData={customerData} />}

        {/* Transaction History Section */}
        <Box sx={{ mt: 4 }}>
          {/* Section Header with Filters */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: colors.text.primary,
                fontSize: '1.1rem',
              }}
            >
              Transaction History
            </Typography>

            {/* Filter Options */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filterType}
                  onChange={(e) => handleFilterChange(e.target.value as LoyaltyTransactionType | 'all')}
                  sx={{
                    bgcolor: colors.input.bg,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border.default,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border.default,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border.default,
                    },
                  }}
                >
                  <MenuItem value="all">All Transactions</MenuItem>
                  <MenuItem value="earned">Earned</MenuItem>
                  <MenuItem value="redeemed">Redeemed</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  defaultValue="Last 30 Days"
                  sx={{
                    bgcolor: colors.input.bg,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border.default,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border.default,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.border.default,
                    },
                  }}
                >
                  <MenuItem value="All Time">All Time</MenuItem>
                  <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                  <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                  <MenuItem value="Last 90 Days">Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Table */}
          {isLoading ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: colors.text.secondary }}>
              Loading transactions...
            </Typography>
          ) : (
            <>
              <LoyaltyTable transactions={transactions} onEditBalance={handleEditBalance} />

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                  <Typography sx={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
                    {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, transactions.length)} of {transactions.length} transactions
                  </Typography>
                  <Stack spacing={2} direction="row">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_e, page) => handlePageChange(page)}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: colors.text.primary,
                          borderColor: colors.border.default,
                          '&.Mui-selected': {
                            backgroundColor: '#dc2626',
                            color: 'white',
                          },
                        },
                      }}
                    />
                  </Stack>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

      {/* Edit Points Modal */}
      <EditPointsModal
        open={editModalOpen}
        availablePoints={customerData?.availablePoints || 0}
        onClose={handleCloseEditModal}
        onSave={handleSavePoints}
      />
    </Box>
  )
}

export default AdminLoyalty

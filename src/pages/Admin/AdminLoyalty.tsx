import { useState, useEffect } from 'react'
import { Box, Container, Typography, TextField, Select, MenuItem, FormControl, Pagination, Stack, Autocomplete, IconButton, Button } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useAdminLoyalty } from '../../hooks/admin'
import { adminLoyaltyService } from '../../api/services/admin/loyaltyService'
import { EditPointsModal, LoyaltyTable, CustomerInfoBox, AddPointsModal } from '../../features/Admin/loyalty'
import { colors } from '../../theme'
import AdminBreadcrumbs from '../../components/Admin/AdminBreadcrumbs'
import { Permission } from '../../components/Permission'
import { PERMISSIONS } from '../../configs/permissions'
import type { LoyaltyTransactionType } from '../../types/Admin/loyalty'

const AdminLoyalty = () => {
  const { customerData, transactions, currentPage, totalPages, filterType, isLoading, aggregatedStats, handlePageChange, handleFilterChange, handleAddPoints, handleSelectCustomer } = useAdminLoyalty()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addPointsModalOpen, setAddPointsModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ name: string; id: string }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [allUsers, setAllUsers] = useState<Array<{ name: string; id: string }>>([])
  const [selectedUser, setSelectedUser] = useState<{ name: string; id: string } | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load all users on mount for dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await adminLoyaltyService.getCustomers()
        setAllUsers(users)
        console.log('Loaded users:', users.length)
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    }
    loadUsers()
  }, [])

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
      console.log('Search results:', results)
    } else {
      setSearchResults(allUsers)
    }
  }

  const handleSearchOpen = () => {
    // Show all users when dropdown opens
    if (searchResults.length === 0 && !searchQuery) {
      setSearchResults(allUsers)
    }
  }

  const handleCustomerSelect = (_event: React.SyntheticEvent, value: { name: string; id: string } | null) => {
    if (value) {
      setSelectedUser(value)
      handleSelectCustomer(value.id)
    } else {
      // User cleared the selection
      setSelectedUser(null)
      handleSelectCustomer(null)
      setSearchQuery('')
      setSearchResults(allUsers)
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
              value={selectedUser}
              getOptionLabel={(option) => option.name}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text.primary }}>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.disabled }}>
                      User ID: {option.id}
                    </Typography>
                  </Box>
                </Box>
              )}
              inputValue={searchQuery}
              onInputChange={handleSearchChange}
              onChange={handleCustomerSelect}
              onOpen={handleSearchOpen}
              sx={{
                width: 300,
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
                bgcolor: colors.button.new,
                color: colors.text.secondary,
                borderRadius: 1,
                p: 1,
                '&:hover': { bgcolor: colors.button.dark },
              }}
            >
              <SearchIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Display User Name if Selected */}
        {customerData && (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: colors.text.primary,
                lineHeight: 1.3,
              }}
            >
              {customerData.customerName}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: colors.text.secondary,
                mt: 0.5,
              }}
            >
              User ID: {customerData.customerId}
            </Typography>
          </Box>
        )}

        {/* Stats Boxes - Show selected user data or aggregated data */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: customerData ? 2 : 3 
        }}>
          {/* Available Points */}
          <Box sx={{
            bgcolor: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            borderRadius: 2,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: '#fff4e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{ color: colors.loyalty.yellownew, fontSize: '24px' }}>★</Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.9rem', color: colors.text.primary, fontWeight: 600, mb: 0.5 }}>
                Available Points
              </Typography>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.loyalty.yellownew }}>
                {customerData ? customerData.availablePoints : aggregatedStats.remaining}
              </Typography>
            </Box>
          </Box>

          {/* Points Issued */}
          <Box sx={{
            bgcolor: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            borderRadius: 2,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: colors.loyalty.points,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{ color: colors.loyalty.pointissue, fontSize: '24px' }}>↗</Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.9rem', color: colors.text.primary, fontWeight: 600, mb: 0.5 }}>
                Points Issued
              </Typography>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.loyalty.pointissue }}>
                {customerData ? customerData.totalPoints : aggregatedStats.totalEarned}
              </Typography>
            </Box>
          </Box>

          {/* Points Redeemed */}
          <Box sx={{
            bgcolor: colors.background.default,
            border: `1px solid ${colors.border.default}`,
            borderRadius: 2,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: colors.loyalty.box,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{ color: colors.points.primary, fontSize: '24px' }}>↘</Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.9rem', color: colors.text.primary, fontWeight: 600, mb: 0.5 }}>
                Points Redeemed
              </Typography>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.points.primary }}>
                -{customerData ? customerData.pointsRedeemed : aggregatedStats.totalRedeemed}
              </Typography>
            </Box>
          </Box>
        </Box>

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
              {/* Add Points Button - Requires CREATE_LOYALTY_POINTS permission */}
              <Permission permission={PERMISSIONS.CREATE_LOYALTY_POINTS}>
                <Button
                  onClick={() => setAddPointsModalOpen(true)}
                  variant="contained"
                  sx={{
                    bgcolor: colors.button.new,
                    color: colors.text.secondary,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: colors.button.dark,
                    },
                  }}
                >
                  Add Points
                </Button>
              </Permission>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
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
                            backgroundColor: colors.button.primary,
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

      {/* Add Points Modal */}
      <AddPointsModal
        open={addPointsModalOpen}
        users={allUsers}
        onClose={() => setAddPointsModalOpen(false)}
        onSuccess={() => {
          setAddPointsModalOpen(false)
          setRefreshTrigger(prev => prev + 1)
          // Reload current customer data if selected
          if (selectedUser) {
            handleSelectCustomer(selectedUser.id)
          }
        }}
      />
    </Box>
  )
}

export default AdminLoyalty

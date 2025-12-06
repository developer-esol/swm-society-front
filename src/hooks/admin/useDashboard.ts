import { useMemo } from 'react'
import { getDashboardData } from '../../api/services/admin'
import type { DashboardData } from '../../types/Admin'

export const useDashboard = (): DashboardData => {
  return useMemo(() => {
    return getDashboardData()
  }, [])
}

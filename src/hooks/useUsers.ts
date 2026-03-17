import { useQuery } from '@tanstack/react-query'
import { userService } from '../api/services/admin/userService'
import { QUERY_KEYS } from '../configs/queryKeys'

export function useAdminUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users.admin,
    queryFn: () => userService.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export default useAdminUsers

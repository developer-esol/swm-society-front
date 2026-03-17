import { useQuery } from '@tanstack/react-query'
import { rolesService } from '../api/services/admin/rolesService'
import { QUERY_KEYS } from '../configs/queryKeys'

export function useRolesList() {
  return useQuery({
    queryKey: QUERY_KEYS.roles.all,
    queryFn: () => rolesService.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export default useRolesList

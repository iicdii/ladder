import { useMemo } from 'react'

const useQueryParams = () => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const queryParams: { [key: string]: string | null } = {}
    params.forEach((value, key) => {
      queryParams[key] = value
    })
    return queryParams
  }, [])
}

export default useQueryParams

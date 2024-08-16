export function useSanctumConfig() {
  const config = useRuntimeConfig().public.sanctum
  return {
    ...config
  }
}

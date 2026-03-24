import { routers } from '@/constants/routers'

export const getRouterByName = (name: string): string => {
  if (!routers.some((r) => r.name === name)) {
    throw new Error(`Router with name ${name} not found`)
  }

  return routers.find((r) => r.name === name)?.to ?? ''
}

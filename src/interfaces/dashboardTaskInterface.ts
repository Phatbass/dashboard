export interface DashboardTaskInterface extends Record<string, unknown> {
  id: number
  title: string
  sort: number
  owner: string
}

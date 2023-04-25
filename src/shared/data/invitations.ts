import { invitations } from './tables'

export const Invitations = () => {
  return {
    async getByKey(key: string) {
      const result = await invitations
        .select(
          `id, name, status, tickets (id, status), guests (id, first_name, last_name, genre, status)`
        )
        .eq('key', key)
        .single()

      const { error, data } = result

      if (error?.code === 'PGRST116' && !data)
        return {
          error: {
            status: 404,
            code: 'Resource Not Found',
            message: `Invitation by key '${key}' not found`,
          },
          data: null,
          count: null,
          status: 404,
          statusText: 'Resource Not Found',
        }

      return result
    },
  }
}

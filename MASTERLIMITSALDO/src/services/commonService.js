import { apiSession, apiSelf } from '@/helper/ourAxios'

export function getSession(data) {
  return apiSession.post('/session/api/session', {
    user_name: data.name
  })
}
export function selfSessionApi() {
  return apiSelf.get("/api/whoami");
}
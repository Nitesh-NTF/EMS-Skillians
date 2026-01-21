import { API } from "./api"

export const getAdminStats = () => {
    return API.get(`/api/admin/dashboard-stats`).then(res => res.data)
}
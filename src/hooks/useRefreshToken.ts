import axios from "@/api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
    const { setAuth } = useAuth()

    const refresh = async () => {
        const response = await axios.get('/auth/refreshToken', {
            withCredentials: true //allow us to send cookies with our request mrgl ? lifih refresh token  
        });
        setAuth((prev: any) => {
            console.log(JSON.stringify(prev))
            console.log(response.data.accessToken)
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken
    }
    return refresh
}

export default useRefreshToken
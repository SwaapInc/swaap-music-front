import axios from "axios";
import {formatSimpleUser} from "../util/utils";

class UserService {

    async getSimpleUserForTest() {
        const {data} = await axios.post(`/api/user`, {})
            .catch(function (error) {
                console.error(error)
            })
        return formatSimpleUser(data)
    }

    async authenticateUser(input) {
        const res = await axios.post(`/api/authenticate`, input)
        const {data} = res;
        if(data.status === 200) {
            return {
                status: data.status,
                user: formatSimpleUser(data.userInfos.user),
                playlists: data.userInfos.playlists
            }
        } else {
            return data
        }
    }

    async signUpUser(input) {
        const res = await axios.post(`/api/users`, input)
        const {data} = res;
        console.log(data)
    }
}

export default UserService

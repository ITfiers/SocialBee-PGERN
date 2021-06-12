import axios, { AxiosInstance } from "axios"
import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextPageContext,
} from "next"

export function buildClient(
    ctx?: GetServerSidePropsContext | NextPageContext
): AxiosInstance {
    let baseURL = "http://localhost:5000"

    if (typeof window === "undefined") {
        console.log("server")
        return axios.create({ baseURL, headers: ctx.req.headers })
    } else {
        console.log("client")
        return axios.create({
            baseURL,
            withCredentials: true,
        })
    }
}

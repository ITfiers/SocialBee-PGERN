import axios, { AxiosInstance } from "axios"
import { GetServerSidePropsContext, NextPageContext } from "next"

export function buildClient(
    context?: GetServerSidePropsContext | NextPageContext
): AxiosInstance {
    const baseURL = "http://localhost:5000"
    if (isNextJsServerSide()) {
        // Server
        return axios.create({
            baseURL,
            headers: context.req.headers,
        })
    } else {
        // Client
        return axios.create({
            baseURL,
            withCredentials: true,
        })
    }
}

function isNextJsServerSide() {
    return typeof window === "undefined"
}

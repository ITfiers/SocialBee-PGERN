import { GetServerSideProps, NextPage } from "next"
import { AppInitialProps, AppProps, AppContext } from "next/app"
import { buildClient } from "../api/build-client"
import { Layout } from "../components/layout"
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />;
        </Layout>
    )
}

export default MyApp

MyApp.getInitialProps = async (appContext: AppContext) => {
    let user = null
    try {
        const client = buildClient(appContext.ctx)
        const { data } = await client.get("/api/auth/current")
        user = data
    } catch (error) {
        console.error(error.response?.data)
    }
    console.log("App", user)
    return {
        user,
    }
}

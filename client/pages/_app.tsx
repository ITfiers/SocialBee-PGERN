import { AppProps, AppContext } from "next/app"
import "../styles/globals.css"
import { Layout } from "../src/components/layout"
import { buildClient } from "../src/api/build-client"

interface MyCustomAppProps extends AppProps {
    currentUser: { id: string; username: string }
}

function MyApp({ Component, pageProps, currentUser }: MyCustomAppProps) {
    return (
        <Layout user={currentUser}>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp

MyApp.getInitialProps = async (context: AppContext) => {
    let user = null
    try {
        const client = buildClient(context.ctx)
        const { data } = await client.get("/api/auth/current")
        user = data
    } catch (error) {
        console.error(error.response.data)
    }

    return {
        currentUser: user,
    }
}

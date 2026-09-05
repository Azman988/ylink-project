import { Outlet } from "react-router-dom";
import { Header } from "../Components/MainComponents/Header/Header";
import Footer from "../Components/MainComponents/Footer";
import { Cart } from "../Components/MainComponents/Cart";

export function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <Cart mobile={true} />
            <Cart />
        </>
    )
}
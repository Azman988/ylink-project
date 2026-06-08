import { Outlet } from "react-router-dom";
import { Header } from "../MainComponents/Header/Header";
import Footer from "../MainComponents/Footer";
import { Cart } from "../MainComponents/Cart/Cart";

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
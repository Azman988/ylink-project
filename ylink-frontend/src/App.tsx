import { Route, Routes } from 'react-router-dom'
import { CartProvider } from './Components/MainComponents/Cart/CartProvider.tsx'
import { Layout } from './Components/Layouts/MainLayout.tsx'
import ProductDetails from './Pages/MainPages/ProductDetails.tsx'
import Home from './Pages/MainPages/Home.tsx'
import Shop from './Pages/MainPages/Shop.tsx'
import Consultation from './Pages/MainPages/Consultation.tsx'
import CheckOut from './Pages/MainPages/CheckOut.tsx'
import Orders from './Pages/MainPages/Orders.tsx'
import Address from './Pages/MainPages/Address.tsx'
import Support from './Pages/MainPages/Support.tsx'
import Account from './Pages/MainPages/Account.tsx'
import OrderTracking from './Pages/MainPages/OrderTracking.tsx'
import PrivacyPolicy from './Pages/MainPages/PrivacyPolicy.tsx'
import TermsOfService from './Pages/MainPages/TermsOfService.tsx'
import Auth from './Pages/MainPages/Auth.tsx'
import OrderReceived from './Pages/MainPages/Order-Recieved.tsx'
import AdminPanel from './Pages/AdminPages/AdminPanel.tsx'
import OrdersView from './Pages/AdminPages/OrdersManager.tsx'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path='auth' element={<Auth />} />
        {/* Main Layout */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='shop' element={<Shop />} />
          <Route path='consultation' element={<Consultation />} />
          <Route path='checkout' element={<CheckOut />} />
          <Route path='orders' element={<Orders />} />
          <Route path='orders-track' element={<OrderTracking />} />
          <Route path='address' element={<Address />} />
          <Route path='support' element={<Support />} />
          <Route path='account' element={<Account />} />
          <Route path='privacy-policy' element={<PrivacyPolicy />} />
          <Route path='terms-of-service' element={<TermsOfService />} />
        </Route>
        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/order-received' element={<OrderReceived />} />
        {/* Admin Layout */}
        <Route path='/admin' element={<AdminPanel />} />
        <Route path='/ordersview' element={<OrdersView />} />
      </Routes>
    </CartProvider>

  )
}

export default App

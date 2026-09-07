import { Route, Routes } from 'react-router-dom'
import { Layout } from './Layouts/MainLayout.tsx'
import ProductDetails from './Pages/MainPages/ProductDetails.tsx'
import Home from './Pages/MainPages/Home.tsx'
import Shop from './Pages/MainPages/Shop.tsx'
import Consultation from './Pages/MainPages/Consultation.tsx'
import CheckOut from './Pages/MainPages/CheckOut.tsx'
import Orders from './Pages/MainPages/Orders.tsx'
import Support from './Pages/MainPages/Support.tsx'
import Account from './Pages/MainPages/Account.tsx'
import OrderTracking from './Pages/MainPages/OrderTracking.tsx'
import PrivacyPolicy from './Pages/MainPages/PrivacyPolicy.tsx'
import TermsOfService from './Pages/MainPages/TermsOfService.tsx'
import Auth from './Pages/MainPages/Auth.tsx'
import OrderReceived from './Pages/MainPages/Order-Recieved.tsx'
import AdminPanel from './Pages/AdminPages/AdminPanel.tsx'
import { ProtectedRoute } from './Components/ProtectedRoute.tsx'
import { CartProvider } from './context/CartContext.tsx'
import DriverOrdersView from './Pages/AdminPages/DriverView/DriverOrdersView.tsx'
import { ResetPassword } from './Pages/MainPages/ResetPassword.tsx'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path='auth' element={<Auth />} />
        <Route path='reset-password/:resettoken' element={<ResetPassword />} />

        {/* Main Layout */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='shop' element={<Shop />} />
          <Route path='product/:slug' element={<ProductDetails />} />
          <Route path='consultation' element={<Consultation />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='orders' element={<Orders />} />
            <Route path='checkout' element={<CheckOut />} />
            <Route path='order-received' element={<OrderReceived />} />
            <Route path='account' element={<Account />} />
            <Route path='orders-track' element={<OrderTracking />} />
          </Route>

          <Route path='support' element={<Support />} />
          <Route path='privacy-policy' element={<PrivacyPolicy />} />
          <Route path='terms-of-service' element={<TermsOfService />} />
          
          {/* Delivery Driver Route */}
          <Route element={<ProtectedRoute />}>
            <Route path='/delivery-driver' element={<DriverOrdersView />} />
          </Route>
        </Route>

        {/* Protected Admin Route */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path='/admin' element={<AdminPanel />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App

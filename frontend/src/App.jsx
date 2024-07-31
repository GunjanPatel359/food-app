import './App.css'
import './index.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  LoginPage,
  SignupPage,
  ActivationPage,
  ProfilePage
} from "./routes/userRoute"

import {
  SellerLoginPage,
  SellerSignupPage,
  SellerActivationPage,
  SellerProfilePage,
  SellerRestaurantPage
} from "./routes/sellerRoute"

// import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  // const initialOptions = {
  //   clientId: "AfFPQyFjoighEawdekfr2QzGVeVSuMwbZoldGgZ-6GQ8T04sCkit6SPfw0zMeOJQ-LZ_Ma8S_S9Mxplq",
  //   currency: "USD",
  //   intent: "capture",
  // };
  return(
    <>
    {/* <PayPalScriptProvider options={initialOptions}> */}
      <BrowserRouter>
      {/* router settings */}
        <Routes>
          <Route path='/home' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SignupPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/user/activation/:token' element={<ActivationPage/>}/>
        </Routes>

        <Routes>
          <Route path='/seller/login' element={<SellerLoginPage/>} />
          <Route path='/seller/sign-up' element={<SellerSignupPage/>} />
          <Route path='/seller/profile' element={<SellerProfilePage/>} />
          <Route path='/seller/activation/:token' element={<SellerActivationPage/>}/>
          <Route path='/seller/:hotelId' element={<SellerRestaurantPage/>} />
        </Routes>

        {/* react toastify configuration */}
        <ToastContainer
            position='bottom-center'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='dark'
          />

      </BrowserRouter>
    {/* </PayPalScriptProvider> */}
    </>
  )
}

export default App

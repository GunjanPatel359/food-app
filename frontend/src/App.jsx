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
  RestaurantPage,
  RestaurantsPage,
  FoodItemsPage,
  FoodItemPage
} from "./routes/publicRoute.js"

import {
  SellerLoginPage,
  SellerSignupPage,
  SellerActivationPage,
  SellerProfilePage,
  SellerRestaurantPage
} from "./routes/sellerRoute"

import {
  SellerRestaurantManagePage,
  SellerRestaurantOrderTablePage
} from "./routes/sellerResturantManageRoute.js"

import {
  UserOccupingTablePage,
  UserBookedTablePage
} from "./routes/userTableRoute"


function App() {
  return(
    <>
      <BrowserRouter>
      {/* router settings */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/restaurants' element={<RestaurantsPage/>} />
        <Route path='/food-items' element={<FoodItemsPage />} />
        <Route path='/restaurant/:hotelId' element={<RestaurantPage />} />
        <Route path='/food-item/:foodItemId' element={<FoodItemPage />} />
      </Routes>

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

        <Routes>
          <Route path='/seller/restaurant/:hotelId' element={<SellerRestaurantManagePage/>}/>
          <Route path='/seller/restaurant/:hotelId/ordertable/:orderTableId' element={<SellerRestaurantOrderTablePage/>}/>
        </Routes>

        <Routes>
          <Route path='/user/restaurant/:hotelId/qrcode/:orderTabelId/:randomString/:memberId' element={<UserOccupingTablePage />} />
          <Route path='/user/:hotelId/:orderTableId/user-table' element={<UserBookedTablePage />} />
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
    </>
  )
}

export default App

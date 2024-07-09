import './App.css'
import './index.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  LoginPage,
  SignupPage,
  ActivationPage
} from "./routes/userRoute"

function App() {

  return(
    <>
      <BrowserRouter>
      {/* router settings */}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/sign-up' element={<SignupPage />} />
          <Route path='/user/activation/:token' element={<ActivationPage/>}/>
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

import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import Home from "./views/home";
import ProductDetails from "./views/productDetails";
import UserCoupons from "./views/userCoupons";
import UserCouponsActives from "./views/userCouponsActives"
import UserCouponsUsed from "./views/userCouponsUsed"
import MainLayout from "./layouts/main";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
      <MainLayout>
        <Routes>
          
            <Route path="/" exact element={<Home />} />
            <Route path="/producDetails/:nftId"  element={<ProductDetails />} />
            <Route path="/user-coupons" exact element={<UserCoupons />} />
            <Route path="/user-coupons/actives"  element={<UserCouponsActives />} />
            <Route path="/user-coupons/used"  element={<UserCouponsUsed />} /> 
        </Routes>  
        </MainLayout>
      </BrowserRouter>    
    </ChakraProvider>
  );
}

export default App;

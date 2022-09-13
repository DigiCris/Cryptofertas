import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import Home from "./views/home";
import ProductDetails from "./views/productDetails";
import UserCoupons from "./views/userCoupons";

import ExchangeCoupon from "./views/exchangeCoupon";
import PageNotFound from "./views/pageNotFound";

import MainLayout from "./layouts/main";


function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
      <MainLayout>
        <Routes>
            <Route path="/" exact element={<Home />} />
            {/* <Route path="/producDetails/:nftId"  element={<ProductDetails />} /> */}
            <Route path="/user-coupons/:ownerOrCreated/:value" exact element={<UserCoupons />} /> 
          <Route path="/productDetails/:tokenId"  element={<ProductDetails />} />
          <Route path="/exchange-coupon/:id" element={<ExchangeCoupon />} /> 
          <Route path="*" element={<PageNotFound />} />
        </Routes>  
        </MainLayout>
      </BrowserRouter>    
    </ChakraProvider>
  );
}

export default App;

import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ChakraProvider} from "@chakra-ui/react";
import Home from "./views/home";
import ProductDetails from "./views/productDetails";
import UserCoupons from "./views/userCoupons";
import ExchangeCoupon from "./views/exchangeCoupon";
import PageNotFound from "./views/pageNotFound";


//Tiempo
//Nombre
//Cantidad
//Imagen
//Precio

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/producDetails/:nftId"  element={<ProductDetails />} />
          <Route path="/user-coupons/:ownerOrCreated/:value" element={<UserCoupons />} />
          <Route path="/exchange-coupon/:id" element={<ExchangeCoupon />} /> 
          <Route path="*" element={<PageNotFound />} />
        </Routes>  
      </BrowserRouter>    
    </ChakraProvider>
  );
}

export default App;

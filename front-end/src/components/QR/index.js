import React from "react";
import QRCode from "react-qr-code";
import {Center} from "@chakra-ui/react";

const QR = () => {

  return (
    <Center>
        <QRCode value="Hola Mundo" size={150} bgColor="#282c34" fgColor="#fff" level="H" />
    </Center>
  );
};

export default QR;
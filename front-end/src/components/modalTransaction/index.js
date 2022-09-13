import React, { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useToast,
  Image,
  Icon,
  VStack
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import useMarketPlace from '../../hooks/useMarketPlace';
import useERC20 from '../../hooks/useERC20';
import { useWeb3React} from "@web3-react/core";
import { useMarketPlace  as market } from '../../config/web3/contracts/MarketPlace';
import { useParams } from "react-router-dom";

import axios from "axios";

import { ethers} from "ethers";

const ModalTransition = (props) => {
  const {apiDataName, apiDataImage, apiDataNewPrice, apiDataOldPrice, apiDataDescription} = props;

  /*
  useEffect(() => {
    allowanceAccount();
}, []);*/
const MarketPlace = useMarketPlace();
const ERC20 = useERC20();
const { tokenId } = useParams();
console.log(tokenId);
const [buying, setBuying] = useState(false);


const marketPlaceAddress = '0x6e0bD3D1751563a16E7b0949De9932a45596900d';
//const limitAllowance = BigNumber(BigNumber(999) * BigNumber(10).pow(18))//500 000000000000000000
const limitAllowance = ethers.BigNumber.from(500).mul(ethers.BigNumber.from(10).pow(18))//500 000000000000000000
const amountAllowance = ethers.BigNumber.from(900).mul(ethers.BigNumber.from(10).pow(18))//900 000000000000000000
const { active, activate, deactivate, account, error, library } = useWeb3React();

const Buy = async (tokenId) => {
  setBuying(true);
  // await allowanceAccount();
  await MarketPlace.methods
    .Buy(tokenId)
    .send({
      from: account,
      gas: 3000000,
    })
    .on("error", async () => {
      setBuying(false);
      const res = await axios.get(`https://cryptofertas.tk/backend/api.php?function=writeDirty&param=${tokenId}`);
      showToast('Error, por favor verifique y vuelva a intentar', 'error')
      //setMinting(false);
      return null
    })
    .on("transactionHash", (txHash) => {
      showToast('Transaccion en progreso', 'info')
      console.log('hash', txHash)
      //props.closeModal()
    })
    .on("receipt", (receipt) => {
      //setMinting(false);
      setBuying(false);
      showToast('Compra exitosa!', 'success')
      //getPlatziPunksData();
      console.log(receipt);
      onTransactionClose();

      //props.closeModal()
      return 'ok'
    });
}

const approveAmount = (tokenId) => {
  ERC20.methods
    .approve(marketPlaceAddress, amountAllowance)
    .send({
      from: account,
      gas: 3000000,
    })
    .on("error", () => {
      showToast('Error approve ', 'error')
      //setMinting(false);
      return null
    })
    .on("transactionHash", (txHash) => {
      showToast('Transacción enviada: approve(ERC20)', 'info')
      console.log('hash', txHash)
      //props.closeModal()
    })
    .on("receipt", (receipt) => {
      Buy(tokenId);
      //setMinting(false);
      showToast('Approve(ERC20) Ejecutado Correctamente', 'success')
      //getPlatziPunksData();
      console.log(receipt);
      //props.closeModal()
      return 'ok'
    });
}

const allowanceAccount = async (tokenId) => {
  const allowance = await ERC20.methods.allowance(account, marketPlaceAddress).call();

  if (allowance < limitAllowance) {
    console.log('menor', allowance, amountAllowance)
    approveAmount(tokenId);
  }
  else Buy(tokenId);
}

const toast = useToast()
const showToast = (des, status) => {
  toast({
    position: 'top',
    title: 'Proceso de compra',
    description: des,
    status: status,
    duration: 5000,
    isClosable: true,
  })
}

  const {isTransactionOpen, onTransactionClose, name, description, newPrice} = props;
  return (
      <>
      <Center py={12}>
      <Modal isOpen={isTransactionOpen} onClose={onTransactionClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
        <Heading mt='8' as='h3' size='lg' align="center">
        Ya casi!</Heading>
        <Text color={'gray.500'} align="center">Está a punto de comprar</Text>
      <Stack>
        <Center>
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={apiDataImage}
              mt={4}
            />
            </Center>
      </Stack>
        <Stack pt={6} align={'center'}>
        <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
        {apiDataName} 
        </Heading>
        <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
        {apiDataDescription}
        </Text>
        <Stack direction={"row"} align="center">
        <Text fontWeight={800}
              fontSize={{ base: "2xl", sm: "4xl", lg: "4xl" }}  color={"green.300"}
              lineHeight={0.8}  >
          {apiDataNewPrice}
        </Text>
        <Icon boxSize={6} viewBox="0 0 200 200" color="red.500">
          <svg width="200" height="200" viewBox="0 0 155 155" fill="none">
            <circle cx="77.5" cy="77.5" r="77.5" fill="#262A2F" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M105.174 110.142C115.272 110.142 123.459 101.955 123.459 91.8565C123.459 81.7577 115.272 73.571 105.174 73.571C95.0749 73.571 86.8882 81.7577 86.8882 91.8565C86.8882 101.955 95.0749 110.142 105.174 110.142ZM105.174 102.015C110.784 102.015 115.332 97.4668 115.332 91.8564C115.332 86.246 110.784 81.6978 105.174 81.6978C99.5633 81.6978 95.0152 86.246 95.0152 91.8564C95.0152 97.4668 99.5633 102.015 105.174 102.015Z"
              fill="#67E992"
            />
            <line
              x1="62.3427"
              y1="116.461"
              x2="91.8243"
              y2="35.4609"
              stroke="#67E992"
              stroke-width="9"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M48.2854 81.6978C58.3842 81.6978 66.5709 73.5112 66.5709 63.4124C66.5709 53.3136 58.3842 45.127 48.2854 45.127C38.1867 45.127 30 53.3136 30 63.4124C30 73.5112 38.1867 81.6978 48.2854 81.6978ZM48.2856 73.5709C53.896 73.5709 58.4442 69.0227 58.4442 63.4123C58.4442 57.8019 53.896 53.2537 48.2856 53.2537C42.6751 53.2537 38.127 57.8019 38.127 63.4123C38.127 69.0227 42.6751 73.5709 48.2856 73.5709Z"
              fill="#67E992"
            />
          </svg>
        </Icon>
      </Stack>
      </Stack>
        </ModalBody>

        <ModalFooter>
          <VStack  w={'full'}>
          <Button isLoading={buying}  colorScheme={"green"}
          loadingText='Esperando aprobacion'
          mr={3} onClick={() => allowanceAccount(tokenId)}  w="100%">
          Comprar
          </Button>
          <Button variant='outline'  w="100%" onClick={onTransactionClose}>Cancelar</Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Center>
      </>
  )
}
export default ModalTransition;
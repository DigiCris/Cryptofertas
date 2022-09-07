import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useToast,
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
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { Button, ButtonGroup } from '@chakra-ui/react';
import BigNumber from 'big-number';
import useMarketPlace from '../../hooks/useMarketPlace';
import useERC20 from '../../hooks/useERC20';
import { useWeb3React} from "@web3-react/core";
import { useMarketPlace  as market } from '../../config/web3/contracts/MarketPlace';
import { useParams } from "react-router-dom";

const ModalTransition = (props) => {
const MarketPlace = useMarketPlace();
const ERC20 = useERC20();
const { tokenId } = useParams();
console.log(tokenId);

const marketPlaceAddress = '0x9196d7405C52E37CEe59A3E16e209285f6Fa11Aa';
const limitAllowance = BigNumber(BigNumber(500) * BigNumber(10).pow(18))//500 000000000000000000
const amountAllowance = BigNumber(BigNumber(900) * BigNumber(10).pow(18))//900 000000000000000000
const { active, activate, deactivate, account, error, library } = useWeb3React();

const Buy = (tokenId) => {
  MarketPlace.methods
    .Buy(tokenId)
    .send({
      from: account,
      gas: 3000000,
    })
    .on("error", () => {
      showToast('Error minteando cupón ', 'error')
      //setMinting(false);
      return null
    })
    .on("transactionHash", (txHash) => {
      showToast('Transacción enviada', 'info')
      console.log('hash', txHash)
      //props.closeModal()
    })
    .on("receipt", (receipt) => {
      //setMinting(false);
      showToast('Token Minteado Correctamente', 'success')
      //getPlatziPunksData();
      console.log(receipt);
      //props.closeModal()
      return 'ok'
    });
}

const approveAmount = () => {
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
      //setMinting(false);
      showToast('Approve(ERC20) Ejecutado Correctamente', 'success')
      //getPlatziPunksData();
      console.log(receipt);
      //props.closeModal()
      return 'ok'
    });
}

const allowanceAccount = async () => {
  const allowance = await ERC20.methods.allowance(account, marketPlaceAddress).call();

  if (allowance < limitAllowance) {
    console.log('menor', allowance, amountAllowance)
    approveAmount();
  }
  else console.log('mayor', allowance)
}

const toast = useToast()
const showToast = (des, status) => {
  toast({
    position: 'top',
    title: 'Creando cupón',
    description: des,
    status: status,
    duration: 5000,
    isClosable: true,
  })
}


  const {isTransactionOpen, onTransactionClose} = props;
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
        <Stack pt={10} align={'center'}>
        <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
        Arroz Mary tradicional 
        </Heading>
        <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
        (descripcion?)
        </Text>
        <Text fontWeight={800} fontSize={'4xl'} color={'green.300'}>
            57
          </Text>
      </Stack>
      <Stack>
      <TableContainer>
<Table variant='simple'>
  <Tbody>
    <Tr>
      <Td>Fee</Td>
      <Td isNumeric>25.4</Td>
    </Tr>
    <Tr>
      <Td>Total</Td>
      <Td isNumeric>0.91444</Td>
    </Tr>
  </Tbody>
</Table>
</TableContainer>
      </Stack>
        </ModalBody>

        <ModalFooter>
          <VStack  w={'full'}>
          <Button colorScheme={"green"} mr={3} onClick={() => Buy(tokenId)}  w="100%">
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
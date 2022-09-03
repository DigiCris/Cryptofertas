import ProductDescription from "../../components/productDescription";
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Image,
  VStack
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';

const ProductDetails = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isTransactionOpen, onOpen: onTransactionOpen, onClose: onTransactionClose } = useDisclosure()

  return (
    <>
     <Center py={12}>
      <Box
        role={'group'}
        maxW={'330px'}
        w={'full'}
        // bg={useColorModeValue('white', 'gray.800')}
        >
    <ProductDescription/>
    <Heading fontSize="sm" color={'gray.500'}>Product Description</Heading>
    <Text color={'gray.500'} mb={6}> Un delicado proceso de selección electrónica del grano garantizan más de un 90% de granos enteros, utilizados en infinidades de platos y postres,</Text>
    <Heading fontSize="sm" color={'gray.500'} >Terminos y condiciones</Heading>
    <Text color={'gray.500'}> Un delicado proceso de selección electrónica del grano garantizan más de un 90% de granos enteros, utilizados en infinidades de platos y postres,</Text>
    <Button colorScheme='teal'mt={10} w="100%" onClick={onOpen}>validar</Button>
    <Button colorScheme='teal'mt={10} w="100%" onClick={onTransactionOpen}>ir a aprobacion</Button>
    </Box>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
        <Center py={12}>
        <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={IMAGE}
          />
          </Center>
          <ModalCloseButton />
          <ModalBody>
          <Text color={'gray.500'} align="center"> Primero debe conectar su billetera para firmar mensajes y enviar transacciones a la red Ethereum</Text>
          </ModalBody>

          <ModalFooter>
            <VStack  w={'full'}>
            <Button colorScheme='teal' mr={3} onClick={onClose}  w="100%">
            Conectar billetera
            </Button>
            <Button variant='outline'  w="100%" onClick={onClose}>Cancelar</Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
            <Button colorScheme='teal' mr={3} onClick={onTransactionClose}  w="100%">
            Aprobar
            </Button>
            <Button variant='outline'  w="100%" onClick={onTransactionClose}>Cancelar</Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
    </>
  );
};

export default ProductDetails;
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


const ModalTransition = () => {
  const { isOpen: isTransactionOpen, onOpen: onTransactionOpen, onClose: onTransactionClose } = useDisclosure();
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
  )
}
export default ModalTransition;
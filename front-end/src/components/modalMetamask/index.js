import {
    Center,
    Text,
    Image,
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
  import { Button } from '@chakra-ui/react';
  const IMAGE =
    'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80';
  
  
  const ModalMetamask = (props) => {
    const {isOpen, onClose} = props;
    return (
        <>
        <Center py={12}>
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
    </Center>
        </>
    )
}
export default ModalMetamask;
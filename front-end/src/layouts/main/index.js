import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  VStack,
  Divider,
  Text,
  Button,
  Image,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NavLink from "./nav-link";
import WalletData from "./wallet-data";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { useRef } from 'react'


const Links = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Mis Cupones",
    to: "/user-coupons",
  },
];

const Filters = [
  {
    name: "Todas"
  },
  {
    name: "Alimentos",
  },
  {
    name: "Salud"
  },
  {
    name: "Electronicos",
  },
];

const MainLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef()


  return (
    <Flex minH="100vh" direction="column">
      <Box
        mx="auto"
        maxW={"7xl"}
        width="100%"
        bg={useColorModeValue("white", "gray.800")}
        px={4}
      >
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(({ name, to }) => (
                <NavLink key={name} to={to}>
                  {name}
                </NavLink>
              ))}
            </HStack>
            <Flex alignItems="center">
              <Image src="./images/logo.svg" alt="logo"width="80px" />
              <Heading size="md" color="purple" mt={0.2} ml={1}>
                Crypto/oferta
              </Heading>
            </Flex>
          </HStack>
          <WalletData />
        </Flex>

        {isOpen ? (
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Categorias</DrawerHeader>

          <DrawerBody>
          <Flex flexDir="column" align="center">
              {Filters.map(({ name, to }) => (
                <ul key={name}>
                  {name}
                </ul>
              ))}
            <Divider />

            <Flex  flexDir="column" align="center">
              {Links.map(({ name, to }) => (
                <NavLink key={name} to={to}>
                  {name}
                </NavLink>
              ))}
            </Flex>

            <Flex flexDir="column" align="center" >
            <div>Quieres publicar una oferta?</div>
          <Button
            background={'#67E992'}
            color={'white'}
            _hover={{

              boxShadow: 'xl',
            }}
            onClick={onOpen}>
            Crear Cupón
          </Button>
            </Flex>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
           <Text>Ayuda</Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
        ) : null}
      </Box>
      <Box mx="auto" flex={1} p={4} maxW={"7xl"} width="100%">
        {children}
      </Box>
    </Flex>
  );
};

export default MainLayout;

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
import { HamburgerIcon, CloseIcon, QuestionIcon } from "@chakra-ui/icons";
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
    name: "Cupones comprados",
    to: "/user-coupons",
  },

  {
    name: "Cupones vendidos",
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

          {/* For the categories, just to show this working, i used ul tag, but this may be replaced by a navlink */}
          <DrawerBody color={'gray.500'}>
          <Flex flexDir="column" align="left" lineHeight={10}  >
              {Filters.map(({ name, to }) => (
                <ul key={name}>
                  {name}
                </ul>
              ))}
            <Divider />

            <Flex flexDir="column" align="left">
              {Links.map(({ name, to }) => (
                <NavLink key={name} to={to}>
                  {name}
                </NavLink>
              ))}
            </Flex>

            <Flex flexDir="column" align="left" mt={10}>
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

          <DrawerFooter borderTopWidth='1px' justify={'flex-start'}>
          <Flex flexDir="row" align="center" color={'gray.500'}>
            <QuestionIcon/><Text ml='2'>Ayuda</Text>
          </Flex>
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

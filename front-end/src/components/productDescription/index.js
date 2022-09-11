import { Box, Center, Text, Heading, Stack, Image } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";
const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

const productDescription = ({name, image, newPrice, oldPrice}) => {
  return (
    <>
      <Center py={12}>
        <Box
          role={"group"}
          maxW={"330px"}
          w={"full"}
          // bg={useColorModeValue('white', 'gray.800')}
        >
          <Box
            rounded={"lg"}
            mt={-12}
            pos={"relative"}
            height={"230px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              backgroundImage: `url(${image})`,
              filter: "blur(15px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(20px)",
              },
            }}
          >
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={image}
            />
          </Box>
          <Stack pt={10} align={"left"}>
            <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
              {name}
            </Heading>
            {/* <Text
              color={"gray.500"}
              fontSize={"sm"}
              textTransform={"uppercase"}
            >
              (24 unidades)
            </Text> */}
            <Flex spacing="24px">
              <Stack direction={"column"} align={"left"}>
                <Text
                  textDecoration={"line-through"}
                  color={"red.500"}
                  fontSize="xs"
                >
                  {oldPrice}
                </Text>
                <Text fontWeight={800} fontSize={"4xl"} color={"green.300"}>
                  {newPrice}
                </Text>
              </Stack>
              <Spacer />
              <Stack direction="column" spacing={4} align="left">
                <Spacer />
                <Badge
                  ml="1"
                  fontSize="0.8em"
                  colorScheme="green"
                  px="10px"
                  py="10px"
                  borderRadius="20px"
                  justify={"end"}
                >
                  <Text fontWeight="bold" height={"20px"}>
                    52 cupones{" "}
                  </Text>
                </Badge>
              </Stack>
            </Flex>
          </Stack>
        </Box>
      </Center>
    </>
  );
};

export default productDescription;

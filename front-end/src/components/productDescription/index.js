import { Box, Center, Text, Heading, Stack, Image } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";

const productDescription = (props) => {
  const {name, image, newPrice, oldPrice} = props;
  console.log(props);
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
            </Flex>
          </Stack>
        </Box>
      </Center>
    </>
  );
};

export default productDescription;

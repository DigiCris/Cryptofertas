import { Box, Center, Text, Heading, Stack, Image } from "@chakra-ui/react";
import { Flex, Spacer, Icon } from "@chakra-ui/react";

const productDescription = (props) => {
  const { name, newPrice, oldPrice } = props;
  console.log(props);
  return (
    <>
    <Box>
      <Heading
        fontWeight={600}
        fontSize={{ base: "xl", sm: "3xl"}}
        lineHeight={1}
        color={"gray.600"}>
        {name}
      </Heading>
      <Text textDecoration={"line-through"} color={"red.500"}  fontSize={{ base: "sm", sm: "xl"}} >
        {oldPrice}
      </Text>
      <Stack direction={"row"} align="center">
        <Text fontWeight={800}
              fontSize={{ base: "2xl", sm: "4xl", lg: "4xl" }}  color={"green.300"}
              lineHeight={0.8}  >
          {newPrice}
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
      </Box>
    </>
  );
};

export default productDescription;

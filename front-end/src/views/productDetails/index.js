import ProductDescription from "../../components/productDescription";
import {
  Box,
  Center,
  Heading,
  Text
} from '@chakra-ui/react';

import { Button, ButtonGroup } from '@chakra-ui/react';

const ProductDetails = () => {
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
    <Heading fontSize="sm" color={'gray.500'} >Product Description</Heading>
    <Text color={'gray.500'}> Un delicado proceso de selección electrónica del grano garantizan más de un 90% de granos enteros, utilizados en infinidades de platos y postres,</Text>
    <Button colorScheme='teal'mt={10} w="100%">Button</Button>
    </Box>
    </Center>
    </>
  );
};

export default ProductDetails;
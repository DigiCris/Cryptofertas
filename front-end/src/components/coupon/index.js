import {
  Button,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  Grid,
  GridItem,
  Link
} from '@chakra-ui/react';

import { Link as ReachLink } from "react-router-dom"


export default function CuponImage({data}) {

  const {name, image, newPrice, oldPrice, expiration, isUsed, tokenId} = data

  return (
    <Stack borderWidth="1px" borderRadius="3%" boxShadow={'md'}>
      <Center>
      <Stack
        w={{ md: '90%', sm: '90%' }}
        h={{ md: '30%', sm: '160px' }}
        direction={{ base: ['row'], md: 'column' }}
        color={'white'}
        padding={2}
        gap={2}
        
        >  
        <Flex flex={1}>
          <Image
            objectFit="cover"
            boxSize="100%"
            borderRadius="7%"
            src={
              image
            }
            height={{md:"200px", lg:"180px"}}
          />
        </Flex>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="space-between"
          >
          <Stack width="60%">
            <Button size='xs' fontSize="16px" fontWeight="bold" rounded={'full'} backgroundColor={"red"} color='white' cursor="auto" _active={{backgroundColor:"red", color:'white', cursor: "auto"}} _hover={{backgroundColor:"red", color:'white', cursor: "auto"}}>{expiration}</Button>
          </Stack>
          <Stack>
            <Text fontWeight={600} fontSize='md' color={'black'} mb={-4} size="sm" >
              {name}
            </Text>
          </Stack>
          <Stack direction={'row'}>
            <Grid  templateColumns='repeat(2, 1fr)'  width={"100%"} >
              <GridItem height={"100%"}>
              <Stack align={'left'} spacing={-2}>
                <Text fontSize='sm' color={'red.500'} textDecoration={'line-through'}>
                  ${oldPrice}
                </Text>
                <Text fontWeight={600} fontSize='lg' color={'green.300'}>
                  ${newPrice}
                </Text>
              </Stack>
              </GridItem>
              <GridItem height={"100%"}>
               <Stack
                height={"100%"}
                width={'100%'}
                direction={'row'}
                paddingLeft={2}
                justifyContent={'right'}
                alignItems={'center'}>  
                <Button
                  flex={1}
                  fontSize={'md'}
                  rounded={'full'}
                  bg={isUsed ? "gray" : 'green.300'}
                  size='xs'
                  color={'white'}
                  _hover={{
                    bg: isUsed ? "gray" : 'green.500',
                  }}
                  _focus={{
                    bg: isUsed ? "gray" : 'green.500',
                  }}>
                    {isUsed ? <Link as={ReachLink} to={`/productDetails/${tokenId}`}>Usado</Link> : <Link as={ReachLink} to={`/productDetails/${tokenId}`}>Canjear</Link>}
                </Button> 
              </Stack>
              </GridItem>
            </Grid>     
          </Stack>
        </Stack>
      </Stack>
      </Center>
    </Stack>
  );
}
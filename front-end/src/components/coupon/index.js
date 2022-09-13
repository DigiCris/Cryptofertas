import {
  Button,
  Center,
  Badge,
  Flex,
  Image,
  Stack,
  Text,
  Grid,
  GridItem,
  Link
} from '@chakra-ui/react';

import { Link as ReachLink, useParams } from "react-router-dom"


export default function CuponImage({data}) {

  const {name, image, newPrice, oldPrice, expiration, isUsed, tokenId} = data

  const {ownerOrCreated, value} = useParams()

  const checkIfUserIsInHome = () => {
    if(typeof ownerOrCreated == "undefined" && typeof value == "undefined"){
      return true
    } else {
      return false
    }
  }

  return (
    <Stack  borderRadius="5%" boxShadow={'md'}>
      <Center>
      <Stack
        w={'80%'}
        h={{ sm: '350px', md: '360px'}}
        direction={'column' }
        color={'white'}
        padding={2}
        gap={2}
        
        >  

          <Image
            objectFit="cover"
            borderRadius="5%"
            src={
              image
            }
            w={'100%'}
            height={{base:"180px", 
            md:"200px"}}
          />

        <Stack
          flex={1}
          flexDirection="column"
          >
          <Stack width="60%">
            <Badge  w={'120px'} size='xs' fontSize="16px" fontWeight="bold" rounded={'full'} backgroundColor={"red.500"} color='white' cursor="auto" pl="4">{expiration}</Badge>
          </Stack>
          <Stack>
            <Text fontWeight={600} fontSize={{ base: "lg", md: "xl" }}color={"gray.600"} mb={-4} size="sm" noOfLines={1} >
              {name}
            </Text>
          </Stack>
          <Stack direction={'row'}>
            <Grid  templateColumns='repeat(2, 1fr)'  width={"100%"} >
              <GridItem height={"100%"}>
              <Stack align={'left'} spacing={-2}>
                <Text color={"red.500"}  fontSize={{ base: "md", sm: "xl"}} lineHeight={1.6} textDecoration={'line-through'}>
                  ${oldPrice}
                </Text>
                <Text fontWeight={800}
              fontSize={{ base: "xl", md: "2xl" }}  color={"green.300"}
              lineHeight={1.8}>
                  ${newPrice}
                </Text>
              </Stack>
              </GridItem>
              {!checkIfUserIsInHome() ?
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
                  bg={isUsed ? "gray.600" : 'green.300'}
                  size='md'
                  color={'white'}
                  _hover={{
                    bg: isUsed ? "gray.700" : 'green.500',
                  }}
                  _focus={{
                    bg: isUsed ? "gray.700" : 'green.500',
                  }}>
                    {isUsed ? <Link as={ReachLink} to={`/productDetails/${tokenId}`} _hover={{textDecoration: 'none'}}><span>Usado</span></Link> : <Link as={ReachLink} to={`/productDetails/${tokenId}`} _hover={{textDecoration: 'none'}}><span>Canjear</span></Link>}
                </Button> 
              </Stack>
              </GridItem> : null} 
            </Grid>     
          </Stack>
        </Stack>
      </Stack>
      </Center>
    </Stack>
  );
}
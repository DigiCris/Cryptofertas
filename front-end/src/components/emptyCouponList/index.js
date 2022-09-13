import React from 'react'
import {Image, Stack, Flex, Text} from '@chakra-ui/react'
import emptyListLogo from "../../assets/empty-list-logo.png"

export default function EmptyCouponList() {
  return (
    <Stack mt="10px">
      <Flex align="center" justify="center" w="100%" h="55vh" flexDirection={"column"}>
          <Image src={emptyListLogo} alt='Empty List' mb="40px" w="165px" h="179px"/>
          <Text fontSize='16px' fontWeight={400} lineHeight="25.42px" layerStyle="inter" color="gray">No tienes ningún cupón aún</Text>        
      </Flex>
    </Stack>
  )
}

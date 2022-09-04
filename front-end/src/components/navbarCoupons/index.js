import {
    Link,
    useColorModeValue,
    Grid,
    GridItem,
    Center
  } from '@chakra-ui/react';
  import {
    Link as ReachLink,
    useParams
  } from "react-router-dom";  

 
  const NAV_ITEMS_CREATED_BY_USER = [
    {
      label: 'Todos',
      href: "/user-coupons/created/all",
      id: 0
    },
    {
      label: 'Activos',
      href: '/user-coupons/created/actives',
      id: 1
    },
    {
      label: 'Usados',
      href: '/user-coupons/created/used',
      id: 2
    },
  ];

  const NAV_ITEMS_BOUGHT_BY_USER = [
    {
      label: 'Todos',
      href: "/user-coupons/owner/all",
      id: 0
    },
    {
      label: 'Activos',
      href: '/user-coupons/owner/actives',
      id: 1
    },
    {
      label: 'Usados',
      href: '/user-coupons/owner/used',
      id: 2
    },
  ];    
  
  export default function WithSubnavigation() {
    const linkHoverColor = useColorModeValue('gray.800', 'white');
  
    const {ownerOrCreated} = useParams()

    const getRightLinks = data => {
      if(data === "created") {
        return NAV_ITEMS_CREATED_BY_USER
      } else if (data === "owner") {
        return NAV_ITEMS_BOUGHT_BY_USER
      } else {
        return []
      }
    }

    return (
        <Grid templateColumns='repeat(3, 1fr)' paddingLeft={16} paddingRight={16} mb={5}>
          {getRightLinks(ownerOrCreated).map((navItem, i) => (                         
            <GridItem key={i}>
              <Center>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                as={ReachLink}
                fontSize={'sm'}
                fontWeight={500}
                to={navItem.href}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                  {navItem.label}
                </Link>
                </Center>
              </GridItem>    
          ))}
        </Grid>
      );
  }
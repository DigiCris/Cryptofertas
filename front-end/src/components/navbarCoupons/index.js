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
      label: 'Activos',
      href: '/user-coupons/created/actives',
      id: 0
    },
    {
      label: 'Usados',
      href: '/user-coupons/created/used',
      id: 1
    },
  ];

  const NAV_ITEMS_BOUGHT_BY_USER = [
    {
      label: 'Activos',
      href: '/user-coupons/owner/actives',
      id: 0
    },
    {
      label: 'Usados',
      href: '/user-coupons/owner/used',
      id: 1
    },
  ];    
  
  export default function WithSubnavigation({value}) {
    const linkHoverColor = useColorModeValue('green.400', 'white');
    const linkHoverColor2 = useColorModeValue('green.500','green.500');
  
    const {ownerOrCreated} = useParams()

    const getActiveLabel = (currentLabel) => {
      if(value === "actives" && currentLabel === "Activos") {
        return true
      } else if(value === "used" && currentLabel === "Usados") {
        return true
      }
        else {
        return false
      }
    }

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
        <Grid templateColumns='repeat(2, 1fr)' paddingLeft={16} paddingRight={16} mb={5}>
          {getRightLinks(ownerOrCreated).map((navItem, i) => (                         
            <GridItem key={i}>
              <Center>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                as={ReachLink}
                fontSize={{ base: "md" }}
                fontWeight={500}
                to={navItem.href}
                color={getActiveLabel(navItem.label) ? linkHoverColor2 : "gray.600"}
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
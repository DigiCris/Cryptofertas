import {
  Box,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Select,
  Grid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import axios from 'axios';
import useNFTFactory from '../../hooks/useNFTFactory'
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";


const ProductForm = (props) => {

  const [fileImg, setFileImg] = useState(null);
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [category, setCategory] = useState("")
  const [value, setValue] = useState('1.98')
  const [fileHash, setFileHash] = useState('1.98')
  const [numCupons, setNumCupons] = useState("")
  const [nftProvider, setNftProvider] = useState("")
  const [message, setMessage] = useState("")
  const [link, setLink] = useState("")
  const NFTFactory = useNFTFactory();
  const [minting, setMinting] = useState(false);

  const { active, activate, deactivate, account, error, library } = useWeb3React();  
  
  const hiddenFileInput = useRef(null)
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
  };
  const toast = useToast()
  const showToast = (des, status) => {
    toast({
      position: 'top',
      title: 'Creando cupón',
      description: des,
      status: status,
      duration: 5000,
      isClosable: true,
    })
  }
  const format = (val) => `$` + val
  const parse = (val) => val.replace(/^\$/, '')

  const submitForm = (e) => {

    //sendFileToIPFS(e)
    mint()
  }


  
  const mint = () => {
    setMinting(true);
    showToast('Creando cupon en Blockchain', 'info')

    NFTFactory.methods
      .mint(
        '0x15220e7317Bc0169067B93d93f54a8807E0FAfa4',
        category,
        `https://gateway.pinata.cloud/ipfs/QmaFKJThjhkkB3pSgkYkw6ztZV5fEKPHeKWVyXad5515dq`,
        value,
        300,
        numCupons
      )
      .send({
        from: account,
      })
      .on("error", () => {
        showToast('error', 'error')
        setMinting(false);
      })
      .on("transactionHash", (txHash) => {
        showToast('Transacción enviada', 'info')
      })
      .on("receipt", (receipt) => {
        setMinting(false);
        showToast('Transacción confirmada', 'success')
        //getPlatziPunksData();
        console.log(receipt);
      });
  };

  const sendJSONtoIPFS = async (ImgHash) => {

    try {

      const resJSON = await axios({

        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          "name": name,
          "description": desc,
          "image": `https://gateway.pinata.cloud/ipfs/${ImgHash}`,
          "attributes": [
            {
              "Attribute": "category",
              "value": category
            },
            {
              "Attribute": "price",
              "value": value
            },
            {
              "Attribute": "nftProvider",
              "value": props.walletAddress
            },

          ]
        },
        headers: {
          'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
          'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
        },
      });

      const tokenURI = `${resJSON.data.IpfsHash}`;
      setFileHash(tokenURI)
      console.log("Token URI", tokenURI);
      showToast('Metadata creada correctamente', 'success')
      //mint()

    } catch (error) {
      showToast('Error creando metadata', 'error')
      console.log('error JSON', error);
    }

  }

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    if (fileImg) {
      try {

        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
            //"Content-Type": "multipart/form-data"
          },
        });
        const ImgHash = resFile.data.IpfsHash;
        if (resFile.data.isDuplicate) {
          showToast('Atención Imágen duplicada', 'error')
        } else {

          sendJSONtoIPFS(ImgHash)
        }

      } catch (error) {
        showToast('Error al crear, intente nuevamente . . ', 'error')
      }
    } else {
      showToast('Debe seleccionar un archivo tipo imagen . . ', 'error')
    }
  }

  return (
    <Stack
      bg={'gray.50'}
      rounded={'xl'}
      p={{ base: 4, sm: 6, md: 8 }}
      spacing={{ base: 8 }}
      maxW={{ lg: 'lg' }}>
      <Stack spacing={4}>
        <Heading
          color={'gray.800'}
          lineHeight={1.1}
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
          Sube tu producto
          <Text
            as={'span'}
            background={'#67E992'}
            bgClip="text">
            !
          </Text>
        </Heading>
        <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
          Cuentanos sobre tu producto y crea los cupones para tus nuevos clientes
        </Text>
      </Stack>
      <Box as={'form'} mt={10}>
        <Stack spacing={4}>
          <Input
            isRequired={true}
            placeholder="Nombre del Producto"
            onChange={(e) => setName(e.target.value)}
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
          />
          <Input
            isRequired={true}
            placeholder="Descripción del Producto"
            onChange={(e) => setDesc(e.target.value)}
            bg={'gray.100'}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
          />
          <Select
            isRequired={true}
            bg={'gray.100'}
            onChange={(e) => setCategory(e.target.value)}
            border={0}
            color={'gray.500'}
            _placeholder={{
              color: 'gray.500',
            }}
            placeholder='Categoría'>
            <option value='1'>Alimentación</option>
            <option value='2'>Salud</option>
            <option value='3'>Educación</option>
          </Select>
          <Grid templateColumns='repeat(2, 1fr)' gap={5}>
            <Text align={'center'} >
              Cupones
            </Text>
            <NumberInput onChange={(e) => setNumCupons(e)} isRequired={true} step={5} defaultValue={15} min={10} max={30}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Grid>
          <Grid templateColumns='repeat(2, 1fr)' gap={5}>
            <Text align={'center'} >
              Valor de cada cupón
            </Text>
            <NumberInput
              isRequired={true}
              onChange={(valueString) => setValue(parse(valueString))}
              value={format(value)}
              max={50}
            >
              <NumberInputField />
              <NumberInputStepper>
              </NumberInputStepper>
            </NumberInput>
          </Grid>
          <Input
            isRequired={true}
            type={'file'}
            accept="image/*"
            onChange={(e) => setFileImg(e.target.files[0])}
            hidden
            ref={hiddenFileInput}
          />
          <Button
            onClick={handleClick}
            fontFamily={'heading'} bg={'gray.200'} color={'gray.800'}>
            Subir Imagen
          </Button>

        </Stack>
        <Button
          type="submit"
          onClick={submitForm}
          fontFamily={'heading'}
          mt={8}
          w={'full'}
          background={'#67E992'}
          color={'white'}
          _hover={{

            boxShadow: 'xl',
          }}>
          Subir Cupones del Producto
        </Button>
      </Box>
      form
    </Stack>

  );
};

export default ProductForm;
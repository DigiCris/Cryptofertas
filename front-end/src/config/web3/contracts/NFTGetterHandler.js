const NFTGetterHandler = {
    address: {
        4: "0xD4153221BC808243B044De17772aCc6a31f89A8c",
      },
      "abi": [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getDataOfNftsOwnedByUser",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "tokenURI",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isUsed",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "timeToExpirate",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "inSale",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTGetterHandler.dataToFrontEnd[]",
              "name": "data",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getDataOfNftsWithUserAsProvider",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "tokenURI",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isUsed",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "timeToExpirate",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "inSale",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTGetterHandler.dataToFrontEnd[]",
              "name": "data",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_tokenId",
              "type": "uint256"
            }
          ],
          "name": "getDataOfToken",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "tokenURI",
                  "type": "string"
                },
                {
                  "internalType": "bool",
                  "name": "isUsed",
                  "type": "bool"
                },
                {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "timeToExpirate",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "inSale",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTGetterHandler.dataToFrontEnd",
              "name": "data",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
}

export default NFTGetterHandler;
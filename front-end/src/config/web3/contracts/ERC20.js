const ERC20 = {
    address: {
        4: "0x304722dC9b8BeD00c9225fe312332350AB645aD2",
      },
      "abi": [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_ERC20",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_NFT",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Buy",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "CompanyBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "DaoBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "DeveloperBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "EmbasadorBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "OwnerBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ProviderBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "UserBenefit",
            "outputs": [
                {
                    "internalType": "uint32",
                    "name": "",
                    "type": "uint32"
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
            "name": "getNftOwner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
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
            "name": "getNftPrice",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
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
            "name": "getVestingTime",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "_vestingTime",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setCompanyBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setDaoBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setDeveloperBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setEmbasadorBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setOwnerBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setProviderBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint32",
                    "name": "_perThousand",
                    "type": "uint32"
                }
            ],
            "name": "setUserBenefit",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
}

export default ERC20;
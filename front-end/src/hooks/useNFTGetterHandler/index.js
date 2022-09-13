import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import NFTGetterHandler from "../../config/web3/contracts/NFTGetterHandler";

const { abi, address } = NFTGetterHandler;

const useNFTGetterHandler = () => {
    const { active, library, chainId } = useWeb3React();

    const NFTGetterHandler = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId]);
    }, [library?.eth?.Contract, active, chainId]);

    return NFTGetterHandler;
};

export default useNFTGetterHandler;
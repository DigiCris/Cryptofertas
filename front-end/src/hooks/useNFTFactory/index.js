import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import NFTFactory from "../../config/web3/contracts/NFTFactory";

const { abi, address } = NFTFactory;

const useNFTFactory = () => {
    const { active, library, chainId } = useWeb3React();

    const NFTFactory = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId]);
    }, [library?.eth?.Contract, active, chainId]);

    return NFTFactory;
};

export default useNFTFactory;
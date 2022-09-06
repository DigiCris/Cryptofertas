import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import MarketPlace from "../../config/web3/contracts/MarketPlace";

const { abi, address } = MarketPlace;

const useMarketPlace = () => {
    const { active, library, chainId } = useWeb3React();

    const MarketPlace = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId]);
    }, [library?.eth?.Contract, active, chainId]);

    return MarketPlace;
};

export default useMarketPlace;
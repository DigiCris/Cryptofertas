import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import ERC20 from "../../config/web3/contracts/ERC20";

const { abi, address } = ERC20;

const useERC20 = () => {
    const { active, library, chainId } = useWeb3React();

    const ERC20 = useMemo(() => {
        if (active) return new library.eth.Contract(abi, address[chainId]);
    }, [library?.eth?.Contract, active, chainId]);

    return ERC20;
};

export default useERC20;
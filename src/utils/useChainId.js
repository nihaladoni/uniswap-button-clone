import { useEffect, useState } from "react";

const useChainId = () => {
  const [chainId, setChainId] = useState();

  useEffect(() => {
    try {
      (async () => {
        if (window.ethereum) {
          const chainIdHex = await window.ethereum.request({
            method: "eth_chainId",
          });
          const chainId = parseInt(chainIdHex, 16);

          window.ethereum.on("chainChanged", (_chainId) => {
            window.location.reload();
          });

          setChainId(chainId);
        } else {
          console.error("Please install metamask");
        }
      })();
    } catch (error) {
      console.error("Error getting ChainID");
    }
  }, []);

  return Number(chainId);
};

export default useChainId;

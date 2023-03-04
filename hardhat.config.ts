import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = "7w-XAL16_5oFpbk2ocESvUGprVutp6Da";
const GOERLI_PRIVATE_KEY = "e204e95f6a13d068a5a6243d9448f867929cdf8635e4c1cfa479a979663b4674";


const config: HardhatUserConfig = {
  paths: { tests: "tests" },
  solidity: "0.8.17",
  etherscan: {
    apiKey: "MW74G6BQ6TFYR6XHXDU9SPMA9MHJU9MA7P",
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};

export default config;

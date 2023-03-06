import { ethers } from "ethers";
import { Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


async function main() {
    //Set provider
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
    )
    const privateKey = process.env.PRIVATE_KEY; 

    if (!privateKey || privateKey.length <= 0) {
        throw new Error('PRIVATE_KEY environment variable is not defined');
    }

    //Setup wallet with privateKey
    const wallet =  new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider); 
    const balance = await signer.getBalance();
    console.log(`The account ${signer.address} has a balance of ${balance} Wei`)

    //Deploy MyToken Contract
    const tokenBallotContractFactory = new MyToken__factory(signer);
    const contract = await tokenBallotContractFactory.deploy();
    const deployTxReceipt = await contract.deployTransaction.wait();
    console.log(
        `The ERC20Votes contract was deployed at the adddress ${contract.address} at the block number ${deployTxReceipt.blockNumber}.`
        );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
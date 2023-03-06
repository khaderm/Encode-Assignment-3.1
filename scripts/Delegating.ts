import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();


async function main() {
    const provider = new ethers.providers.AlchemyProvider(
        "goerli",
        process.env.ALCHEMY_API_KEY
    );

    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey || privateKey.length <= 0) 
        throw new Error ("Missing environment: PRIVATE_KEY");
        
    const wallet = new ethers.Wallet(privateKey, provider);
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`The account ${signer.address} has a balance of ${balance.toString()} Wei`);
        

    //Contract Address to be attached
    const address = "0x85397ac612F0761C17c2C7e1f7DFDaA7a876517B"
    const ballotContractFactory = new MyToken__factory(signer);
    console.log("Deploying ballot contract...");
    const ballotContract = ballotContractFactory.attach(address);

    
    // Replace the placeholder address with a real voter's address
    const delegateeAddress = "0xc0F8561f54C709975B9cffBF6c337Baa2F8B19e5";
    const mintTx = await ballotContract.delegate(delegateeAddress);
    console.log(`Address ${signer.address} delegated votership to address ${delegateeAddress}.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

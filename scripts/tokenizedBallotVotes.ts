import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { Ballot__factory } from "../typechain-types";
dotenv.config();


function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

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
        
    const tokeneziedBalloVotes = new Ballot__factory(signer);
    console.log("Deploying ballot contract...");

    // Replace this with the address of the deployed contract you want to vote on
    const deployedContractAddress = "0xC2D690ceb27E3d6f4CcF9a580DeBef225B09c14F";
    const ballotContractFactory = new Ballot__factory(signer);
    console.log("Deploying ballot contract...");
    const ballotContract = ballotContractFactory.attach(deployedContractAddress);

    
    // Voting 
    const Proposals = 1; // Number of Proposal to vote for 
    const amount = 1;
    console.log (Proposals);
    const votetx = await ballotContract.vote(Proposals, amount);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

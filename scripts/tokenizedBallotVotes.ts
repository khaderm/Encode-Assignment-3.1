import { ethers } from "ethers";
import * as dotenv from 'dotenv';
import { TokenizedBallot_factory } from "../typechain-types";
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
        
    const args = process.argv;
    const proposals = args.slice(2);
    if (proposals.length <= 0) throw new Error ("Missing argument: proposals");
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    const tokenizedBallotVotes = new TokenizedBallot_factory(signer);
    console.log("Deploying ballot contract...");
    const ballotContract = await TokenizedBallot_factory.deploy(
        convertStringArrayToBytes32(proposals)
    );
    console.log("Awaiting for confirmations...");
    const txReceipt = await TokenizedBallot_factory.deployTransaction.wait();
    console.log(
        `The ballot contract was deployed at address ${ballotContract.address} in the block number ${txReceipt.blockNumber}`
    );

   // Replace this with the address of the deployed contract you want to vote on
   const deployedContractAddress = "0xC2D690ceb27E3d6f4CcF9a580DeBef225B09c14F";
    
   // Replace this with the ABI of the deployed contract you want to vote on
   const deployedContractABI = [
      "[{"inputs":[{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"},{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_blockTarget","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"blockTarget","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenContract","outputs":[{"internalType":"contract IMyToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposal","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"votingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"votingPowerSpent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName","outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningProposal","outputs":[{"internalType":"uint256","name":"winningProposal_","type":"uint256"}],"stateMutability":"view","type":"function"}]"
   ];
   
   const deployedContract = new ethers.Contract(
       deployedContractAddress,
       deployedContractABI,
       signer
   );
    
    // Voting 
    const vote = 1; // Number of Proposal to vote for 
    const hasVoted = await ballotContract.hasVoted(signer.address);
    if (!hasVoted) {
        await ballotContract.connect(signer).vote(vote);
        console.log("Vote submitted!");
    } else {
        console.log("You have already voted!");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

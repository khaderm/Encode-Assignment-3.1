import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {

    //Deploy the contract
    const [deployer, account1, account2] = await ethers.getSigners();
    const contractFactory = new MyToken__factory();
    console.log(`the contractFactory variable`)
    const contract = await contractFactory.deploy();
    const deployTxReceipt = await contract.deployTransaction.wait();
    console.log(
        `The ERC20Votes contract was deployed at the adddress ${contract.address} at the block ${deployTxReceipt.blockNumber}`
        );

    //Mint the tokens
    const mintTx = await contract.mint(account1.address, MINT_VALUE);
    const mintTxReceipt = await mintTx.wait();
    console.log('The tokens were minted for the account of address ${');


    //Check the voting power
    let account1Balance = await contract.balanceOf(account1.address);
    console.log(
        `The balance of account of address ${ethers.utils.formatEther(account1Balance)} tokens`
        );

    let account1VotePower = await contract.getVotes(account1.address);
    console.log(
        `The vote power of the account of address ${account1.address} is ${ethers.utils.formatEther(account1VotePower)} units`
        );

    //Self Delegate
    const delegateTx = await contract.connect(account1).delegate(account1.address);
    const delegateTxReceipt = await delegateTx.wait();
    console.log(`The tokens were delgated for account1 at the block ${delegateTxReceipt.blockNumber}`);

    //check voting power post Self Delegate
    account1VotePower = await contract.getVotes(account1.address);
    console.log(
        `The vote power of the account of address ${account1.address} is ${ethers.utils.formatEther(account1VotePower)} units`
        );

    //Self Transfer
    const transferTx = await contract.connect(account1).delegate(account2.address);
    const transferTxReceipt = await transferTx.wait();
    console.log(`The tokens were delgated for account1 at the block ${transferTxReceipt.blockNumber}`);
    //check voting power post Self Delegate
    account1VotePower = await contract.getVotes(account1.address);
    console.log(
        `The vote power of the account of address ${account1.address} is ${ethers.utils.formatEther(account1VotePower)} units`
        );
    const account2VotePower = await contract.getVotes(account2.address);
    console.log(
        `The vote power of the account of address ${account2.address} is ${ethers.utils.formatEther(account2VotePower)} units`
        );

    //Voting

    //Historic voting power
    const currentBlock =  await ethers.provider.getBlock("latest");
    console.log(`We are currently at the block ${currentBlock.number}`);
    for (let index = 1; index <= currentBlock.number; index++) {
        account1VotePower = await contract.getPastVotes(
            account1.address,
            currentBlock.number - index
            );
            console.log(
              `The vote power of the account 1 was ${ethers.utils.formatEther(
                account1VotePower
              )} units at block ${currentBlock.number - index}`
            );
        };

};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

//   for (let index = 1; index <= currentBlock.number; index++) {
//     account1VotePower = await contract.getPastVotes(
//       account1.address,
//       currentBlock.number - index
//     );
//     console.log(
//       `The vote power of the account 1 was ${ethers.utils.formatEther(
//         account1VotePower
//       )} units at block ${currentBlock.number - index}`
//     );
//   }
//   const transferTx = await contract
//     .connect(account1)
//     .transfer(account2.address, MINT_VALUE.div(2));
//   const transferTxReceipt = await transferTx.wait();
//   console.log(
//     `The tokens were transferred from the account 1 to account 2 at the block ${transferTxReceipt.blockNumber}`
//   );
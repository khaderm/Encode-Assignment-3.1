import { expect } from "chai";
import { ethers } from "hardhat";
import { MyToken, MyToken__factory, TokenSale, TokenSale__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

const TEST_TOKEN_RATIO = 1;
const TEST_TOKEN_MINT = ethers.utils.parseEther("1");


describe("NFT Shop", async () => {
    let tokenSaleContract: TokenSale;
    let tokenContract: MyToken;
    let deployer: SignerWithAddress;
    let account1: SignerWithAddress;
    let account2: SignerWithAddress;
    
    beforeEach(async () => {
      [deployer, account1, account2] = await ethers.getSigners();
      
      const tokenContractFactory = new MyToken__factory(deployer);
      tokenContract = await tokenContractFactory.deploy();
      await tokenContract.deployTransaction.wait();
      
      const tokenSaleContractFactory = new TokenSale__factory(deployer);
      tokenSaleContract = await tokenSaleContractFactory.deploy(
        TEST_TOKEN_RATIO, 
        tokenContract.address);
      await tokenSaleContract.deployTransaction.wait();

      const giveMinterRoleTx = await tokenContract.grantRole("", tokenContract.address);

      await giveMinterRoleTx.wait()
    });
    
    describe("When the Shop contract is deployed", async () => {
      it("defines the ratio as provided in parameters", async () => {
        const ratio = await tokenSaleContract.ratio();
        expect(ratio).to.eq(TEST_TOKEN_RATIO);
      });
      
      it("uses a valid ERC20 as payment token", async () => {
        const tokenAddress = await tokenSaleContract.tokenContract();
        const tokenSaleContractFactory = new MyToken__factory(deployer);
        const tokenContractFactoryFromAddress = tokenSaleContractFactory.attach(tokenAddress);
        await expect(tokenContractFactoryFromAddress.totalSupply()).to.not.be.reverted;
        await expect(tokenContractFactoryFromAddress.decimals()).to.not.be.reverted;
        await expect(tokenContractFactoryFromAddress.balanceOf(deployer.address)).to.not.be.reverted;
        await expect(tokenContractFactoryFromAddress.transfer(account1.address, 10)).to.be.revertedWith("ERC20: transfer account exceeds balance");
      });
    });
    
    describe("When a user buys an ERC20 from the Token contract", async () => {
      let tokenBalanceBeforeMint: BigNumber;
      let ethBalanceBeforeMint: BigNumber;
      beforeEach(async () => {
        tokenBalanceBeforeMint = await tokenContract.balanceOf(account1.address);
        ethBalanceBeforeMint = await account1.getBalance();
        const mintTX = await tokenSaleContract.connect(account1).buyTokens({
          value: TEST_TOKEN_MINT,
        })
        await mintTX.wait();
      });
      
      it("charges the correct amount of ETH", async () => {
        const etheBalanceAfterMint = await account1.getBalance();
        expect(ethBalanceBeforeMint.sub(etheBalanceAfterMint)).to.eq(
          TEST_TOKEN_MINT
        );

      throw new Error("Not implemented");
    });

    it("gives the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the public pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
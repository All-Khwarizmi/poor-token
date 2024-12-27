import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("PoorToken", function () {
  async function deployPoorTokenFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const PoorToken = await hre.ethers.getContractFactory("Poor");
    const poor = await PoorToken.deploy();

    const FEE = ethers.parseEther("0.01");

    const supply = BigInt(1000000000000000000000000n).toString();

    return { poor, owner, otherAccount, FEE, supply };
  }
  async function mintTokenFixture(value: number) {
    const { poor, owner, otherAccount } = await loadFixture(
      deployPoorTokenFixture
    );

    for (let i = 0; i < value; i++) {
      await poor.mint({ value: ethers.parseEther("0.01") });
    }

    return { poor, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy PoorToken", async function () {
      const { poor } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.INITIAL_SUPPLY()).to.greaterThan(0);
    });
  });

  describe("Should have the correct state", function () {
    it("Should have the correct `name`", async function () {
      const { poor } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.name()).to.equal("PoorToken");
    });

    it("Should have the correct `symbol`", async function () {
      const { poor } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.symbol()).to.equal("POOR");
    });

    it("Should have the correct `decimals`", async function () {
      const { poor } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.decimals()).to.equal(18);
    });

    it("Should have the correct `totalSupply`", async function () {
      const { poor, supply } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.totalSupply()).to.equal(supply);
    });

    it("Should have the correct `INITIAL_SUPPLY`", async function () {
      const { poor, supply } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.INITIAL_SUPPLY()).to.equal(supply);
    });
  });

  describe("Minting", function () {
    it("Should mint PoorToken", async function () {
      const { poor, owner } = await loadFixture(deployPoorTokenFixture);

      expect(await poor.balanceOf(owner.address)).to.equal(0);

      await poor.mint({ value: ethers.parseEther("0.01") });

      expect(await poor.balanceOf(owner.address)).to.equal(1);
    });

    describe("Mint fixture", () => {
      it("Should credit `owner` address with given amount of `Tokens`", async () => {
        const AMOUNT = 5;

        const { poor, owner } = await mintTokenFixture(AMOUNT);

        expect(await poor.balanceOf(owner.address)).to.equal(AMOUNT);
      });
    });
  });

  describe("Allowance mechanism", function () {
    describe("Allowance", function () {
      it("Should return the correct allowance amount", async function () {
        const AMOUNT = 4;
        const { poor, owner, otherAccount } = await mintTokenFixture(AMOUNT);

        expect(
          await poor.allowance(owner.address, otherAccount.address)
        ).to.equal(0);

        await poor.approve(otherAccount, AMOUNT);

        expect(
          await poor.allowance(owner.address, otherAccount.address)
        ).to.equal(AMOUNT);

        const newPoor = poor.connect(otherAccount);

        await newPoor.transferFrom(owner, otherAccount, AMOUNT / 2);

        expect(await newPoor.allowance(owner, otherAccount)).to.equal(
          AMOUNT / 2
        );
      });
    });

    describe("Approve", async () => {
      it("Should fire the `Approval` event", async () => {
        const { poor, owner, otherAccount } = await loadFixture(
          deployPoorTokenFixture
        );
        const AMOUNT = 3;
        await poor.approve(otherAccount, AMOUNT);

        await expect(poor.approve(otherAccount, AMOUNT))
          .to.emit(poor, "Approval")
          .withArgs(owner, otherAccount, AMOUNT);
      });

      it("Should override whit the value if called multiple times", async () => {
        const { poor, owner, otherAccount } = await loadFixture(
          deployPoorTokenFixture
        );
        const AMOUNT = 3;
        await poor.approve(otherAccount, AMOUNT);
        await poor.approve(otherAccount, AMOUNT * 2);

        expect(await poor.allowance(owner, otherAccount)).to.equal(AMOUNT * 2);
      });

      it("Should allow for multiple withdraw up to the `value`", () => {});
    });
  });

  describe("Transfer", () => {
    it("Should fire the `Transfer` event", async () => {
      const { poor, owner, otherAccount } = await mintTokenFixture(5);

      const AMOUNT = 3;
      await poor.approve(otherAccount, AMOUNT);

      await expect(poor.transfer(otherAccount, AMOUNT)).to.emit(
        poor,
        "Transfer"
      );
    });

    it("Should throw if the value is greater than the sender balance", async () => {
      const { poor, otherAccount } = await loadFixture(deployPoorTokenFixture);

      await expect(
        poor.transfer(otherAccount, 3)
      ).to.be.revertedWithCustomError(
        {
          interface: poor.interface,
        },
        "NotEnoughValue"
      );
    });

    it("Should transfer the given value to the given address", async () => {
      const AMOUNT = 2;
      const { poor, owner, otherAccount } = await mintTokenFixture(AMOUNT);

      await poor.transfer(otherAccount, AMOUNT - 1);

      expect(await poor.balanceOf(owner)).to.equal(1);
      expect(await poor.balanceOf(otherAccount)).to.equal(1);

      await poor.transfer(otherAccount, AMOUNT - 1);

      expect(await poor.balanceOf(owner)).to.equal(0);
      expect(await poor.balanceOf(otherAccount)).to.equal(AMOUNT);

      await expect(
        poor.transfer(otherAccount, 1)
      ).to.be.revertedWithCustomError(
        {
          interface: poor.interface,
        },
        "NotEnoughValue"
      );
    });
  });
  describe("Transfer from", () => {
    it("Should fire the `Transfer` event", async () => {
      const { poor, owner, otherAccount } = await mintTokenFixture(5);

      const AMOUNT = 3;
      await poor.approve(otherAccount, AMOUNT);

      await expect(poor.transferFrom(owner, otherAccount, AMOUNT)).to.emit(
        poor,
        "Transfer"
      );
    });
    it("Should throw if the `from` address has NOT authorized the msg sender OR the msg sender is NOT authorized to withdraw this amount", async () => {
      const AMOUNT = 3;
      const { poor, owner, otherAccount } = await mintTokenFixture(AMOUNT);

      await expect(
        poor.transferFrom(otherAccount, owner, AMOUNT)
      ).to.be.revertedWithCustomError(
        {
          interface: poor.interface,
        },
        "NotAuthorized"
      );

      poor.approve(otherAccount, AMOUNT);

      await expect(
        poor.transferFrom(owner, otherAccount, AMOUNT * 2)
      ).to.be.revertedWithCustomError(
        {
          interface: poor.interface,
        },
        "NotEnoughValue"
      );
    });
    it("Should transfer the `value` from the `from` address to the `to` address", async () => {
      const AMOUNT = 20;
      const AUTHORIZED_AMOUNT = 10;
      const { poor, owner, otherAccount } = await mintTokenFixture(AMOUNT);

      await poor.transferFrom(owner, otherAccount, AMOUNT / 4);

      expect(await poor.balanceOf(owner)).to.equal(15);
      expect(await poor.balanceOf(otherAccount)).to.equal(AMOUNT / 4);

      // Test the other branch: when the sender is an approved address and
      // First: should throw since we have not authorized the owner account to withdraw from the otherAccount
      await expect(poor.transferFrom(otherAccount, owner, AMOUNT / 2))
        .to.be.revertedWithCustomError(
          {
            interface: poor.interface,
          },
          "NotAuthorized"
        )
        .withArgs(owner);

      // Approve the other account and connect to the same contract with the otherAccount
      await poor.approve(otherAccount, AUTHORIZED_AMOUNT);

      const newPoor = poor.connect(otherAccount);

      // Transferring the last value from the owner as the other account
      await newPoor.transferFrom(owner, otherAccount, AMOUNT / 2);

      expect(await newPoor.balanceOf(owner)).to.equal(5);
      expect(await newPoor.balanceOf(otherAccount)).to.equal(15);

      await expect(newPoor.transferFrom(owner, otherAccount, 2))
        .to.be.revertedWithCustomError(
          {
            interface: newPoor.interface,
          },
          "NotAuthorized"
        )
        .withArgs(otherAccount);
    });
  });
});

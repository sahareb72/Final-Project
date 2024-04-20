describe("CrossBorderPayment", function () {
  let Contract;
  let paymentContract;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    Contract = await ethers.getContractFactory("CrossBorderPayment");
    [owner, user1, user2] = await ethers.getSigners();
    paymentContract = await Contract.deploy();
  });

  describe("Deposits and Balances", function () {
    it("should accept deposits", async function () {
      const depositAmount = ethers.utils.parseEther("1.0");
      await paymentContract.connect(user1).deposit({ value: depositAmount });
      const balance = await paymentContract.balances(user1.address);
      expect(balance.toString()).to.equal(depositAmount.toString());
    });
  });

  // Additional tests...
});

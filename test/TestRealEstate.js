const RealEstate = artifacts.require("./RealEstate.sol");

contract('RealEstate', (accounts) => {
    let realEstateInstance;

    it("컨트랙트 소유자 주소 테스트", ()=>{
        return RealEstate.deployed().then((instance)=>{
            realEstateInstance = instance;
            return realEstateInstance.owner.call();
        }).then((owner)=>{
            assert.equal(owner.toUpperCase(), accounts[0].toUpperCase(), "컨트랙트 주소와 가니슈 1번 주소가 다릅니다.")
        })
    });
    it("1번 계정에서 0번 계정의 매물 구입 테스트", ()=>{
        return RealEstate.deployed().then((instance) => {
            realEstateInstance = instance;
            return realEstateInstance.buyRealEstate(0,"PSI",30,{from:web3.eth.accounts[1],value:web3.toWei(1.50,"ether")});
        }).then((recipt)=>{
            assert.equal(recipt.logs.length,1,"트랜잭션이 이뤄지지 않았습니다.");
            assert.equal(recipt.logs[0].event,'logBuyRealEstate',"logBuyRealEstate이벤트가 아닙니다.");
            assert.equal(recipt.logs[0].args._buyer, accounts[1], "1번계정의 매입자가 아닙니다.");
            assert.equal(recipt.logs[0].args._id, 0, "0번계정의 매물이 아닙니다.");
            return realEstateInstance.getBuyerInfo(0);
        }).then((buyerInfo)=>{
            assert.equal(buyerInfo[0].toUpperCase(), accounts[1].toUpperCase(), "구매자가 1번 계정이 아닙니다.");
            assert.equal(web3.toAscii(buyerInfo[1]).replace(/\0/g, ''), "PSI", "구매자가 PSI가 아닙니다."); 
            assert.equal(buyerInfo[2], 30, "30세가 아닙니다.");
            return realEstateInstance.getAllBuyer();  
        }).then((buyer)=>{
            assert.equal(buyer[0].toUpperCase(), accounts[1].toUpperCase(), "1번 계정의 구매가 아닙니다.");          
        });
    });
})
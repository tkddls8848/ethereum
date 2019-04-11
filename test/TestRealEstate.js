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
    })
})
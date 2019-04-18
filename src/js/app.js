App = {
  web3Provider: null,
  contracts: {},
	
  init : () => {
   $.getJSON('../real-estate.json',(data) => {
    let list = $('#list');
    let template = $('#template');

    for(let i = 0 ; i < data.length ; i++ ){
      template.find('img').attr('src', data[i].picture);
      template.find('.id').text(data[i].id);
      template.find('.type').text(data[i].type);
      template.find('.area').text(data[i].area);
      template.find('.price').text(data[i].price);

      list.append(template.html());
    }
   })
   return App.initWeb3();
  },

  initWeb3 : () => {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);      
    }
    return App.initContract();
  },

  initContract : () => {
    $.getJSON('RealEstate.json',(data) => {
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
      return App.loadRealEstates();
      })
  },

  buyRealEstate : () => {	
    let id = $('#id').val();
    let price = $('#price').val();
    let name = $('#name').val();
    let age = $('#age').val();

    web3.eth.getAccounts((err, accounts) =>{
      if(err){
        console.log(err);
      }
      let account = accounts[0];
      App.contracts.RealEstate.deployed().then((instance)=>{
        let nameUtf8Encoded = utf8.encode(name);
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), age, {from : account, value : price});
      }).then(() => {
        $('#name').val('');
        $('#age').val('');
        $('#buyModal').modal('hide');
        return App.loadRealEstates();
      }).catch((err) => {
        console.log(err.message);
      })
    })
  },

  loadRealEstates : () => {
    App.contracts.RealEstate.deployed().then((instance)=>{
      return instance.getAllBuyer.call();
    }).then((buyers) => {
      for(let i = 0 ; i < buyers.length ; i++){
        if(buyers[i] !== '0x0000000000000000000000000000000000000000'){
          const imgType = $('.panel-realEstate').eq(i).find('img').attr('src').substr(7);

          switch(imgType){
            case 'apartment.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/apartment_sold.jpg');
              break;
            case 'townhouse.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/townhouse_sold.jpg');
              break;
            case 'house.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/house_sold.jpg');
              break;
          }

          $('.panel-realEstate').eq(i).find('.btn-buy').text('매각').attr('disabled', true);
          $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style');
        }
      }
    }).catch((err) => {
      console.log(err.message);
    })
  },
	
  listenToEvents : function() {
	
  }
};

$(() => {
  $(window).load(() => {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', (e) => {
    let id = $(e.relatedTarget).parent().find('.id').text();
    let price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  });

  $('#buyerInfoModal').on('show.bs.modal', (e) => {
    let id = $(e.relatedTarget).parent().find('.id').text();

    App.contracts.RealEstate.deployed().then((instance) => {
      return instance.getBuyerInfo.call(id);
    }).then((buyerInfo) => {
      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]);
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1]));
      $(e.currentTarget).find('#buyerAge').text(buyerInfo[2]);
    }).catch((err) => {
      console.log(err.message);
    })
  });
});

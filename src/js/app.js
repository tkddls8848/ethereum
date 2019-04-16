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
      }).catch((err) => {
        console.log(err.message);
      })
    })
  },

  loadRealEstates : function() {
	
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
});

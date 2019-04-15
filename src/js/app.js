App = {
  web3Provider: null,
  contracts: {},
	
  init: function() {
   $.getJSON('../real-estate.json',(data) => {
    let list = $('#list');
    let template = $('#template');

    for(let i = 0 ; i < data.length ; i++ ){
      template.find('img').attr('src', data[i].picture);
      template.find('id').attr('src', data[i].id);
      template.find('type').attr('src', data[i].type);
      template.find('area').attr('src', data[i].area);
      template.find('price').attr('src', data[i].price);

      list.append(template.html());
    }
   })
   return App.initWeb3();
  },

  initWeb3: function() {
    if(web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);      
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('RealEstate.json',(data) => {
      App.contracts.RealEstate = TruffleContractor(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
      })
  },

  buyRealEstate: function() {	

  },

  loadRealEstates: function() {
	
  },
	
  listenToEvents: function() {
	
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

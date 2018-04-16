// before ipfs daemon startup, Should ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
// before geth daemon startup, geth --dev --rpc --rpccorsdomain "*"'

App = {
  ipfs: {},
  contract: {},

  init: function () {
    App.initIpfs();
    App.initContract('0xb9e9dfa2fd06544b7af3e7908ec69f57e3c3fb5b');
    return App.bindEvents();
  },

  initIpfs: function() {
    App.ipfs = window.IpfsApi('localhost', '5001');    
  },

  initContract: function (address) {
    var web3 = new Web3();
    $.getJSON('Ipfs.json', function (aritifact) { 
      web3.setProvider((new Web3.providers.HttpProvider('http://localhost:8545')));
      web3.eth.defaultAccount = web3.eth.coinbase;
      App.contract = web3.eth.contract(aritifact.abi).at(address);
      console.log(App.contract.getLength());
      for (var i = 0; i < App.contract.getLength(); i++) {
        info = App.contract.getUploadFileInfo(i);
        console.log(info);
        App.insertTemplate(info[0], info[1]);
      } 
    });
  },

  bindEvents: function () {
    $('#target').submit(App.handleSubmit);
  },

  handleSubmit: function (event) {
    event.preventDefault();
    const file = event.target[0].files[0];
    const reader = new window.FileReader();
    reader.onloadend = () => App.saveIpfs(reader, file.name);
    reader.readAsArrayBuffer(file);
  },

  saveIpfs: function (reader, filename) {
    const buf = buffer.Buffer(reader.result)
    App.ipfs.files.add(buf, (err, result) => {
      if(err) {
        console.error(err);
        return;
      }
      const hash = result[0].hash;
      const url = `https://ipfs.io/ipfs/${hash}`;
      App.contract.setUploadFileInfo(filename, hash, { gas: 500000});
      console.log(url);
    })
  },

  insertTemplate: function (name, hash) {
    var body = '';
    body += '<tr>';
    body += `<td>${name}</td>`    
    body += `<td>https://ipfs.io/ipfs/${hash}</td>`    
    body += '</tr>'
    $('tbody').prepend(body);
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

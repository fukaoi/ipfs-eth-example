// [need to]ipfs daemon startup, Should ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
// [need to]geth daemon startup, geth --dev --rpc --rpccorsdomain "*"'

App = {
  ipfs: {},
  contract: {},
  web3: {},

  init: () => {
    App.initIpfs();
    App.initWeb3();
    App.initContract('0x02c4fbdef5be7d1e96a70ed3ad3dffbe6964175a');
    return App.bindEvents();
  },

  initIpfs: () => {
    App.ipfs = window.IpfsApi('localhost', '5001');    
  },

  initWeb3: () => {
    App.web3 = new Web3();
    App.web3.setProvider((new Web3.providers.HttpProvider('http://localhost:8545')));    
  },

  initContract: (address) => {
    $.getJSON('Ipfs.json', (aritifact) => { 
      App.contract = App.web3.eth.contract(aritifact.abi).at(address);
      for (var i = 0; i < App.contract.getLength(); i++) {
        info = App.contract.getUploadFileInfo(i);
        App.setTemplate(info[0], info[1]);
      } 
    });
  },

  bindEvents: () => {
    $('#target').submit(App.handleSubmit);
  },

  handleSubmit: (event) => {
    event.preventDefault();
    const file = event.target[0].files[0];
    const reader = new window.FileReader();
    reader.onloadend = () => App.saveIpfs(reader, file.name);
    reader.readAsArrayBuffer(file);
  },

  saveIpfs: (reader, filename) => {
    const buf = buffer.Buffer(reader.result)
    App.ipfs.files.add(buf, (err, result) => {
      if(err) {
        console.error(err);
        return;
      }
      const hash = result[0].hash;
      const url = `https://ipfs.io/ipfs/${hash}`;
      App.contract.setUploadFileInfo(filename, hash, { gas: 500000, from: App.web3.eth.coinbase });
      $('#success-alert').show();
      $('#success-message').text(url);

    })
  },

  setTemplate: (name, hash) => {
    var body = '';
    body += '<tr>';
    body += `<td>${name}</td>`    
    body += `<td>https://ipfs.io/ipfs/${hash}</td>`    
    body += '</tr>'
    $('tbody').prepend(body);
  }
};

$(() => {
  $(window).load(() => {
    App.init();
  });
});

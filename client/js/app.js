document
  .getElementById('file-input')
  .addEventListener('change', leerArchivo, false);

let contenido;

async function leerArchivo(e) {
  let archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  let lector = new FileReader();
  lector.onload = function (e) {
    console.log(`RobinDev - e`, e);
    contenido = md5(e.target.result);
  };
  lector.readAsText(archivo);
}

App = {
  contracts: {},
  web3Provider: '',

  init: async () => {
    console.log('Loaded');
    await App.loadEthereum();
    await App.loadAccount();
    await App.loadContracts();
  },

  loadEthereum: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      console.log('Ethereum existe');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn('No ethereum browser is installed. Try it install metamask');
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    App.account = accounts[0];
  },

  loadContracts: async () => {
    // Se trae el JSON del contrato desplegado
    const res = await fetch('FileContract.json');
    const fileContractJSON = await res.json();

    // Se convierte el JSON
    App.contracts.fileContract = await TruffleContract(fileContractJSON);

    // Se conecta el contrato a MetaMask
    App.contracts.fileContract.setProvider(App.web3Provider);

    // Se conecta y utiliza el contrato desplegado
    App.fileContract = await App.contracts.fileContract.deployed();
  },
};

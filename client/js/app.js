App = {
  contracts: {},
  web3Provider: '',

  init: async () => {
    console.log('Loaded');
    await App.loadEthereum();
    await App.loadAccount();
    await App.loadContracts();
    await App.renderDocs();
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

  renderDocs: async () => {
    const counter = await App.fileContract.docCounter();
    const docCounter = counter.toNumber();

    let html = '';

    for (let i = 1; i <= docCounter; i++) {
      const doc = await App.fileContract.forDoc(i);
      const docId = doc['id'];
      const docTitle = doc['DocName'];
      const docDesc = doc['DocDesc'];
      const docOwner = doc['DocOwner'];
      const docDate = doc['createdAt'];
      const docGroup = doc['group'];

      let docElement = `
      <tr>
        <th scope="row">${docId}</th>
        <td>${docTitle}</td>
        <td>${docDesc}</td>
        <td>Certificados</td>
        <td>${new Date(docDate * 1000).toLocaleString()}</td>
        <td>${docOwner}</td>
        <td>${docGroup}</td>
      </tr>
      `;

      html += docElement;
    }
    document.querySelector('#documents').innerHTML = html;
  },

  getDocument: async (hash) => {
    const docExist = await App.fileContract.getDocument(hash, {
      from: App.account,
    });
    const docTx = docExist.receipt;
    const docLog = docExist.logs[0].args;
    if (docExist) {
      alert(
        `El documento esta certificado por BlockChain 
        \n Titulo: ${docLog['DocName']}
        \n Decripcion: ${docLog['DocDesc']}
        \n Fecha de Carga: ${new Date(
          docLog['createdAt'] * 1000
        ).toLocaleString()}
        \n Dueño: ${docLog['DocOwner']}
        \n Grupo: ${docLog['group']}
        `
      );
    }
  },

  addDocument: async (hash, title, desc, group) => {
    await App.fileContract.addDocument(hash, title, desc, group, {
      from: App.account,
    });
  },
};

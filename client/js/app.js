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
    try {
      const docExist = await App.fileContract.getDocument(hash, {
        from: App.account,
        gasLimit: 3000000,
      });
      const docTx = docExist.receipt;
      const docLog = docExist.logs[0].args;
      if (docExist) {
        iziToast.success({
          class: 'alert-success',
          close: true,
          layout: 2,
          maxWidth: 500,
          message: `
          <strong>Titulo:</strong> ${docLog['DocName']}
          <br><strong>Decripcion:</strong> ${docLog['DocDesc']}
          <br><strong>Fecha de Carga:</strong> ${new Date(
            docLog['createdAt'] * 1000
          ).toLocaleString()}
          <br><strong>Dueño:</strong> ${docLog['DocOwner']}
          <br><strong>Grupo:</strong> ${docLog['group']}
          `,
          messageColor: '#000000',
          messageSize: '14px',
          position: 'topCenter',
          title: 'EL CERTIFICADO ES CORRECTO SEGÚN BLOCKCHAIN',
          titleColor: '#25C554',
          titleSize: '16px',
          timeout: null,
          progressBar: false,
        });
      }
    } catch (error) {
      iziToast.error({
        backgroundColor: '#F0E5E5',
        class: 'alert-error',
        close: true,
        layout: 2,
        maxWidth: 500,
        message: 'Tu contrato no es valido',
        messageColor: '#000000',
        messageSize: '14px',
        position: 'topCenter',
        title: 'EL CERTIFICADO ES INVALIDO',
        titleColor: '#E21414',
        titleSize: '16px',
        timeout: null,
        progressBar: false,
      });
    }
  },

  addDocument: async (hash, title, desc, group) => {
    try {
      const DocUpload = await App.fileContract.addDocument(
        hash,
        title,
        desc,
        group,
        {
          from: App.account,
        }
      );
      const docLog = DocUpload.logs[0].args;
      if (DocUpload) {
        iziToast.success({
          class: 'alert-success',
          close: true,
          layout: 2,
          maxWidth: 500,
          message: `
          <strong>Titulo:</strong> ${docLog['DocName']}
          <br><strong>Decripcion:</strong> ${docLog['DocDesc']}
          <br><strong>Fecha de Carga:</strong> ${new Date(
            docLog['createdAt'] * 1000
          ).toLocaleString()}
          <br><strong>Dueño:</strong> ${docLog['DocOwner']}
          <br><strong>Grupo:</strong> ${docLog['group']}
          `,
          messageColor: '#000000',
          messageSize: '14px',
          onClosing: function () {
            window.location.reload();
          },
          progressBar: false,
          position: 'topCenter',
          title: 'TU ARCHIVO SE HA CARGADO CORRECTAMENTE EN LA BLOCKCHAIN',
          titleColor: '#25C554',
          titleSize: '16px',
          timeout: null,
        });
      }
      return {
        update: true,
        DocOwner: docLog['DocOwner'],
      };
    } catch (error) {
      iziToast.error({
        backgroundColor: '#F0E5E5',
        class: 'alert-error',
        close: true,
        layout: 2,
        maxWidth: 500,
        position: 'topCenter',
        progressBar: false,
        timeout: null,
        title: 'TU ARCHIVO NO SE PUDO CARGAR A LA BLOCKCHAIN',
        titleColor: '#E21414',
        titleSize: '16px',
      });
      return false;
    }
  },
};

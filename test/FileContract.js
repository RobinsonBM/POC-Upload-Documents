const FileContract = artifacts.require('FileContract');

contract('FileContract', () => {
  before(async () => {
    this.fileContract = await FileContract.deployed();
  });

  it('Deployed succesfully', async () => {
    const address = this.fileContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
  });

  it('addDocument', async () => {
    const result = await this.fileContract.addDocument(
      '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
      'Doc1',
      'Desc1',
      'group'
    );
    const doc = result.logs[0].args;
    const counter = await this.fileContract.docCounter();

    assert.equal(counter, 1);
    assert.equal(doc.hashFTP, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4');
    assert.typeOf(doc.id.toNumber(), 'number');
    assert.notEqual(doc.DocName, '');
    assert.notEqual(doc.DocDesc, '');
    assert.notEqual(doc.DocOwner, '');
    assert.notEqual(doc.createdAt, '');
  });

  it('getDocument', async () => {
    const result = await this.fileContract.getDocument(
      '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
    );
    const doc = result.logs[0].args;

    assert.equal(doc.hashFTP, '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4');
    assert.equal(doc.isCreated, true);
  });
});

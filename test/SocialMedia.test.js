const SocialMedia = artifacts.require("./SocialMedia.sol");

require('chai')
    .use(require('chai-as-promised'))
        .should();

contract('SocialMedia', ([deployer, author, tipper]) => {
    let socialMedia;

    before(async () => {
        socialMedia = await SocialMedia.deployed();
    });

    describe('Deployment', async () => {
        it('deployed successfully', async () => {
            let address = await socialMedia.address;

            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async () => {
            let name = await socialMedia.name();

            assert.equal(name, 'Ethereum Social Media');
        });
    });

    describe('Image', async () => {
        let result, imageCount, hash;

        before(async () => {
            hash = 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB';
            result = await socialMedia.uploadImage(hash, 'The inventor of Ethereum', { from: author });
            imageCount = await socialMedia.imageCount();
        });

        it('uploads image', async () => {
            // SUCCESS
            assert.equal(imageCount, 1);

            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct');
            assert.equal(event.hash, hash, 'hash is correct');
            assert.equal(event.description, 'The inventor of Ethereum', 'description is correct');
            assert.equal(event.tipAmount.toNumber(), '0', 'tip amount is correct');
            assert.equal(event.author, author, 'author is correct');

            await socialMedia.uploadImage('', 'The inventor of Ethereum', { from: author }).should.be.rejected;
            await socialMedia.uploadImage(hash, '', { from: author }).should.be.rejected;
        });

        it('list images', async () => {
            const image = await socialMedia.images(imageCount);
            assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct');
            assert.equal(image.hash, hash, 'hash is correct');
            assert.equal(image.description, 'The inventor of Ethereum', 'description is correct');
            assert.equal(image.tipAmount.toNumber(), '0', 'tip amount is correct');
            assert.equal(image.author, author, 'author is correct');
        });

        it('tip images', async () => {
            let oldAuthorBalance;
            oldAuthorBalance = await web3.eth.getBalance(author);
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
      
            result = await socialMedia.tipImageAuthor(imageCount, { from: tipper, value: web3.utils.toWei('0.5', 'Ether') });
      
            // SUCCESS
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct');
            assert.equal(event.hash, hash, 'hash is correct')
            assert.equal(event.description, 'The inventor of Ethereum', 'description is correct');
            assert.equal(event.tipAmount, '500000000000000000', 'tip amount is correct');
            assert.equal(event.author, author, 'author is correct');
      
            let newAuthorBalance;
            newAuthorBalance = await web3.eth.getBalance(author);
            newAuthorBalance = new web3.utils.BN(newAuthorBalance);
      
            let tipAmount;
            tipAmount = web3.utils.toWei('0.5', 'Ether');
            tipAmount = new web3.utils.BN(tipAmount);
      
            const expectedBalance = oldAuthorBalance.add(tipAmount)
      
            assert.equal(newAuthorBalance.toString(), expectedBalance.toString(), 'author was correctly tipped')
      
            // FAILURE: Tries to tip a image that does not exist
            await socialMedia.tipImageAuthor(99, { from: tipper, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
          })
    });
});
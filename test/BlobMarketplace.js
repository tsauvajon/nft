const BlobMarketplace = artifacts.require("BlobMarketplace");
const utils = require("./helpers/utils");
const time = require("./helpers/time");
const blobNames = ["Blob 1", "Blob 2"];

contract("BlobMarketplace", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await BlobMarketplace.new();
    })

    it("lists a blob for sale", async () => {
        const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        const blobId = result.logs[0].args.blobId.toNumber()

        let blobsOnSale = await contractInstance.getBlobsForSale()
        assert.strictEqual(blobsOnSale.length, 0)

        const price = 12345;
        await contractInstance.listBlobForSale(blobId, price);

        // There's one blob on sale
        blobsOnSale = await contractInstance.getBlobsForSale()
        assert.strictEqual(blobsOnSale.length, 1)
        assert.strictEqual(blobsOnSale[0].toNumber(), blobId)

        // The price is the one we listed it for
        blobPrice = await contractInstance.getBlobPrice(blobId)
        assert.strictEqual(blobPrice.toNumber(), price)
    })

    it("cancels a blob sale", async () => {
        const result = await contractInstance.createRandomBlob(blobNames[0], { from: alice });
        const blobId = result.logs[0].args.blobId.toNumber()

        const price = 12345;
        await contractInstance.listBlobForSale(blobId, price);
        await contractInstance.cancelBlobListing(blobId)

        let blobsOnSale = await contractInstance.getBlobsForSale()
        assert.strictEqual(blobsOnSale.length, 0)
    })
})
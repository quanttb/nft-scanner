const axios = require('axios');

let db;

const startRaribleCrawler = async (database) => {
  db = database;

  do {
    try {
      await new Promise((r) =>
        setTimeout(r, process.env.SCANNER_LOOP_WAITING_TIME)
      );

      const nfts = await db.getNoMetadataNFTs();

      for (let nft of nfts) {
        await axios.get(nft.uri.replace('ipfs://', 'https://ipfs.rarible.com/'))
          .then(async (response) => {
            await db.setNFT(
              nft._doc._id,
              {
                metadata: {
                  name: response.data.name,
                  description: response.data.description,
                  image: response.data.image.replace('ipfs://', 'https://ipfs.rarible.com/'),
                  externalUrl: response.data.external_url,
                }
              },
            );
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  } while (true);
};

module.exports = { startRaribleCrawler };

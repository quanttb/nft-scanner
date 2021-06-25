require('dotenv').config();
const axios = require('axios');
const NFTs = require('./nfts');

const startRaribleCrawler = async () => {
  do {
    try {
      await new Promise((r) =>
        setTimeout(r, process.env.SCANNER_LOOP_WAITING_TIME)
      );

      const nfts = NFTs.getNoMetadataNFTs();

      for (let nft of nfts) {
        await axios.get(nft.uri.replace('ipfs://', 'https://ipfs.rarible.com/'))
          .then(function (response) {
            NFTs.updateMetadata(
              nft.tokenId,
              {
                name: response.data.name,
                description: response.data.description,
                image: response.data.image.replace('ipfs://', 'https://ipfs.rarible.com/'),
                externalUrl: response.data.external_url,
                attributes: response.data.attributes,
              },
            );
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      const result = NFTs.getAll();
      console.log(result);
      console.log(result.length);
    } catch (error) {
      console.error(error);
    }
  } while (true);
};

module.exports = { startRaribleCrawler };

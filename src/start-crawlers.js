const { startBlockchainCrawler } = require('./blockchain-crawler');
const { startRaribleCrawler } = require('./rarible-crawler');

const main = () => {
  startBlockchainCrawler();
  startRaribleCrawler();
};

main();
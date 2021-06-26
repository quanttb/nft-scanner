require('dotenv').config();
const DB = require('./utils/db');
const { startBlockchainCrawler } = require('./services/blockchain-crawler');
const { startRaribleCrawler } = require('./services/rarible-crawler');

const main = async () => {
  const db = new DB();
  await db.init();

  startBlockchainCrawler(db);
  startRaribleCrawler(db);
};

main();
const Web3 = require('web3');
const RaribleTokenABI = require('../abi/RaribleToken.abi.json');

const web3 = new Web3(process.env.INFURA_ENDPOINT);

const ZERO_ADDRESS = process.env.ZERO_ADDRESS;
const raribleTokenContract = new web3.eth.Contract(
  RaribleTokenABI,
  process.env.RARIBLE_TOKEN_ADDRESS
);
const typesArray = [
  {
    indexed: true,
    internalType: 'address',
    name: 'sellToken',
    type: 'address',
  },
  {
    indexed: true,
    internalType: 'uint256',
    name: 'sellTokenId',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'sellValue',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'owner',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'buyToken',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'buyTokenId',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'buyValue',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'address',
    name: 'buyer',
    type: 'address',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256',
  },
  {
    indexed: false,
    internalType: 'uint256',
    name: 'salt',
    type: 'uint256',
  },
];
let db;

const startBlockchainCrawler = async (database) => {
  db = database;

  do {
    try {
      await new Promise((r) =>
        setTimeout(r, process.env.SCANNER_LOOP_WAITING_TIME)
      );

      const currentBlockNumber = await web3.eth.getBlockNumber();
      const startBlock = await db.getConfig('startBlock');
      const endBlock = currentBlockNumber - Number(process.env.ETH_DELAY_BLOCK_COUNT);

      if (startBlock > endBlock) continue;

      let pastEvents;
      try {
        pastEvents = await raribleTokenContract.getPastEvents(
          'TransferSingle',
          {
            fromBlock: startBlock,
            toBlock: endBlock,
          }
        );
      } catch (error) {
        console.error(error);
        startBlock = i;
        continue;
      }

      for (let event of pastEvents) {
        if (event.returnValues._from === ZERO_ADDRESS) {
          const uri = await raribleTokenContract.methods
            .uri(event.returnValues._id)
            .call();

          db.setNFT(
            event.returnValues._id,
            {
              quantities: Number(event.returnValues._value),
              uri: uri,
              creator: event.returnValues._to,
              owner: event.returnValues._to,
              mintTransactionHash: event.transactionHash,
            }
          );
        } else if (event.returnValues._to === ZERO_ADDRESS) {
          // const nft = NFTs.getNFT(event.returnValues._id);

          // if (nft) {
          //   NFTs.burn(
          //     event.returnValues._id,
          //     event.returnValues._from,
          //     event.returnValues._value,
          //   );
          // }

          // console.log('BURN:');
          // console.log(event.returnValues);
          // console.log(`\ttokenId: ${event.returnValues._id}`);
          // console.log(`\tquantities: ${event.returnValues._value}`);
          // console.log(`\ttxHash: ${event.transactionHash}`);
        } else {
          // let exchangeLog;
          // try {
          //   const receipt = await web3.eth.getTransactionReceipt(
          //     event.transactionHash
          //   );
          //   const exchangeLogs = receipt.logs.filter(
          //     (log) => log.address === process.env.EXCHANGE_V1_ADDRESS
          //   );

          //   if (exchangeLogs.length > 0) {
          //     exchangeLog = web3.eth.abi.decodeLog(
          //       typesArray,
          //       exchangeLogs[0].data,
          //       exchangeLogs[0].topics.slice(1)
          //     );
          //   }
          // } catch (error) {
          //   console.error(error);
          // }

          // const nft = NFTs.getNFT(event.returnValues._id);

          // if (nft) {
          //   NFTs.burn(
          //     event.returnValues._id,
          //     event.returnValues._from,
          //     event.returnValues._value,
          //   );
          // }

          // console.log('TRANSFER:');
          // console.log(`\ttokenId: ${event.returnValues._id}`);
          // console.log(`\tquantities: ${event.returnValues._value}`);
          // // if (exchangeLog) {
          // //   console.log(
          // //     `\tamount: ${web3.utils.fromWei(exchangeLog.buyValue)} ETH`
          // //   );
          // // }
          // console.log(`\tseller: ${event.returnValues._from}`);
          // console.log(`\tbuyer: ${event.returnValues._to}`);
          // console.log(`\ttxHash: ${event.transactionHash}`);
        }
      }

      console.log(`Processed from #${startBlock} to #${endBlock}.`);
      await db.setConfig('startBlock', endBlock + 1);
    } catch (error) {
      console.error(error);
    }
  } while (true);
};

module.exports = { startBlockchainCrawler };

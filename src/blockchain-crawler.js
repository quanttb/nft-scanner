require('dotenv').config();
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
let startBlock = process.env.START_BLOCK;
// let endBlock = 0;
let endBlock = Number(process.env.START_BLOCK) + 100;

const main = async () => {
  do {
    try {
      await new Promise((r) =>
        setTimeout(r, process.env.SCANNER_LOOP_WAITING_TIME)
      );

      // const currentBlockNumber = await web3.eth.getBlockNumber();
      // endBlock = currentBlockNumber - Number(process.env.ETH_DELAY_BLOCK_COUNT);

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

      pastEvents.forEach(async (event) => {
        if (event.returnValues._from === ZERO_ADDRESS) {
          const uri = await raribleTokenContract.methods
            .uri(event.returnValues._id)
            .call();
          console.log('MINT:');
          console.log(`\ttokenId: ${event.returnValues._id}`);
          console.log(`\tquantities: ${event.returnValues._value}`);
          console.log(`\turi: ${uri}`);
          console.log(`\tcreator: ${event.returnValues._to}`);
          console.log(`\ttxHash: ${event.transactionHash}`);
        } else if (event.returnValues._to === ZERO_ADDRESS) {
          console.log('BURN:');
          console.log(`\ttokenId: ${event.returnValues._id}`);
          console.log(`\tquantities: ${event.returnValues._value}`);
          console.log(`\ttxHash: ${event.transactionHash}`);
        } else {
          let exchangeLog;
          try {
            const receipt = await web3.eth.getTransactionReceipt(
              event.transactionHash
            );
            const exchangeLogs = receipt.logs.filter(
              (log) => log.address === process.env.EXCHANGE_V1_ADDRESS
            );

            if (exchangeLogs.length > 0) {
              exchangeLog = web3.eth.abi.decodeLog(
                typesArray,
                exchangeLogs[0].data,
                exchangeLogs[0].topics.slice(1)
              );
            }
          } catch (error) {
            console.error(error);
          }
          console.log('TRANSFER:');
          console.log(`\ttokenId: ${event.returnValues._id}`);
          console.log(`\tquantities: ${event.returnValues._value}`);
          // if (exchangeLog) {
          //   console.log(
          //     `\tamount: ${web3.utils.fromWei(exchangeLog.buyValue)} ETH`
          //   );
          // }
          console.log(`\tseller: ${event.returnValues._from}`);
          console.log(`\tbuyer: ${event.returnValues._to}`);
          console.log(`\ttxHash: ${event.transactionHash}`);
        }
      });

      startBlock = endBlock + 1;
    } catch (error) {
      console.error(error);
    }
  } while (true);
};

main();

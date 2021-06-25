class NFTs {
  static _nfts = [];

  static getAll() {
    return this._nfts;
  }

  static getNoMetadataNFTs() {
    return this._nfts.filter(nft => !nft.metadata);
  }

  static getNFT(tokenId) {
    return this._nfts.find(nft => nft.tokenId === tokenId);
  }

  static mint(tokenId, quantities, uri, owners) {
    const nfts = this._nfts.filter(nft => nft.tokenId === tokenId);

    if (nfts.length > 0) {
      return false;
    }

    this._nfts.push({
      tokenId: tokenId,
      quantities: quantities,
      uri: uri,
      owners: [owners],
    });

    return true;
  }

  static burn(tokenId, address, quantities) {
    const nft = this._nfts.find(nft => nft.tokenId === tokenId);

    if (!nft) {
      return false;
    }

    const owner = nft.owners.filter(owner => owner.address === address);
    owner.quantities -= quantities;

    return true;
  }

  static transfer(tokenId, srcAddress, dstAddress, quantities) {
    const nft = this._nfts.find(nft => nft.tokenId === tokenId);

    if (!nft) {
      return false;
    }

    const srcOwner = nft.owners.filter(owner => owner.address === srcAddress);
    srcOwner.quantities -= quantities;

    const dstOwner = nft.owners.filter(owner => owner.address === dstAddress);
    if (dstOwner) {
      dstOwner.quantities += quantities;
    } else {
      nft.owner.push({
        address: dstAddress,
        quantities: quantities,
      });
    }

    return true;
  }

  static updateMetadata(tokenId, metadata) {
    const nft = this._nfts.find(nft => nft.tokenId === tokenId);

    if (!nft) {
      return false;
    }

    nft.metadata = metadata;

    return true;
  }
}

module.exports = NFTs;

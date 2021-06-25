class NFTs {
  static _nfts = [];

  static getAll() {
    return this._nfts;
  }

  static getNoMetadataNFTs() {
    return this._nfts.filter(nft => !nft.metadata);
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

  static burn(tokenId) {
    const nfts = this._nfts.filter(nft => nft.tokenId === tokenId);

    if (nfts.length === 0) {
      return false;
    }

    this._nfts = this._nfts.filter(nft => nft.tokenId !== tokenId);

    return true;
  }

  static updateMetadata(tokenId, metadata) {
    const nfts = this._nfts.filter(nft => nft.tokenId === tokenId);

    if (nfts.length === 0) {
      return false;
    }

    nfts[0].metadata = metadata;

    return true;
  }
}

module.exports = NFTs;

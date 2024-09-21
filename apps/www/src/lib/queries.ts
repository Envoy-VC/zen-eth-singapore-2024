export const ALL_PROFILES_QUERY = `
  query ExampleQuery {
    allProfileCreateds(orderBy: LOG_INDEX_ASC) {
        nodes {
          tokenId
          owner
          handleNamespace
          handleLocalName
        }
    }
  }
`;

export const PROFILES_BY_OWNER_QUERY = (owner: string) => `
  query ExampleQuery {
    allProfileCreateds(
      orderBy: LOG_INDEX_ASC
      condition: { owner: "${owner}" }
    ) {
      nodes {
        tokenId
        owner
        handleNamespace
        handleLocalName
      }
    }
  }
`;

export const PROFILES_BY_TOKEN_ID_QUERY = (tokenId: string) => `
  query ExampleQuery {
    allProfileCreateds(condition: { tokenId: "${tokenId}" }) {
      nodes {
        handleLocalName
        handleNamespace
        owner
        tokenId
      }
    }
  }
`;

export const ALL_PUBLICATIONS_QUERY = `
  query ExampleQuery {
    allPublicationCreateds(orderBy: LOG_INDEX_ASC) {
      nodes {
        tokenId
        txHash
        publicationId
        content
      }
    }
  }
`;

export const PUBLICATIONS_BY_TOKEN_ID_QUERY = (tokenId: string) => `
  query ExampleQuery {
    allPublicationCreateds(
      orderBy: LOG_INDEX_ASC
      condition: { tokenId: "${tokenId}" }
    ) {
      nodes {
        tokenId
        content
        publicationId
        txHash
      }
    }
  }
`;

export const ALL_POLLS_QUERY = `
  query ExampleQuery {
    allPollCreateds {
      nodes {
        content
        deadline
        noOfOptions
        pollId
        tokenId
      }
    }
  }
`;

export const POLLS_BY_TOKEN_ID_QUERY = (tokenId: string) => `
  query ExampleQuery {
    allPollCreateds(condition: { tokenId: "${tokenId}" }) {
      nodes {
        content
        deadline
        noOfOptions
        pollId
        tokenId
      }
    }
  }
`;

export const AUCTIONS_BY_TOKEN_ID_QUERY = (tokenId: string) => `
  query ExampleQuery {
    allAuctionCreateds(condition: { tokenId: "${tokenId}" }) {
      nodes {
        auctionId
        content
        endTime
        startPrice
        startTime
        tokenId
      }
    }
  }
`;

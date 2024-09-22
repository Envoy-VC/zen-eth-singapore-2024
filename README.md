Zen is a fully modular, privacy-preserving social media platform built on top of the Fhenix blockchain. Designed with extensibility in mind, Zen allows users to interact with FHE-based (Fully Homomorphic Encryption) applications and build custom plugins. The platform is optimized for speed, leveraging a custom-built Rust-based indexer for real-time synchronization across the entire network.

### Extensibility

Zen's modular nature encourages developers to build additional privacy-preserving plugins. The platform supports a wide range of potential use cases, such as:

- Private messaging applications
- Encrypted voting systems
- Decentralized marketplaces with confidential transactions
- Developers can extend existing modules or create entirely new ones, allowing for a flexible and dynamic ecosystem.

### Features

- Modular Plugin Architecture: Add, remove, or modify plugins to enhance or customize functionality.
- Privacy-Preserving Interactions: FHE ensures all sensitive data is encrypted and only accessible to authorized users.
- Rust-Based Indexer: Built for speed and scalability, ensuring fast synchronization of social media data.
- Customizable Social Space: Users and developers can extend Zen with new plugins to create tailored social experiences.

### Core Modules (Plugins)

1. Handle Claim Module: Users can claim unique handles, serving as their on-chain identity.
Handles may contain encrypted private information (e.g., email, bio, location). Private data can only be decrypted by those who follow the user, via an "unseal" process.

2. Follow Module: Follower counts are kept private, visible only to the profile owner and their followers. Both follower and followee identities are protected, ensuring confidential interactions.

3. Confidential Polls: Users can create confidential polls similar to Twitter polls. Number of votes remains private throughout the poll's duration. Final vote count is revealed only after the poll ends or the deadline is reached.

4. Confidential Auction Markets: Users can host auction markets within Zen.
Bidder addresses and bid amounts are encrypted and remain confidential until the auction concludes. The highest bid and winning address are revealed only after the auction ends.

### Architecture Overview

Zen is structured around a plugin-based architecture, where modules can be easily added or modified by developers. This provides a high degree of flexibility and encourages community-driven expansion of features while ensuring user data privacy through FHE.

- Blockchain: Fhenix (L2 Ethereum-based)
- Indexer: Rust-based, custom-tailored for fast sync and efficient data retrieval.


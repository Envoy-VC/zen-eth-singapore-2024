// 'use client';
// import type { PropsWithChildren } from 'react';
// import { wagmiConfig } from '~/lib/viem';
// import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
// import {
//   DynamicContextProvider,
//   mergeNetworks,
// } from '@dynamic-labs/sdk-react-core';
// import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { type State, WagmiProvider } from 'wagmi';
// import { env } from '~/env';
// const queryClient = new QueryClient();
// interface Web3ProviderProps extends PropsWithChildren {
//   initialState?: State;
// }
// export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
//   return (
//     <DynamicContextProvider
//       settings={{
//         environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
//         walletConnectors: [EthereumWalletConnectors],
//         overrides: {
//           evmNetworks: (networks) =>
//             mergeNetworks(networks, [
//               {
//                 blockExplorerUrls: ['https://etherscan.io/'],
//                 chainId: 412346,
//                 chainName: 'Fhenix Local Network',
//                 iconUrls: ['https://docs.fhenix.zone/img/logo-black.svg'],
//                 name: 'Fhenix Local Network',
//                 nativeCurrency: {
//                   decimals: 18,
//                   name: 'FHE',
//                   symbol: 'tFHE',
//                 },
//                 networkId: 412346,
//                 rpcUrls: ['http://127.0.0.1:42069'],
//                 vanityName: 'Fhenix Local',
//               },
//             ]),
//         },
//       }}
//     >
//       <WagmiProvider config={wagmiConfig} initialState={initialState}>
//         <QueryClientProvider client={queryClient}>
//           <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
//         </QueryClientProvider>
//       </WagmiProvider>
//     </DynamicContextProvider>
//   );
// };
'use client';

import type { PropsWithChildren } from 'react';

import { projectId, wagmiConfig } from '~/lib/viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { type State, WagmiProvider } from 'wagmi';

// 'use client';
// import type { PropsWithChildren } from 'react';
// import { wagmiConfig } from '~/lib/viem';
// import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
// import {
//   DynamicContextProvider,
//   mergeNetworks,
// } from '@dynamic-labs/sdk-react-core';
// import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { type State, WagmiProvider } from 'wagmi';
// import { env } from '~/env';
// const queryClient = new QueryClient();
// interface Web3ProviderProps extends PropsWithChildren {
//   initialState?: State;
// }
// export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
//   return (
//     <DynamicContextProvider
//       settings={{
//         environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
//         walletConnectors: [EthereumWalletConnectors],
//         overrides: {
//           evmNetworks: (networks) =>
//             mergeNetworks(networks, [
//               {
//                 blockExplorerUrls: ['https://etherscan.io/'],
//                 chainId: 412346,
//                 chainName: 'Fhenix Local Network',
//                 iconUrls: ['https://docs.fhenix.zone/img/logo-black.svg'],
//                 name: 'Fhenix Local Network',
//                 nativeCurrency: {
//                   decimals: 18,
//                   name: 'FHE',
//                   symbol: 'tFHE',
//                 },
//                 networkId: 412346,
//                 rpcUrls: ['http://127.0.0.1:42069'],
//                 vanityName: 'Fhenix Local',
//               },
//             ]),
//         },
//       }}
//     >
//       <WagmiProvider config={wagmiConfig} initialState={initialState}>
//         <QueryClientProvider client={queryClient}>
//           <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
//         </QueryClientProvider>
//       </WagmiProvider>
//     </DynamicContextProvider>
//   );
// };

// 'use client';
// import type { PropsWithChildren } from 'react';
// import { wagmiConfig } from '~/lib/viem';
// import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
// import {
//   DynamicContextProvider,
//   mergeNetworks,
// } from '@dynamic-labs/sdk-react-core';
// import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { type State, WagmiProvider } from 'wagmi';
// import { env } from '~/env';
// const queryClient = new QueryClient();
// interface Web3ProviderProps extends PropsWithChildren {
//   initialState?: State;
// }
// export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
//   return (
//     <DynamicContextProvider
//       settings={{
//         environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
//         walletConnectors: [EthereumWalletConnectors],
//         overrides: {
//           evmNetworks: (networks) =>
//             mergeNetworks(networks, [
//               {
//                 blockExplorerUrls: ['https://etherscan.io/'],
//                 chainId: 412346,
//                 chainName: 'Fhenix Local Network',
//                 iconUrls: ['https://docs.fhenix.zone/img/logo-black.svg'],
//                 name: 'Fhenix Local Network',
//                 nativeCurrency: {
//                   decimals: 18,
//                   name: 'FHE',
//                   symbol: 'tFHE',
//                 },
//                 networkId: 412346,
//                 rpcUrls: ['http://127.0.0.1:42069'],
//                 vanityName: 'Fhenix Local',
//               },
//             ]),
//         },
//       }}
//     >
//       <WagmiProvider config={wagmiConfig} initialState={initialState}>
//         <QueryClientProvider client={queryClient}>
//           <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
//         </QueryClientProvider>
//       </WagmiProvider>
//     </DynamicContextProvider>
//   );
// };

// 'use client';

// import type { PropsWithChildren } from 'react';

// import { wagmiConfig } from '~/lib/viem';

// import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
// import {
//   DynamicContextProvider,
//   mergeNetworks,
// } from '@dynamic-labs/sdk-react-core';
// import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { type State, WagmiProvider } from 'wagmi';
// import { env } from '~/env';

// const queryClient = new QueryClient();

// interface Web3ProviderProps extends PropsWithChildren {
//   initialState?: State;
// }

// export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
//   return (
//     <DynamicContextProvider
//       settings={{
//         environmentId: env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
//         walletConnectors: [EthereumWalletConnectors],
//         overrides: {
//           evmNetworks: (networks) =>
//             mergeNetworks(networks, [
//               {
//                 blockExplorerUrls: ['https://etherscan.io/'],
//                 chainId: 412346,
//                 chainName: 'Fhenix Local Network',
//                 iconUrls: ['https://docs.fhenix.zone/img/logo-black.svg'],
//                 name: 'Fhenix Local Network',
//                 nativeCurrency: {
//                   decimals: 18,
//                   name: 'FHE',
//                   symbol: 'tFHE',
//                 },
//                 networkId: 412346,
//                 rpcUrls: ['http://127.0.0.1:42069'],
//                 vanityName: 'Fhenix Local',
//               },
//             ]),
//         },
//       }}
//     >
//       <WagmiProvider config={wagmiConfig} initialState={initialState}>
//         <QueryClientProvider client={queryClient}>
//           <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
//         </QueryClientProvider>
//       </WagmiProvider>
//     </DynamicContextProvider>
//   );
// };

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'light',
  chainImages: {
    8008135: 'https://docs.fhenix.zone/img/logo-black.svg',
    412346: 'https://docs.fhenix.zone/img/logo-black.svg',
  },
});

const queryClient = new QueryClient();

interface Web3ProviderProps extends PropsWithChildren {
  initialState?: State;
}

export const Web3Provider = ({ children, initialState }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

import {
  type Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from 'wagmi';
import { walletConnect } from 'wagmi/connectors';
import { env } from '~/env';

import { FOLLOW_MODULE_ABI, PROFILE_ABI, PUBLICATION_MODULE_ABI } from './abi';
import { fhenixHelium, localFhenix } from './chains';

export const projectId = env.NEXT_PUBLIC_WALLETCONNECT_ID;

const metadata = {
  name: 'Web3 Turbo Starter',
  description: 'Web3 starter kit with turborepo, wagmi, and Next.js',
  url: 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiConfig: Config = createConfig({
  chains: [localFhenix, fhenixHelium],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
  transports: {
    [localFhenix.id]: http(),
    [fhenixHelium.id]: http(),
  },
});

export const profileContractConfig = {
  abi: PROFILE_ABI,
  address: env.NEXT_PUBLIC_PROFILE_ADDRESS,
};

export const publicationModuleConfig = {
  abi: PUBLICATION_MODULE_ABI,
  address: env.NEXT_PUBLIC_PUBLICATION_MODULE_ADDRESS,
};

export const followModuleConfig = {
  abi: FOLLOW_MODULE_ABI,
  address: env.NEXT_PUBLIC_FOLLOW_MODULE_ADDRESS,
};

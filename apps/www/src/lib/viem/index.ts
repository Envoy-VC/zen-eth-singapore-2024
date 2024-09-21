import {
  type Config,
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { env } from '~/env';

import { fhenixHelium, localFhenix } from './chains';

export const projectId = env.NEXT_PUBLIC_WALLETCONNECT_ID;

export const wagmiConfig: Config = createConfig({
  chains: [fhenixHelium, localFhenix, mainnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  multiInjectedProviderDiscovery: false,
  transports: {
    [fhenixHelium.id]: http(),
    [localFhenix.id]: http(),
    [mainnet.id]: http(),
  },
});

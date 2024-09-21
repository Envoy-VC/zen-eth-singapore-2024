import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_WALLETCONNECT_ID: z.string().min(1),
    NEXT_PUBLIC_DYNAMIC_ENV_ID: z.string().min(1),
    NEXT_PUBLIC_PROFILE_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_HANDLE_MODULE_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_FOLLOW_MODULE_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_PUBLICATION_MODULE_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_POLL_MODULE_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_AUCTION_MODULE_ADDRESS: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
    NEXT_PUBLIC_DYNAMIC_ENV_ID: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID,
    NEXT_PUBLIC_PROFILE_ADDRESS: process.env.NEXT_PUBLIC_PROFILE_ADDRESS,
    NEXT_PUBLIC_HANDLE_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_HANDLE_MODULE_ADDRESS,
    NEXT_PUBLIC_FOLLOW_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_FOLLOW_MODULE_ADDRESS,
    NEXT_PUBLIC_PUBLICATION_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_PUBLICATION_MODULE_ADDRESS,
    NEXT_PUBLIC_POLL_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_POLL_MODULE_ADDRESS,
    NEXT_PUBLIC_AUCTION_MODULE_ADDRESS:
      process.env.NEXT_PUBLIC_AUCTION_MODULE_ADDRESS,
  },
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});

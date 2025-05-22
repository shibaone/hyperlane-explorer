const isDevMode = process?.env?.NODE_ENV === 'development';
const version = process?.env?.NEXT_PUBLIC_VERSION ?? null;
const explorerApiKeys = JSON.parse(process?.env?.EXPLORER_API_KEYS || '{}');

interface Config {
  debug: boolean;
  version: string | null;
  apiUrl: string;
  explorerApiKeys: Record<string, string>;
  githubProxy?: string;
  registry: {
    uri: string;
    branch: string;
    authToken: string;
  };
}

export const config: Config = Object.freeze({
  debug: isDevMode,
  version,
  // apiUrl: 'https://explorer4.hasura.app/v1/graphql',
  apiUrl: 'http://localhost:3280/graphql',
  explorerApiKeys,
  githubProxy: 'https://proxy.hyperlane.xyz',
  registry: {
    uri: process?.env?.REGISTRY_URI || 'https://github.com/shibaone/hyperlane-registry',
    branch: process?.env?.REGISTRY_BRANCH || 'devnet-v4',
    authToken: process?.env?.REGISTRY_AUTH_TOKEN || '',
  },
});

// Based on https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/infra/config/environments/mainnet3/agent.ts
// Based on https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/typescript/infra/config/environments/testnet4/agent.ts
export const unscrapedChainsInDb = ['proteustestnet', 'viction'];

export const debugIgnoredChains = ['treasure', 'treasuretopaz'];

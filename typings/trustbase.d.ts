import * as web3 from './web3.d'

declare interface AsyncProvider {
  sendAsync(payload: web3.JsonRPCRequest, callback: (e: Error, val: web3.JsonRPCResponse) => void)
}

declare interface InitOptions {
  provider: AsyncProvider | string
  defaultAccount?: string
}

declare interface ContractOptions {
  networks?: {
    [networkId: number]: {
      [address: string]: string
    }
  },
  address?: string
}

declare interface ContractMethodOptions {
  from?: string
  gas?: string | number
  gasPrice?: string | number
}

declare interface UsernameContractMethodOptions extends ContractMethodOptions {
  isHash?: boolean
}

declare interface UploadPrekeysOption extends UsernameContractMethodOptions {
  interval?: number
  fromUnixDay?: number
}

declare interface PreKeyStoreMetaData {
  lastPrekeysDate: number
  interval: number
  0: number
  1: number
}

declare interface GetMessagesOption extends UsernameContractMethodOptions {
  fromBlock?: web3.BlockType
  toBlock?: web3.BlockType
}

declare interface Message {
  message: string,
  timestamp: number
}

declare interface QueriedMessages {
  lastBlock: number,
  messages: Array<Message>
}

declare module trustbase {
  function getWeb3(): web3.Web3
  function initialize(options: InitOptions): void

  class Trustbase {
    web3: web3.Web3
    contract: web3.Contract

    constructor(options?: ContractOptions)
    register(usernameOrUsernameHash: string, identityPublicKey: string, options?: UsernameContractMethodOptions): web3.PromiEvent<web3.TransactionReceipt>
    isOwner(accountAddress: string, usernameOrUsernameHash: string, options?: UsernameContractMethodOptions): Promise<boolean>
    getIdentity(usernameOrUsernameHash: string, options?: UsernameContractMethodOptions): Promise<string>
  }

  class PreKeyStore {
    web3: web3.Web3
    contract: web3.Contract

    constructor(options?: ContractOptions)
    uploadPrekeys(usernameOrUsernameHash: string, prekeyPublicKeys: Array<string>, options?: UploadPrekeysOption): web3.PromiEvent<web3.TransactionReceipt>
    getPrekey(usernameOrUsernameHash: string, unixDay: number, options?: UsernameContractMethodOptions): Promise<string>
    getMetaData(usernameOrUsernameHash: string, options?: UsernameContractMethodOptions): Promise<PreKeyStoreMetaData>
  }

  class Messages {
    web3: web3.Web3
    contract: web3.Contract

    constructor(options?: ContractOptions)
    publish(message: string, options?: ContractMethodOptions): web3.PromiEvent<web3.TransactionReceipt>
    getMessages(options: GetMessagesOption): Promise<QueriedMessages>
  }

  class TrustbaseError extends Error {
    static readonly CODE: {
      UNKNOWN: 0,
      UNINITIALIZED_WEB3: 100,
      INITIALIZED_ALREADY: 101,
      PROVIDER_NOT_PROVIDED: 102,
      INVALID_ACCOUNT_ADDRESS: 200,
      ACCOUNT_NOT_EXIST: 201,
      FOUND_NO_ACCOUNT: 202,
      NETWORK_MISMATCH: 300,
      INVALID_CONTRACT_ADDRESS: 301
    }
    code: number
    constructor(message: string, code?: number)
  }
}

export = trustbase
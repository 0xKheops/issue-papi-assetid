import {
  MultiAddress,
  pah,
  XcmV3Junction,
  XcmV3Junctions,
} from "@polkadot-api/descriptors";
import { createClient, type TxOptions } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/node";
import { alice, bob } from "./accounts";

const PAH_RPC_URL = "wss://polkadot-asset-hub-rpc.polkadot.io";

type FeeAsset = { parents: number; interior: XcmV3Junctions };

const txOptions: TxOptions<FeeAsset> = {
  // USDC
  asset: {
    parents: 0,
    interior: XcmV3Junctions.X2([
      XcmV3Junction.PalletInstance(50),
      XcmV3Junction.GeneralIndex(BigInt(1337)),
    ]),
  },
};

// create the client with smoldot
const client = createClient(getWsProvider(PAH_RPC_URL));

// get the safely typed API
const api = client.getTypedApi(pah);

const transfer = api.tx.Balances.transfer_allow_death({
  dest: MultiAddress.Id(bob.address),
  value: 12345n,
});

try {
  /**
   * prints the json payload sent to wallet :
   * - using polkadot-api <= 1.8.4 the assetId property is present
   * - using polkadot-api >= 1.9.0 the assetId property is missing
   */

  await transfer.sign(alice.fakePjsSigner, txOptions);
} catch (err) {
  // not implemented
}

client.destroy();

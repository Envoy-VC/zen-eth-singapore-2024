import { create, multiaddr } from 'kubo-rpc-client';

export const uploadFile = async (file: ArrayBuffer) => {
  const client = create(multiaddr('/ip4/127.0.0.1/tcp/5001'));
  const { cid } = await client.add({ content: file });
  return cid.toString();
};

export const uploadJSON = async (json: object) => {
  const client = create(multiaddr('/ip4/127.0.0.1/tcp/5001'));
  const { cid } = await client.add(JSON.stringify(json));
  return cid.toString();
};

export const getJSON = async (cid: string) => {
  const data = await fetch(`http://localhost:8080/ipfs
/${cid}`).then((res) => res.json() as unknown);

  return data;
};

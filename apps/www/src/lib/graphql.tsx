'use server';



export const fetcher = async (query: string) => {
  const res = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  return (await res.json()) as unknown;
};

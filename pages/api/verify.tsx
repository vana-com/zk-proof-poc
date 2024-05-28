import type { NextApiRequest, NextApiResponse } from 'next';
import init, { verify_proof } from '../../public/pkg';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    await init();

    const { serializedProof, serializedVk } = req.body;

    try {
      const result = verify_proof(serializedProof, serializedVk);

      if (result) {
        res.status(200).json({ message: 'Proof verified successfully' });
      } else {
        res.status(400).json({ message: 'Proof verification failed' });
      }
    } catch (error) {
      console.error('Error during proof verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
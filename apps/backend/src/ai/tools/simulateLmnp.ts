import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

export class SimulateLmnpTool extends StructuredTool {
  name = 'simulateLmnp';
  description = 'Calcule Micro-BIC et Réel LMNP';
  schema = z.object({
    prixAchat: z.number().describe('prix d’achat du bien'),
    loyer: z.number().describe('loyer annuel'),
    charges: z.number().describe('charges annuelles'),
    duree: z.number().optional().describe('durrée de loyer'),
  });
  async _call({ prixAchat, loyer, charges, duree }: any) {
    const microBic = loyer * 0.5;
    const amortissement = prixAchat * 0.03;
    const reel = loyer - charges - amortissement;
    return JSON.stringify({
      microBic,
      reel,
      details: { prixAchat, loyer, charges, duree, amortissement },
    });
  }
}

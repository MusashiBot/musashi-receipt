import type {
  MusashiArbOpportunity,
  MusashiMover,
} from "./types.js";

export interface MusashiClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

export class MusashiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor(opts: MusashiClientOptions = {}) {
    this.baseUrl = (opts.baseUrl ?? "https://musashi-api.vercel.app").replace(/\/$/, "");
    this.fetchImpl = opts.fetch ?? globalThis.fetch;
  }

  async arbitrage(params: {
    minSpread?: number;
    minConfidence?: number;
    limit?: number;
    category?: string;
  } = {}): Promise<{ opportunities: MusashiArbOpportunity[]; metadata: { markets_analyzed: number } }> {
    const q = new URLSearchParams();
    if (params.minSpread != null) q.set("minSpread", String(params.minSpread));
    if (params.minConfidence != null) q.set("minConfidence", String(params.minConfidence));
    if (params.limit != null) q.set("limit", String(params.limit));
    if (params.category) q.set("category", params.category);

    const res = await this.fetchImpl(`${this.baseUrl}/api/markets/arbitrage?${q.toString()}`);
    if (!res.ok) throw new Error(`arbitrage ${res.status}`);
    const json = (await res.json()) as {
      success: boolean;
      data: {
        opportunities: MusashiArbOpportunity[];
        metadata: { markets_analyzed: number };
      };
    };
    return json.data;
  }

  async movers(params: {
    minChange?: number;
    limit?: number;
    category?: string;
  } = {}): Promise<{ movers: MusashiMover[]; metadata: { markets_analyzed: number } }> {
    const q = new URLSearchParams();
    if (params.minChange != null) q.set("minChange", String(params.minChange));
    if (params.limit != null) q.set("limit", String(params.limit));
    if (params.category) q.set("category", params.category);

    const res = await this.fetchImpl(`${this.baseUrl}/api/markets/movers?${q.toString()}`);
    if (!res.ok) throw new Error(`movers ${res.status}`);
    const json = (await res.json()) as {
      success: boolean;
      data: {
        movers: MusashiMover[];
        metadata: { markets_analyzed: number };
      };
    };
    return json.data;
  }
}

export { X84ApiError } from "./errors.js";
export type {
  X84Network,
  X84ApiClientConfig,
  PaginatedResponse,
  ListAgentsParams,
  AgentListItem,
  AgentDetail,
  GetAgentServicesParams,
  AgentService,
  GetAgentFeedbackParams,
  FeedbackEntry,
  Category,
  ReputationSummary,
  RegisterAgentParams,
  RegisterAgentResponse,
} from "./types.js";

import { X84ApiError } from "./errors.js";
import type {
  X84ApiClientConfig,
  X84Network,
  PaginatedResponse,
  ListAgentsParams,
  AgentListItem,
  AgentDetail,
  GetAgentServicesParams,
  AgentService,
  GetAgentFeedbackParams,
  FeedbackEntry,
  Category,
  RegisterAgentParams,
  RegisterAgentResponse,
} from "./types.js";

const BASE_URLS: Record<X84Network, string> = {
  mainnet: "https://api.x84.ai",
  devnet: "https://api-dev.x84.ai",
};

function trimSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function toQueryString(params: object): string {
  const entries = Object.entries(params);
  const parts: string[] = [];
  for (const [key, value] of entries) {
    if (value === undefined || value === null) continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

export class X84ApiClient {
  private readonly baseUrl: string;

  constructor(config?: X84ApiClientConfig) {
    if (config?.baseUrl) {
      this.baseUrl = trimSlash(config.baseUrl);
    } else {
      const network: X84Network = config?.network ?? "mainnet";
      this.baseUrl = BASE_URLS[network];
    }
  }

  // ── Discovery ──

  async listAgents(params?: ListAgentsParams): Promise<PaginatedResponse<AgentListItem>> {
    return this.request<PaginatedResponse<AgentListItem>>(
      "GET",
      `/agents${toQueryString(params ?? {})}`,
    );
  }

  async getAgent(id: string): Promise<AgentDetail> {
    return this.request<AgentDetail>("GET", `/agents/${id}`);
  }

  async getAgentServices(id: string, params?: GetAgentServicesParams): Promise<AgentService[]> {
    return this.request<AgentService[]>(
      "GET",
      `/agents/${id}/services${toQueryString(params ?? {})}`,
    );
  }

  async getAgentFeedback(id: string, params?: GetAgentFeedbackParams): Promise<FeedbackEntry[]> {
    return this.request<FeedbackEntry[]>(
      "GET",
      `/agents/${id}/feedback${toQueryString(params ?? {})}`,
    );
  }

  async listCategories(): Promise<Category[]> {
    return this.request<Category[]>("GET", "/categories");
  }

  // ── Registration (co-signed by backend) ──

  async registerAgent(params: RegisterAgentParams): Promise<RegisterAgentResponse> {
    return this.request<RegisterAgentResponse>("POST", "/agents/register", params);
  }

  // ── Internal ──

  private async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    const init: RequestInit = { method, headers };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);

    if (!res.ok) {
      let errorBody: unknown;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text().catch(() => null);
      }
      throw new X84ApiError(res.status, res.statusText, errorBody);
    }

    return (await res.json()) as T;
  }
}

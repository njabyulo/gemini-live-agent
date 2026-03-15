import type { TBrowserEvent, TServerEvent } from "@gemini-live-agent/shared/types";

import type { IAgentTutorLiveClientConnectInput } from "../types";

export class AgentTutorLiveClient {
  private socket: WebSocket | null = null;

  connect({
    callbacks,
    startPayload,
    url,
  }: IAgentTutorLiveClientConnectInput): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }

    const socket = new WebSocket(url);
    this.socket = socket;

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify(startPayload));
      callbacks.onOpen();
    });

    socket.addEventListener("message", (event) => {
      callbacks.onEvent(JSON.parse(event.data) as TServerEvent);
    });

    socket.addEventListener("close", () => {
      callbacks.onClose();
      this.socket = null;
    });

    socket.addEventListener("error", () => {
      callbacks.onError();
    });
  }

  close(): void {
    this.socket?.close();
    this.socket = null;
  }

  isOpen(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  send(event: TBrowserEvent): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify(event));
  }
}

// packages/game-engine/src/PlayerManager.ts

export interface Player {
  id: string;
  username: string;
  balance: number;
  connected: boolean;
  joinedAt: number;
}

export class PlayerManager {
  private readonly players = new Map<string, Player>();

  // ======================================================
  // Player Lifecycle
  // ======================================================

  public addPlayer(
    id: string,
    username: string,
    balance = 50000,
  ): Player {
    const existing = this.players.get(id);

    if (existing) {
      existing.connected = true;
      existing.username = username;
      return existing;
    }

    const player: Player = {
      id,
      username,
      balance,
      connected: true,
      joinedAt: Date.now(),
    };

    this.players.set(id, player);

    return player;
  }

  public disconnectPlayer(id: string): boolean {
    const player = this.players.get(id);

    if (!player) {
      return false;
    }

    player.connected = false;

    return true;
  }

  public removePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  // ======================================================
  // Queries
  // ======================================================

  public getPlayer(
    id: string,
  ): Player | undefined {
    return this.players.get(id);
  }

  public getPlayers(): Player[] {
    return [...this.players.values()];
  }

  public getConnectedPlayers(): Player[] {
    return [...this.players.values()].filter(
      (player) => player.connected,
    );
  }

  public hasPlayer(id: string): boolean {
    return this.players.has(id);
  }

  public count(): number {
    return this.players.size;
  }

  public connectedCount(): number {
    let count = 0;

    for (const player of this.players.values()) {
      if (player.connected) {
        count++;
      }
    }

    return count;
  }

  // ======================================================
  // Wallet
  // ======================================================

  public updateBalance(
    id: string,
    balance: number,
  ): Player | undefined {
    const player = this.players.get(id);

    if (!player) {
      return undefined;
    }

    player.balance = balance;

    return player;
  }

  public credit(
    id: string,
    amount: number,
  ): Player | undefined {
    const player = this.players.get(id);

    if (!player) {
      return undefined;
    }

    player.balance += amount;

    return player;
  }

  public debit(
    id: string,
    amount: number,
  ): Player | undefined {
    const player = this.players.get(id);

    if (!player) {
      return undefined;
    }

    if (amount <= 0) {
      return undefined;
    }

    if (player.balance < amount) {
      return undefined;
    }

    player.balance -= amount;

    return player;
  }

  // ======================================================
  // Maintenance
  // ======================================================

  public clear(): void {
    this.players.clear();
  }
}
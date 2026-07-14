export interface Player {
  id: string;
  username: string;
  balance: number;
  connected: boolean;
  joinedAt: number;
}

export class PlayerManager {
  private readonly players = new Map<string, Player>();

  /**
   * Registers a new player.
   * Returns the existing player if already registered.
   */
  addPlayer(
    id: string,
    username: string,
    balance = 1000,
  ): Player {
    const existing = this.players.get(id);

    if (existing) {
      existing.connected = true;
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

  /**
   * Disconnects a player without deleting their record.
   */
  disconnectPlayer(id: string): boolean {
    const player = this.players.get(id);

    if (!player) {
      return false;
    }

    player.connected = false;

    return true;
  }

  /**
   * Permanently removes a player.
   */
  removePlayer(id: string): boolean {
    return this.players.delete(id);
  }

  /**
   * Gets one player.
   */
  getPlayer(id: string): Player | undefined {
    return this.players.get(id);
  }

  /**
   * Returns all players.
   */
  getPlayers(): Player[] {
    return [...this.players.values()];
  }

  /**
   * Returns only connected players.
   */
  getConnectedPlayers(): Player[] {
    return this.getPlayers().filter(
      (player) => player.connected,
    );
  }

  /**
   * Checks whether a player exists.
   */
  hasPlayer(id: string): boolean {
    return this.players.has(id);
  }

  /**
   * Number of registered players.
   */
  count(): number {
    return this.players.size;
  }

  /**
   * Number of connected players.
   */
  connectedCount(): number {
    return this.getConnectedPlayers().length;
  }

  /**
   * Updates a player's balance.
   */
  updateBalance(
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

  /**
   * Credits a player's wallet.
   */
  credit(
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

  /**
   * Debits a player's wallet.
   * Returns undefined if insufficient funds.
   */
  debit(
    id: string,
    amount: number,
  ): Player | undefined {
    const player = this.players.get(id);

    if (!player) {
      return undefined;
    }

    if (player.balance < amount) {
      return undefined;
    }

    player.balance -= amount;

    return player;
  }

  /**
   * Removes all players.
   */
  clear(): void {
    this.players.clear();
  }
}
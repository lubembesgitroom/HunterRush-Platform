"use client";

/**
 * ============================================================
 * HunterRush <-> Sportsbook Host Communication Layer
 * ============================================================
 *
 * All communication between the iframe and the sportsbook
 * should pass through this file.
 *
 * Never call window.parent.postMessage() directly from
 * components.
 *
 * ============================================================
 */

export enum HostMessageType {
  OPEN_DEPOSIT = "OPEN_DEPOSIT",

  GAME_READY = "GAME_READY",

  REQUEST_BALANCE = "REQUEST_BALANCE",

  BALANCE_UPDATED = "BALANCE_UPDATED",

  PLAYER_UPDATED = "PLAYER_UPDATED",
}

export interface HostMessage<T = unknown> {
  type: HostMessageType;

  payload?: T;
}

/**
 * ------------------------------------------------------------
 * Internal helper
 * ------------------------------------------------------------
 */

function sendToParent<T>(
  type: HostMessageType,
  payload?: T,
): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    window.parent === window
  ) {
    console.warn(
      "[HOST] Not running inside an iframe.",
    );

    return;
  }

  window.parent.postMessage(
    {
      type,
      payload,
    },
    "*",
  );
}

/**
 * ------------------------------------------------------------
 * GAME READY
 * ------------------------------------------------------------
 */

export function notifyGameReady(): void {
  sendToParent(
    HostMessageType.GAME_READY,
  );
}

/**
 * ------------------------------------------------------------
 * OPEN DEPOSIT
 * ------------------------------------------------------------
 */

export function openDeposit(): void {
  sendToParent(
    HostMessageType.OPEN_DEPOSIT,
  );
}

/**
 * ------------------------------------------------------------
 * REQUEST BALANCE REFRESH
 * ------------------------------------------------------------
 */

export function requestBalance(): void {
  sendToParent(
    HostMessageType.REQUEST_BALANCE,
  );
}

/**
 * ============================================================
 * LISTENERS
 * ============================================================
 */

export interface BalancePayload {
  balance: number;
}

export interface PlayerPayload {
  username: string;

  balance: number;
}

type BalanceCallback = (
  balance: number,
) => void;

type PlayerCallback = (
  player: PlayerPayload,
) => void;

/**
 * Listen for updated wallet balance
 */

export function onBalanceUpdated(
  callback: BalanceCallback,
): () => void {
  const listener = (
    event: MessageEvent,
  ) => {
    const message =
      event.data as HostMessage<BalancePayload>;

    if (
      message?.type !==
      HostMessageType.BALANCE_UPDATED
    ) {
      return;
    }

    callback(
      message.payload?.balance ??
        0,
    );
  };

  window.addEventListener(
    "message",
    listener,
  );

  return () =>
    window.removeEventListener(
      "message",
      listener,
    );
}

/**
 * Listen for player information
 */

export function onPlayerUpdated(
  callback: PlayerCallback,
): () => void {
  const listener = (
    event: MessageEvent,
  ) => {
    const message =
      event.data as HostMessage<PlayerPayload>;

    if (
      message?.type !==
      HostMessageType.PLAYER_UPDATED
    ) {
      return;
    }

    callback(
      message.payload!,
    );
  };

  window.addEventListener(
    "message",
    listener,
  );

  return () =>
    window.removeEventListener(
      "message",
      listener,
    );
}
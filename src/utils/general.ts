import AsyncStorage from '@react-native-async-storage/async-storage';
import {store} from "../app/store";
import {setClientId, setRaceId, setStorageRaceId} from "../store/global.slice";
import {getClientIdFromLocalStorage, setRaceIdIntoLocalStorage} from "./db-service";

/** Number of digits reserved for the per-device race counter inside a race id. */
export const RACE_COUNTER_DIGITS = 4;

export class MissingClientIdError extends Error {
    constructor() {
        super('Client id is not available yet');
        this.name = 'MissingClientIdError';
    }
}

/**
 * Race id = clientId followed by the race counter zero-padded to a fixed width.
 * The fixed width keeps ids from different clients apart:
 *   client 12,  race 34 -> 120034
 *   client 123, race 4  -> 1230004
 */
export const buildRaceId = (clientId: number, raceCounter: number): number =>
    parseInt(`${clientId}${String(raceCounter).padStart(RACE_COUNTER_DIGITS, '0')}`, 10);

const resolveClientId = async (): Promise<number> => {
    const fromStore = store.getState().global.clientId;
    if (fromStore) return fromStore;
    const fromStorage = await getClientIdFromLocalStorage();
    if (fromStorage) {
        store.dispatch(setClientId(fromStorage));
        return fromStorage;
    }
    throw new MissingClientIdError();
};

const readStoredRaceCounter = async (): Promise<number> => {
    try {
        const value = await AsyncStorage.getItem("storageRaceId");
        const parsed = value !== null ? Number(JSON.parse(value)) : 0;
        return Number.isFinite(parsed) ? parsed : 0;
    } catch (e) {
        return 0;
    }
};

const allocateRaceId = async (): Promise<{ raceId: number; clientId: number }> => {
    const clientId = await resolveClientId();
    // Use the higher of memory and storage, so a race created before the
    // counter finished loading at app start can never reuse an old number.
    const current = Math.max(store.getState().global.storageRaceId, await readStoredRaceCounter());
    const next = current + 1;
    store.dispatch(setStorageRaceId(next));
    await setRaceIdIntoLocalStorage(next);
    const raceId = buildRaceId(clientId, next);
    store.dispatch(setRaceId(raceId));
    return {raceId, clientId};
};

// Calls are chained so two overlapping creations can never read the same counter.
let queue: Promise<unknown> = Promise.resolve();

/** Allocates a new race id that is unique for this device and across clients. */
export const createRaceId = (): Promise<{ raceId: number; clientId: number }> => {
    const result = queue.then(allocateRaceId, allocateRaceId);
    queue = result.catch(() => undefined);
    return result;
};

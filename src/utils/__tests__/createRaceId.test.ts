import AsyncStorage from '@react-native-async-storage/async-storage';

type GeneralModule = typeof import('../general');
type StoreModule = typeof import('../../app/store');
type SliceModule = typeof import('../../store/global.slice');

const CLIENT_ID = 10453;

let general: GeneralModule;
let store: StoreModule['store'];
let slice: SliceModule;

// Fresh store + fresh module state for every test, like a fresh app launch.
const loadModules = () => {
    jest.resetModules();
    general = require('../general');
    store = require('../../app/store').store;
    slice = require('../../store/global.slice');
};

beforeEach(async () => {
    await AsyncStorage.clear();
    loadModules();
});

describe('buildRaceId', () => {
    it('pads the race counter to a fixed width', () => {
        expect(general.buildRaceId(10453, 1)).toBe(104530001);
        expect(general.buildRaceId(10453, 42)).toBe(104530042);
        expect(general.buildRaceId(10453, 9999)).toBe(104539999);
    });

    it('does not collide between clients whose ids concatenate the same way', () => {
        // With the old format both of these were 1234.
        expect(general.buildRaceId(12, 34)).toBe(120034);
        expect(general.buildRaceId(123, 4)).toBe(1230004);
        expect(general.buildRaceId(12, 34)).not.toBe(general.buildRaceId(123, 4));
    });

    it('produces unique ids for many clients and counters', () => {
        const ids = new Set<number>();
        let count = 0;
        for (let clientId = 1; clientId <= 300; clientId++) {
            for (let counter = 1; counter <= 300; counter++) {
                ids.add(general.buildRaceId(clientId, counter));
                count++;
            }
        }
        expect(ids.size).toBe(count);
    });

    it('stays within a signed 32-bit integer for current client ids', () => {
        expect(general.buildRaceId(99999, 9999)).toBeLessThan(2 ** 31);
    });
});

describe('createRaceId', () => {
    it('gives every race in the same session a new id (the overwrite bug)', async () => {
        store.dispatch(slice.setClientId(CLIENT_ID));
        store.dispatch(slice.setStorageRaceId(5));

        const first = await general.createRaceId();
        const second = await general.createRaceId();
        const third = await general.createRaceId();

        expect(first).toEqual({ raceId: 104530006, clientId: CLIENT_ID });
        expect(second.raceId).toBe(104530007);
        expect(third.raceId).toBe(104530008);
    });

    it('updates the counter in Redux and in storage', async () => {
        store.dispatch(slice.setClientId(CLIENT_ID));
        store.dispatch(slice.setStorageRaceId(5));

        const { raceId } = await general.createRaceId();

        expect(store.getState().global.storageRaceId).toBe(6);
        expect(store.getState().global.raceId).toBe(raceId);
        expect(await AsyncStorage.getItem('storageRaceId')).toBe('6');
    });

    it('keeps counting after an app restart', async () => {
        store.dispatch(slice.setClientId(CLIENT_ID));
        const before = await general.createRaceId();

        loadModules(); // simulate restart: Redux is empty again, storage persists
        const { getRaceIdFromLocalStorage } = require('../db-service');
        await getRaceIdFromLocalStorage();
        store.dispatch(slice.setClientId(CLIENT_ID));
        const after = await general.createRaceId();

        expect(after.raceId).toBe(before.raceId + 1);
    });

    it('does not reuse an id when the counter has not loaded from storage yet', async () => {
        await AsyncStorage.setItem('storageRaceId', '20');
        store.dispatch(slice.setClientId(CLIENT_ID));
        // Redux counter is still 0 because getRaceIdFromLocalStorage has not finished.

        const { raceId } = await general.createRaceId();

        expect(raceId).toBe(104530021);
    });

    it('gives unique ids to overlapping calls (double tap)', async () => {
        store.dispatch(slice.setClientId(CLIENT_ID));

        const results = await Promise.all([
            general.createRaceId(),
            general.createRaceId(),
            general.createRaceId(),
        ]);
        const ids = results.map(r => r.raceId);

        expect(new Set(ids).size).toBe(3);
        expect(ids).toEqual([104530001, 104530002, 104530003]);
    });

    it('uses the client id from storage when Redux does not have it yet', async () => {
        await AsyncStorage.setItem('storageClientId5', JSON.stringify(CLIENT_ID));

        const { raceId, clientId } = await general.createRaceId();

        expect(clientId).toBe(CLIENT_ID);
        expect(raceId).toBe(104530001);
        expect(store.getState().global.clientId).toBe(CLIENT_ID);
    });

    it('refuses to create an id without a client id, and does not use up a number', async () => {
        await expect(general.createRaceId()).rejects.toBeInstanceOf(general.MissingClientIdError);
        expect(await AsyncStorage.getItem('storageRaceId')).toBeNull();

        // A failed call must not block later calls.
        store.dispatch(slice.setClientId(CLIENT_ID));
        await expect(general.createRaceId()).resolves.toEqual({ raceId: 104530001, clientId: CLIENT_ID });
    });
});

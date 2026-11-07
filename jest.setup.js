/* Global mocks for native modules used by the app. */

// AsyncStorage backed by one shared Map, so stored values survive
// jest.resetModules() the same way they survive an app restart on a phone.
global.__asyncStorageData = global.__asyncStorageData || new Map();
jest.mock('@react-native-async-storage/async-storage', () => {
    const data = global.__asyncStorageData;
    const api = {
        getItem: jest.fn(async (key) => (data.has(key) ? data.get(key) : null)),
        setItem: jest.fn(async (key, value) => { data.set(key, value); }),
        removeItem: jest.fn(async (key) => { data.delete(key); }),
        clear: jest.fn(async () => { data.clear(); }),
        getAllKeys: jest.fn(async () => [...data.keys()]),
    };
    return { __esModule: true, default: api, ...api };
});

jest.mock('expo-sqlite', () => ({
    openDatabaseSync: jest.fn(() => ({
        execSync: jest.fn(),
        runSync: jest.fn(),
        getAllSync: jest.fn(() => []),
        withTransactionSync: jest.fn((fn) => fn()),
    })),
}));

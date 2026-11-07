import React from 'react';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import axios from 'axios';
import { store } from '../../app/store';
import {
    setClientId,
    setIsLocked,
    setMyRace,
    setSelectedHeats,
    setSelectedMode,
} from '../../store/global.slice';
import { HeatModel, RaceModel } from '../../models';
import { HeatStateEnum } from '../../models/heatState.enum';
import { RaceDetails } from '../raceDetails/RaceDetails';
import { EditHeatNames } from '../editTime/components/EditHeatNames';
import { EditSyncTime } from '../editTime/components/EditSyncTime';
import { en } from '../../i18n/dictionaries';
import { lastUploadedRace } from '../../test-utils/uploads';

jest.mock('axios', () => ({
    __esModule: true,
    default: { post: jest.fn(() => Promise.resolve({})), get: jest.fn(() => Promise.resolve({ data: [] })) },
}));
jest.mock('expo-av', () => ({
    Audio: { Sound: { createAsync: jest.fn(async () => ({ sound: { playAsync: jest.fn(), unloadAsync: jest.fn() } })) } },
}));

const CLIENT_ID = 10453;
const RACE_ID = 104530001;
const OLD_GAP = 123456789;

const heat = (heatId: number): HeatModel => ({
    raceId: RACE_ID,
    heatId,
    startTime: '00:00:00.00',
    name: `heat ${heatId}`,
    heatStateNum: HeatStateEnum.ready,
    creationTime: 0,
});

const race = (heatIds: number[]): RaceModel => ({
    raceId: RACE_ID,
    clientId: CLIENT_ID,
    creationTime: 0,
    name: 'Test race',
    gapMills: OLD_GAP,
    heats: heatIds.map(heat),
});

const renderWithStore = (ui: React.ReactElement) => render(<Provider store={store}>{ui}</Provider>);
const heatIds = (r: RaceModel) => r.heats.map(h => h.heatId);
const pressIcon = async (name: string, index = 0) => {
    await act(async () => {
        // Keep only the outermost element per icon (inner elements repeat the same props).
        const icons = screen.UNSAFE_getAllByProps({ name }).filter(el => el.parent?.props.name !== name);
        fireEvent.press(icons[index]);
    });
};

beforeEach(() => {
    jest.useFakeTimers();
    (axios.post as jest.Mock).mockClear();
    store.dispatch(setClientId(CLIENT_ID));
    store.dispatch(setSelectedMode(false));
    store.dispatch(setSelectedHeats([]));
    store.dispatch(setIsLocked(false));
});

afterEach(() => {
    jest.useRealTimers();
});

describe('Race details screen', () => {
    it('add heat uploads the race WITH the new heat', async () => {
        store.dispatch(setMyRace(race([1, 2, 3])));
        renderWithStore(<RaceDetails />);

        await pressIcon('add');

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(heatIds(lastUploadedRace())).toEqual([1, 2, 3, 4]);
        expect(lastUploadedRace()).toEqual(store.getState().global.myRace);
    });

    it('add heat after a delete gets a new, unused heat id', async () => {
        store.dispatch(setMyRace(race([1, 3])));
        renderWithStore(<RaceDetails />);

        await pressIcon('add');

        expect(heatIds(lastUploadedRace())).toEqual([1, 3, 4]);
    });

    it('delete selected heats uploads the race WITHOUT the deleted heats', async () => {
        store.dispatch(setMyRace(race([1, 2, 3, 4])));
        store.dispatch(setSelectedMode(true));
        store.dispatch(setSelectedHeats([2, 4]));
        renderWithStore(<RaceDetails />);

        await pressIcon('trash-outline');

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(heatIds(lastUploadedRace())).toEqual([1, 3]);
        expect(lastUploadedRace()).toEqual(store.getState().global.myRace);
    });
});

describe('Edit heats screen', () => {
    it('add heat uploads the race WITH the new heat', async () => {
        store.dispatch(setMyRace(race([1, 2])));
        renderWithStore(<EditHeatNames />);

        await act(async () => {
            fireEvent.press(screen.getByText(en.addHeat));
        });

        expect(heatIds(lastUploadedRace())).toEqual([1, 2, 3]);
        expect(lastUploadedRace()).toEqual(store.getState().global.myRace);
    });

    it('delete heat uploads the race WITHOUT that heat', async () => {
        store.dispatch(setMyRace(race([1, 2, 3])));
        renderWithStore(<EditHeatNames />);

        await pressIcon('trash-outline', 1); // trash button of heat 2

        expect(heatIds(lastUploadedRace())).toEqual([1, 3]);
        expect(lastUploadedRace()).toEqual(store.getState().global.myRace);
    });

    it('delete then add never creates two heats with the same id', async () => {
        store.dispatch(setMyRace(race([1, 2, 3])));
        renderWithStore(<EditHeatNames />);

        await pressIcon('trash-outline', 1);
        await act(async () => {
            fireEvent.press(screen.getByText(en.addHeat));
        });

        const ids = heatIds(lastUploadedRace());
        expect(ids).toEqual([1, 3, 4]);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('Sync time screen', () => {
    it('uploads the NEW time offset, not the old one', async () => {
        store.dispatch(setMyRace(race([1])));
        renderWithStore(<EditSyncTime />);

        await act(async () => {
            fireEvent.press(screen.getByText(en.setTime));
        });

        const uploaded = lastUploadedRace();
        expect(uploaded.gapMills).not.toBe(OLD_GAP);
        expect(uploaded.gapMills).toBe(store.getState().global.myRace.gapMills);
    });
});

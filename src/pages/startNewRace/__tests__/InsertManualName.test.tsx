import React from 'react';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { store } from '../../../app/store';
import { setClientId, setMyRace, setSelectedPage, setStorageRaceId } from '../../../store/global.slice';
import { InsertManualName } from '../components/InsertManualName';
import { en } from '../../../i18n/dictionaries';
import { PagesNameEnum } from '../../../models';

jest.mock('axios', () => ({
    __esModule: true,
    default: { post: jest.fn(() => Promise.resolve({})), get: jest.fn(() => Promise.resolve({ data: [] })) },
}));

const CLIENT_ID = 10453;
const mockedPost = axios.post as jest.Mock;

const readUploadData = (formData: any): string =>
    typeof formData.get === 'function' ? formData.get('data') : formData._parts.find(([k]: [string]) => k === 'data')[1];

const uploadedRaces = () => mockedPost.mock.calls.map(([, formData]) => JSON.parse(readUploadData(formData)));

const renderScreen = () =>
    render(
        <Provider store={store}>
            <InsertManualName />
        </Provider>
    );

const createRace = async (name: string) => {
    const view = renderScreen();
    fireEvent.changeText(screen.getByPlaceholderText(en.insertRaceName), name);
    await act(async () => {
        fireEvent.press(screen.getByText(en.createNewRace));
    });
    await waitFor(() => expect(store.getState().global.selectedPage).toBe(PagesNameEnum.raceDetails));
    view.unmount();
};

beforeEach(async () => {
    await AsyncStorage.clear();
    mockedPost.mockClear();
    store.dispatch(setClientId(CLIENT_ID));
    store.dispatch(setStorageRaceId(5));
    store.dispatch(setSelectedPage(PagesNameEnum.startNewRace));
});

it('sends exactly one upload request when the button is tapped several times quickly', async () => {
    renderScreen();
    fireEvent.changeText(screen.getByPlaceholderText(en.insertRaceName), 'Race A');

    await act(async () => {
        const button = screen.getByText(en.createNewRace);
        fireEvent.press(button);
        fireEvent.press(button);
        fireEvent.press(button);
    });

    await waitFor(() => expect(store.getState().global.selectedPage).toBe(PagesNameEnum.raceDetails));
    expect(mockedPost).toHaveBeenCalledTimes(1);
    expect(uploadedRaces()[0]).toMatchObject({ raceId: 104530006, clientId: CLIENT_ID, name: 'Race A' });
});

it('creating a second race in the same session never reuses the first race id', async () => {
    await createRace('Race A');
    // User presses some starts on race A, then goes back and creates another race.
    store.dispatch(setSelectedPage(PagesNameEnum.startNewRace));
    await createRace('Race B');

    const [raceA, raceB] = uploadedRaces();
    expect(mockedPost).toHaveBeenCalledTimes(2);
    expect(raceA.raceId).toBe(104530006);
    expect(raceB.raceId).toBe(104530007);
    expect(raceA.raceId).not.toBe(raceB.raceId);
    expect(store.getState().global.myRace).toMatchObject({ raceId: 104530007, name: 'Race B' });
});

it('does not create or upload a race without a client id', async () => {
    store.dispatch(setClientId(0));
    store.dispatch(setMyRace({ raceId: 0, creationTime: 0, name: '', clientId: 0, heats: [], gapMills: 0 }));
    renderScreen();
    fireEvent.changeText(screen.getByPlaceholderText(en.insertRaceName), 'Race A');

    await act(async () => {
        fireEvent.press(screen.getByText(en.createNewRace));
    });

    expect(mockedPost).not.toHaveBeenCalled();
    expect(store.getState().global.selectedPage).toBe(PagesNameEnum.startNewRace);
    expect(store.getState().global.myRace.raceId).toBe(0);
});

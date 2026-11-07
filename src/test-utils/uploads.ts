import axios from 'axios';

const readUploadData = (formData: any): string =>
    typeof formData.get === 'function'
        ? formData.get('data')
        : formData._parts.find(([key]: [string]) => key === 'data')[1];

/** Races sent to uploadRace, in call order (requires axios to be jest-mocked). */
export const uploadedRaces = () =>
    (axios.post as jest.Mock).mock.calls.map(([, formData]) => JSON.parse(readUploadData(formData)));

export const lastUploadedRace = () => uploadedRaces()[uploadedRaces().length - 1];

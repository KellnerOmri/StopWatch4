import { createNewHeat, getNextHeatId } from '../heats';
import { HeatModel } from '../../models';
import { HeatStateEnum } from '../../models/heatState.enum';

const heat = (heatId: number): HeatModel => ({
    raceId: 1,
    heatId,
    startTime: '00:00:00.00',
    name: `heat ${heatId}`,
    heatStateNum: HeatStateEnum.ready,
    creationTime: 0,
});

describe('getNextHeatId', () => {
    it('starts at 1 for a race with no heats', () => {
        expect(getNextHeatId([])).toBe(1);
    });

    it('is one more than the last heat', () => {
        expect(getNextHeatId([heat(1), heat(2), heat(3)])).toBe(4);
    });

    it('does not reuse an existing id after a heat was deleted', () => {
        // Heats 1,2,3 -> delete heat 2. The old code (length + 1) returned 3, a duplicate.
        const afterDelete = [heat(1), heat(3)];
        expect(getNextHeatId(afterDelete)).toBe(4);
        expect(afterDelete.map(h => h.heatId)).not.toContain(getNextHeatId(afterDelete));
    });

    it('works when heats are not in order', () => {
        expect(getNextHeatId([heat(7), heat(2), heat(5)])).toBe(8);
    });

    it('keeps ids unique through repeated add/delete', () => {
        let heats: HeatModel[] = [];
        for (let i = 0; i < 5; i++) heats = [...heats, createNewHeat(1, heats)];
        heats = heats.filter(h => h.heatId !== 2 && h.heatId !== 4);
        for (let i = 0; i < 3; i++) heats = [...heats, createNewHeat(1, heats)];
        const ids = heats.map(h => h.heatId);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe('createNewHeat', () => {
    it('creates a ready heat for the race with the next id', () => {
        expect(createNewHeat(42, [heat(1), heat(3)])).toMatchObject({
            raceId: 42,
            heatId: 4,
            startTime: '00:00:00.00',
            name: 'heat',
            heatStateNum: HeatStateEnum.ready,
        });
    });
});

import {HeatModel} from "../models";
import {HeatStateEnum} from "../models/heatState.enum";

/**
 * Next free heat id: one more than the highest existing id.
 * Using heats.length + 1 reused an existing id after a heat was deleted
 * (heats 1,2,3 -> delete 2 -> new heat got id 3 again).
 */
export const getNextHeatId = (heats: HeatModel[]): number =>
    heats.reduce((max, heat) => Math.max(max, heat.heatId), 0) + 1;

export const createNewHeat = (raceId: number, heats: HeatModel[]): HeatModel => ({
    raceId,
    heatId: getNextHeatId(heats),
    startTime: '00:00:00.00',
    name: 'heat',
    heatStateNum: HeatStateEnum.ready,
    creationTime: new Date().getTime(),
});

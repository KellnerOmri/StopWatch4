export interface Dictionary {
    // Menu
    appTitle: string;
    startNewRace: string;
    loadLastRace: string;
    importRace: string;
    version: string;

    // Navigation
    back: string;
    settings: string;
    edit: string;

    // StartNewRace
    createManually: string;
    createFromList: string;
    insertRaceName: string;
    createNewRace: string;
    pleaseEnterRaceName: string;

    // RaceDetails
    synchronized: string;
    start: string;
    reset: string;
    selected: string;
    pleaseUnlockFirst: string;

    // EditPage
    syncTime: string;
    editHeatsName: string;
    addHeat: string;
    hours: string;
    minutes: string;
    seconds: string;
    setTime: string;

    // ImportRace
    importRaceTitle: string;
    owner: string;

    // Settings
    appearance: string;
    darkMode: string;
    general: string;
    language: string;
    english: string;
    hebrew: string;
}

export const en: Dictionary = {
    appTitle: 'StopWatch4',
    startNewRace: 'Start new race',
    loadLastRace: 'Load last race',
    importRace: 'Import race',
    version: 'Version',

    back: 'Back',
    settings: 'Settings',
    edit: 'Edit',

    createManually: 'Create manually',
    createFromList: 'Choose from list',
    insertRaceName: 'Enter race name',
    createNewRace: 'Create new race',
    pleaseEnterRaceName: 'Please enter a race name',

    synchronized: 'Synchronized',
    start: 'Start',
    reset: 'Reset',
    selected: 'selected',
    pleaseUnlockFirst: 'Please unlock first',

    syncTime: 'Sync time',
    editHeatsName: 'Edit heat names',
    addHeat: 'Add heat',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    setTime: 'Set time',

    importRaceTitle: 'Import race',
    owner: 'Owner',

    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    general: 'General',
    language: 'Language',
    english: 'English',
    hebrew: 'עברית',
};

export const he: Dictionary = {
    appTitle: 'סטופווטש4',
    startNewRace: 'התחל אירוע חדש',
    loadLastRace: 'טען אירוע אחרון',
    importRace: 'ייבא אירוע',
    version: 'גרסה',

    back: 'חזור',
    settings: 'הגדרות',
    edit: 'ערוך',

    createManually: 'צור אירוע ידנית',
    createFromList: 'צור אירוע מרשימה',
    insertRaceName: 'הכנס שם אירוע',
    createNewRace: 'צור אירוע חדש',
    pleaseEnterRaceName: 'נא להכניס שם אירוע',

    synchronized: 'מסונכרן',
    start: 'התחל',
    reset: 'אפס',
    selected: 'נבחרו',
    pleaseUnlockFirst: 'נא לפתוח נעילה',

    syncTime: 'סנכרן זמן',
    editHeatsName: 'ערוך שמות',
    addHeat: 'הוסף מקצה',
    hours: 'שעות',
    minutes: 'דקות',
    seconds: 'שניות',
    setTime: 'קבע זמן',

    importRaceTitle: 'ייבא אירוע',
    owner: 'בעלים',

    appearance: 'תצוגה',
    darkMode: 'מצב כהה',
    general: 'כללי',
    language: 'שפה',
    english: 'English',
    hebrew: 'עברית',
};

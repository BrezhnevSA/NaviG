
//Map items types
export const OUTER_WALLS_TYPE_ID = 1;
export const DEFAULT_ROOM_TYPE_ID = 2;
export const DESK_OBJECT_TYPE_ID = 1;
export const DEFAULT_NONDESK_OBJECT_TYPE_ID = 23;
export const OBJ_DEFAULT_SCALE = 100;
export const OBJ_MIN_SCALE = 10;
export const OBJ_MAX_SCALE = 200;
export const OBJ_HEGIHT = 50;
export const OBJ_WIDTH = 50;

//Editor settings
export const BG_SLIDER_MAX = 500;
export const BG_SLIDER_DEFAULT = 100;
// export const OBJECT_ROTATION_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
export const OBJECT_ROTATION_ANGLES = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345];
export const LOCATION_WALLS_ANGLES = [0, 22, 45, 77, 90, 112, 135, 157, 180, 202, 225, 247, 270, 292, 315];
export const EDITOR_SVG_SIZE_X = 4000;
export const EDITOR_SVG_SIZE_Y = 4000;
export const GRID_DEFAULT_STEP = 5;
export const CANCEL_ACTION_HISTORY_SIZE = 5;

//Map objects settings
export const LOCATION_LINE_STROKE = '#4b4b4b';
export const LOCATION_LINE_STROKE_WIDTH = '5px';
export const LOCATION_DEFAULT_BG = '#000';

//Search settings
export const DEFAULT_SEARCH_TARGET = 'employees';

// DS ready id meta
export const DS_READY_ID = 9;

// Parking place id meta
export const PARKING_PLACE_ID = 15;

// Not safe place id
export const NOT_SAFE_PLACE_ID = 42;

// Parking place id meta
export const NOTACTIVE_DESK_ID = 17;

// Employee attached to sd place id meta
export const EMPLOYEE_SD_ID = 18;

// Transparency id meta
export const TRANSPARENCY_ID = 19;

// Not open sidebar id meta
export const NOT_OPEN_SIDEBAR_ID = 20;

// Object items that don't have a sidebar
export const OI_LIST_BLOCK = [
    11, // toilet for all
    12, // men toilet
    13, // woman toilet
    27, // lift
    28, // stairs
    43, // kitchen
    44, // metting room
]

// Object items that not shows by default
export const OI_LIST_NOT_SHOW = [
    1,  //desk
    7,  //door without lock
    8,  //door with lock
    11, // toilet for all
    12, // men toilet
    13, // woman toilet
    21, // structure element
    27, // lift
    28, // stairs
    35, // mini meeting room
    39, // perehod
    42, //not safe place
    43, //kitchen
    44, //metting room
]

export const ELIZAVETINSKY_B0_ID = 2;
export const ELIZAVETINSKY_B1_ID = 3;
export const ELIZAVETINSKY_B2_ID = 4;
export const ELIZAVETINSKY_B3_ID = 5;
export const ELIZAVETINSKY_B4_ID = 6;
export const ELIZAVETINSKY_B5_ID = 7;

export const DESKNUM_ID = 10;
export const TYMBNUM_ID = 11;
export const DOCSTATION_ID = 12;
export const MONITOR1_ID = 13;
export const MONITOR2_ID = 14;
export const ENTITY_TYPE = 'ObjectItem';

export const OBJECT_STATE_ID = 16;

export const CONTRACT_ID = 3;

export const SQUARE_ID = 4;

export const INVENTORY_PATH = 'inventory';

export const NOT_SAFE_PLACE_VALUE = 0;
export const TRANSFERED_TO_WAREHOUSE_VALUE = 1;
export const TRANSFERED_TO_AN_EMPLOYEE_VALUE = 2;
export const TO_JUNK_VALUE = 3;

export const MAX_AVAILABLE_DAYS_TO_BOOK = 13;
export const MAX_AVAILABLE_DAYS_TO_BOOK_PARKING = 1;

export const META_CHECKBOX_CHECKED = 'on';
export const META_CHECKBOX_UNCHECKED = 'off';

export const TECHNIQUE_TYPES = [
    26,
    24,
    37,
    3,
    22,
    6,
    2,
    14,
    4,
    45,
    15,
    33,
    9,
    18,

];

export const SERVICE_TYPES = [
    20,
    36,
    43,
    17,
    25,
    7,
    8,
    19,
    28,
    27,
    35,
    23,
    38,
    44,
    39,
    30,
    42,
    5,
    31,
    29,
    34,
    1,
    21,
    13,
    12,
    11,
    10,
    16,
    32
];

export const COMPANY_ID = 21;
export const COMPANIES = [
    "DT IT",
    "T-Systems",
    "DT GBS"
]
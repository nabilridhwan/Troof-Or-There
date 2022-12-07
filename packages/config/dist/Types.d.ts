export declare enum EVENTS {
    JOIN_ROOM = "join_room",
    PLAYERS_UPDATE = "event:players_update",
    DISCONNECTED = "disconnected",
    GAME_UPDATE = "event:game_update",
    START_GAME = "start_game",
    LEFT_GAME = "left_game",
    CHANGE_NAME = "change_name"
}
export declare enum MESSAGE_EVENTS {
    LATEST_MESSAGES = "event:latest_messages",
    MESSAGE_NEW = "message:new",
    MESSAGE_ANSWER = "message:answer",
    MESSAGE_REACTION = "message:reaction",
    MESSAGE_UPDATE = "message:update",
    MESSAGE_DELETE = "message:delete",
    MESSAGE_SYSTEM = "message:system",
    IS_TYPING = "is_typing",
    JOIN = "join"
}
export declare enum TRUTH_OR_DARE_GAME {
    INCOMING_DATA = "incoming_data",
    SELECT_DARE = "select_dare",
    SELECT_TRUTH = "select_truth",
    JOINED = "truth_or_dare_joined",
    CONTINUE = "continue",
    LEAVE_GAME = "leave_game"
}
export declare enum Status {
    In_Lobby = "in_lobby",
    In_Game = "in_game",
    Game_Over = "game_over"
}
export declare enum Action {
    Waiting_For_Selection = "waiting_for_selection",
    Truth = "truth",
    Dare = "dare"
}
export declare enum GameType {
    Truth_Or_Dare = 1
}
export interface RoomIDObject {
    room_id: string;
}
export interface PlayerIDObject {
    player_id: string;
}
export interface PlayerDisplayNameObject {
    display_name: string;
}
export declare type DisconnectedRoomObject = RoomIDObject & PlayerIDObject;
export interface StatusChangeObject extends RoomIDObject {
    status: Status;
}
export interface Player {
    player_id: string;
    display_name: string;
    game_room_id: string;
    is_party_leader: boolean;
    joined_at: Date | null;
}
export interface Room {
    room_id: string;
    status: Status | string;
    room_created_at: Date;
}
export interface Log {
    player_id: string;
    game_room_id: string;
    action: Action | string;
    data: string;
    created_at: Date;
}
declare type MessageTypes = "message" | "answer" | "reaction" | "system" | "reply";
export interface BaseNewMessage extends PlayerDisplayNameObject, RoomIDObject {
    message: string;
    type: MessageTypes | string;
    display_name: string;
    reply_to: string | null;
    created_at: Date;
}
export interface SystemMessage extends BaseNewMessage {
    type: "system";
    created_at: Date;
}
export interface MessageUpdatedFromServer extends BaseNewMessage {
    id: string;
}
export interface ServerToClientEvents {
    [EVENTS.PLAYERS_UPDATE]: (players: Player[]) => void;
    [EVENTS.GAME_UPDATE]: (room: Room) => void;
    [EVENTS.LEFT_GAME]: (playerRemoved: Player) => void;
    [TRUTH_OR_DARE_GAME.INCOMING_DATA]: (log: Log, player: Player) => void;
    [TRUTH_OR_DARE_GAME.LEAVE_GAME]: (room: Room) => void;
    [TRUTH_OR_DARE_GAME.SELECT_TRUTH]: (room: Room) => void;
    [TRUTH_OR_DARE_GAME.SELECT_DARE]: (room: Room) => void;
    [TRUTH_OR_DARE_GAME.CONTINUE]: (log: Log, player: Player) => void;
    [TRUTH_OR_DARE_GAME.JOINED]: (log: Log, player: Player) => void;
    [MESSAGE_EVENTS.MESSAGE_NEW]: (message: MessageUpdatedFromServer) => void;
    [MESSAGE_EVENTS.MESSAGE_ANSWER]: (message: MessageUpdatedFromServer) => void;
    [MESSAGE_EVENTS.MESSAGE_REACTION]: (message: MessageUpdatedFromServer) => void;
    [MESSAGE_EVENTS.MESSAGE_SYSTEM]: (message: SystemMessage) => void;
    [MESSAGE_EVENTS.LATEST_MESSAGES]: (messages: MessageUpdatedFromServer[]) => void;
    [MESSAGE_EVENTS.IS_TYPING]: (obj: PlayerDisplayNameObject & {
        is_typing: boolean;
    }) => void;
}
export interface ClientToServerEvents {
    [EVENTS.GAME_UPDATE]: (obj: StatusChangeObject) => void;
    [EVENTS.PLAYERS_UPDATE]: (obj: StatusChangeObject) => void;
    [EVENTS.DISCONNECTED]: (obj: DisconnectedRoomObject) => void;
    [EVENTS.JOIN_ROOM]: (obj: RoomIDObject) => void;
    [EVENTS.START_GAME]: (obj: RoomIDObject) => void;
    [EVENTS.CHANGE_NAME]: (obj: RoomIDObject & PlayerIDObject & {
        display_name: string;
        new_name: string;
    }) => void;
    [TRUTH_OR_DARE_GAME.LEAVE_GAME]: (obj: RoomIDObject & PlayerIDObject) => void;
    [TRUTH_OR_DARE_GAME.SELECT_TRUTH]: (obj: RoomIDObject & PlayerIDObject) => void;
    [TRUTH_OR_DARE_GAME.SELECT_DARE]: (obj: RoomIDObject & PlayerIDObject) => void;
    [TRUTH_OR_DARE_GAME.CONTINUE]: (obj: RoomIDObject) => void;
    [TRUTH_OR_DARE_GAME.JOINED]: (obj: RoomIDObject & PlayerIDObject) => void;
    [MESSAGE_EVENTS.MESSAGE_NEW]: (obj: BaseNewMessage) => void;
    [MESSAGE_EVENTS.MESSAGE_ANSWER]: (obj: BaseNewMessage) => void;
    [MESSAGE_EVENTS.JOIN]: (obj: RoomIDObject) => void;
    [MESSAGE_EVENTS.MESSAGE_REACTION]: (obj: BaseNewMessage) => void;
    [MESSAGE_EVENTS.IS_TYPING]: (obj: RoomIDObject & PlayerDisplayNameObject & {
        is_typing: boolean;
    }) => void;
}
export {};

export class Player {
    activeRoomIds: string[] = [];

    constructor(public username: string) { }

    addRoom(roomId: string) {
        this.activeRoomIds.push(roomId);
    }

    removeRoom(roomId: string) {
        this.activeRoomIds.splice(this.activeRoomIds.indexOf(roomId), 1);
    }
}
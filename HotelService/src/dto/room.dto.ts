

export type getAvailableRoomsDTO = {
    roomCategoryId : number,
    checkInDate : string,
    checkOutDate : string
}

export type updatingBookingIdToRoomsDTO = {
    bookingId : number,
    roomIds : number[]
}
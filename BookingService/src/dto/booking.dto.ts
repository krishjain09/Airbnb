export type CreateBookingDTO = {
    hotelId: number, 
    totalGuests : number,
    checkInDate : string,
    checkOutDate : string,
    roomCategoryId : string
}
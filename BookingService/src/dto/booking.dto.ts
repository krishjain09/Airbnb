export type CreateBookingDTO = {
    hotelId: number,
    bookingAmount : number , 
    totalGuests : number,
    checkInDate : string,
    checkOutDate : string,
    roomCategoryId : string
}
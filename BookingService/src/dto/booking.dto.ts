export type CreateBookingDTO = {
    userId : number,
    hotelId: number,
    bookingAmount : number , 
    totalGuests : number,
    checkInDate : string,
    checkOutDate : string,
    roomCategoryId : string
}
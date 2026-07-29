export type RentalOrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID" | "RETURNED" | "CANCELLED"

export interface IRentalOrderUserPayload {
    gearItemId: string;
    gearItemPrice: number;
    startDate: Date;
    endDate: Date;
}

export interface IRentalOrder {
    gearItemId: string;
    userId: string;
    rentalOrderStatus: RentalOrderStatus;
    startDate: Date;
    endDate: Date;
    days: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;

}
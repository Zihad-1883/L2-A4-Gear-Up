export type RentalOrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED"

export interface IRentalOrderUserPayload {
    gearItemId: string;
    startDate: Date;
    endDate: Date;
}

export interface IRentalOrder {
    gearItemId: string;
    customerId: string;
    providerId: string;
    rentalOrderStatus: RentalOrderStatus;
    startDate: Date;
    endDate: Date;
    days: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;

}
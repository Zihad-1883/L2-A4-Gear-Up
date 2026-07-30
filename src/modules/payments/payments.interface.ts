export interface IPaymentInitiatePayload {
    rentalOrderId: string;
}

export interface ISSLCommerzCallbackPayload {
    val_id?: string;
    tran_id?: string;
    amount?: string;
    card_type?: string;
    store_id?: string;
    bank_tran_id?: string;
    status?: string;
    tran_date?: string;
    error?: string;
}

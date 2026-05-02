import { Xendit, Invoice as InvoiceClient } from 'xendit-node';

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || '',
});

const { Invoice } = xenditClient;

export interface CreateInvoiceParams {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  customerName: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export async function createXenditInvoice(params: CreateInvoiceParams) {
  try {
    const response = await Invoice.createInvoice({
      data: {
        externalID: params.externalId,
        amount: params.amount,
        payerEmail: params.payerEmail,
        description: params.description,
        customer: {
          givenNames: params.customerName,
        },
        invoiceDuration: 86400, // 24 hours
        currency: 'IDR',
        reminderTime: 1,
        successRedirectUrl: params.successRedirectUrl || `${process.env.NEXTAUTH_URL}/pesanan/sukses`,
        failureRedirectUrl: params.failureRedirectUrl || `${process.env.NEXTAUTH_URL}/pesanan/gagal`,
      },
    });

    return response;
  } catch (error: any) {
    console.error('Xendit Error:', error);
    throw new Error(error.message || 'Gagal membuat invoice Xendit');
  }
}

export async function getXenditInvoice(invoiceId: string) {
  try {
    const response = await Invoice.getInvoice({
      invoiceID: invoiceId,
    });
    return response;
  } catch (error: any) {
    console.error('Xendit Get Invoice Error:', error);
    throw new Error(error.message || 'Gagal mengambil data invoice Xendit');
  }
}


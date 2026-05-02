import { NextResponse } from 'next/server';
import { Xendit } from 'xendit-node';

export async function GET() {
  try {
    const xenditClient = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY || '',
    });

    const { Balance } = xenditClient;

    // Test connection by fetching balance
    const response = await Balance.getBalance({
      accountType: 'CASH',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Koneksi Xendit Berhasil!',
      balance: response.balance
    });
  } catch (error: any) {
    console.error('Xendit Test Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Gagal terhubung ke Xendit. Periksa Secret Key Anda.' 
    }, { status: 500 });
  }
}

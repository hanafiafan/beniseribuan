'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { OrderInvoice } from './OrderInvoice'
import { Printer, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface InvoiceButtonProps {
  order: any
}

export default function InvoiceButton({ order }: InvoiceButtonProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Avoid hydration mismatch for PDF components
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-100 font-bold text-gray-400 cursor-not-allowed">
        <Printer className="w-4 h-4" />
        Invoice
      </button>
    )
  }

  return (
    <PDFDownloadLink 
      document={<OrderInvoice order={order} />} 
      fileName={`Invoice-${order.orderNumber}.pdf`}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-brand-100 bg-brand-50 font-bold text-brand-700 hover:bg-brand-100 transition-all"
    >
      {({ blob, url, loading, error }) => 
        loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Menyiapkan...
          </>
        ) : (
          <>
            <Printer className="w-4 h-4" />
            Download Invoice
          </>
        )
      }
    </PDFDownloadLink>
  )
}

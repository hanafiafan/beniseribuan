import { 
  Document, Page, Text, View, StyleSheet, 
  Image, Font 
} from '@react-pdf/renderer'

// Registering fonts if needed, otherwise use defaults
// Font.register({ family: 'Inter', src: '...' })

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  brandSub: {
    fontSize: 8,
    color: '#6b7280',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#111827',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBox: {
    width: '45%',
  },
  label: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 10,
    color: '#111827',
    marginBottom: 2,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: 1,
    borderBottomColor: '#f3f4f6',
  },
  colProduct: { width: '50%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  summarySection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  summaryBox: {
    width: '40%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: 2,
    borderTopColor: '#15803d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  footer: {
    marginTop: 60,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
  },
  badge: {
    padding: '4 8',
    borderRadius: 4,
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: 8,
    fontWeight: 'bold',
  }
})

interface InvoiceProps {
  order: any
}

export const OrderInvoice = ({ order }: InvoiceProps) => {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val)
  }

  const shipping = order.shippingAddress || {}

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>Benih Seribuan</Text>
            <Text style={styles.brandSub}>Fresh & Quality Seeds Platform</Text>
            <Text style={{ fontSize: 7, marginTop: 10, color: '#9ca3af' }}>
              Boyolali, Jawa Tengah, Indonesia
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={{ textAlign: 'right', marginTop: 4, color: '#6b7280' }}>
              #{order.orderNumber}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Ditagihkan Ke:</Text>
            <Text style={[styles.value, { fontWeight: 'bold' }]}>{shipping.recipientName}</Text>
            <Text style={styles.value}>{shipping.phone}</Text>
            <Text style={styles.value}>
              {shipping.address}, {shipping.district}
            </Text>
            <Text style={styles.value}>
              {shipping.city}, {shipping.province}, {shipping.postalCode}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Detail Pesanan:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Tanggal:</Text>
              <Text style={styles.value}>
                {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Metode Bayar:</Text>
              <Text style={styles.value}>{order.paymentMethod || 'Transfer'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 8, color: '#6b7280' }}>Status:</Text>
              <Text style={[styles.value, { color: '#15803d', fontWeight: 'bold' }]}>
                {order.status === 'paid' ? 'LUNAS' : order.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colProduct}>Produk</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Harga</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {order.items.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colProduct}>
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                {item.variantName && (
                  <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>
                    Varian: {item.variantName}
                  </Text>
                )}
              </View>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatIDR(Number(item.price))}</Text>
              <Text style={styles.colTotal}>{formatIDR(Number(item.price) * item.quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={{ color: '#6b7280' }}>Subtotal</Text>
              <Text>{formatIDR(Number(order.subtotal))}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ color: '#6b7280' }}>Ongkos Kirim</Text>
              <Text>{formatIDR(Number(order.shippingCost))}</Text>
            </View>
            {Number(order.discount) > 0 && (
              <View style={styles.summaryRow}>
                <Text style={{ color: '#ef4444' }}>Diskon</Text>
                <Text style={{ color: '#ef4444' }}>-{formatIDR(Number(order.discount))}</Text>
              </View>
            )}
            <View style={styles.grandTotal}>
              <Text>TOTAL TAGIHAN</Text>
              <Text>{formatIDR(Number(order.total))}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Terima kasih telah berbelanja di Benih Seribuan.</Text>
          <Text style={{ marginTop: 4 }}>
            Ini adalah dokumen resmi yang dihasilkan secara otomatis dan tidak memerlukan tanda tangan basah.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: 'Helvetica' },
  container: { border: 2, borderColor: '#000', padding: 15, borderRadius: 8 },
  header: { borderBottom: 2, pb: 10, mb: 10, flexDirection: 'row', justifyContent: 'space-between' },
  logo: { fontSize: 16, fontWeight: 'bold' },
  section: { marginBottom: 15 },
  label: { fontSize: 10, color: '#666', marginBottom: 2, textTransform: 'uppercase' },
  boldText: { fontWeight: 'bold', fontSize: 14 },
  footer: { borderTop: 1, pt: 10, marginTop: 10, fontSize: 10, textAlign: 'center' },
})

export const ShippingLabel = ({ order }: { order: any }) => (
  <Document>
    <Page size={[400, 600]} style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>BENIH SERIBUAN</Text>
          <Text>{order.shippingDetails?.courier?.toUpperCase() || 'REG'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Penerima:</Text>
          <Text style={styles.boldText}>{order.user?.firstName} {order.user?.lastName}</Text>
          <Text>{order.shippingDetails?.address}</Text>
          <Text>{order.shippingDetails?.city}</Text>
          <Text>Telp: {order.user?.phone || '-'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pengirim:</Text>
          <Text style={{ fontWeight: 'bold' }}>BENIH SERIBUAN (OFFICIAL)</Text>
          <Text>Boyolali, Jawa Tengah</Text>
          <Text>Telp: 0812-xxxx-xxxx</Text>
        </View>

        <View style={{ borderTop: 1, borderBottom: 1, paddingVertical: 10, mb: 10 }}>
          <Text style={styles.label}>No. Resi / Order:</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{order.orderNumber}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Terima kasih telah berbelanja di Benih Seribuan!</Text>
        </View>
      </View>
    </Page>
  </Document>
)

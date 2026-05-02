import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, pb: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#059669' },
  section: { marginBottom: 10 },
  label: { fontWeight: 'bold', marginBottom: 2 },
  table: { display: 'flex', width: 'auto', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 5 },
  tableHeader: { fontWeight: 'bold', backgroundColor: '#f9fafb' },
  col1: { width: '60%' },
  col2: { width: '20%', textAlign: 'center' },
  col3: { width: '20%', textAlign: 'right' },
})

export const PackingSlip = ({ order }: { order: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>SURAT PESANAN - BENIH SERIBUAN</Text>
        <Text>No. Pesanan: {order.orderNumber}</Text>
        <Text>Tanggal: {new Date(order.createdAt).toLocaleDateString('id-ID')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Penerima:</Text>
        <Text>{order.user?.firstName} {order.user?.lastName}</Text>
        <Text>{order.shippingDetails?.address}</Text>
        <Text>{order.shippingDetails?.city}</Text>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.col1}>Produk</Text>
          <Text style={styles.col2}>Jumlah</Text>
          <Text style={styles.col3}>Berat</Text>
        </View>
        {order.items?.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col1}>{item.product?.name || item.name}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{item.weight || 0} gr</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 30 }}>
        <Text>Catatan Gudang: ___________________________________</Text>
      </View>
    </Page>
  </Document>
)

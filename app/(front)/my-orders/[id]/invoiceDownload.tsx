import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Roboto font
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-VariableFont_wdth,wght.ttf", // Ensure this path is correct
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  section: {
    marginBottom: 14,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  bold: {
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCell: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 6,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    textAlign: "center",
  },
  totalWrapper: {
    marginTop: 4,
    marginLeft: "50%",
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
  },
  totalPaidRow: {
    borderTop: "1px dashed #ccc",
    marginTop: 8,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: "#f8f8f8",
    padding: 10,
    fontSize: 10,
    color: "#555",
    textAlign: "center",
    borderTop: "1px solid #eee",
  },
});

interface Address {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Item {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  orderNumber: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  billingDetails: BillingDetails;
  shippingAddress: ShippingAddress;
  items: Item[];
  invoice_id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    provider: string;
    isAdmin: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

interface BillingDetails {
  sameAsShipping: boolean;
  firstName: string;
  lastName: string;
  address: string;
  landmark?: string;
  country?: string;
  state: string;
  city: string;
  postalCode: string;
}

interface ShippingAddress {
  address: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

const InvoicePDF = ({ order }: { order: Order }) => {
  const gstRate = 0.03;
  const gstAmount = order.totalPrice - order.totalPrice / (1 + gstRate);
  const priceExclGST = order.totalPrice - gstAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Kelayaa</Text>
          <Text>Invoice #{order.invoice_id}</Text>
          <Text>
            Date: {new Date(order.createdAt).toLocaleDateString()}{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </Text>
        </View>

        {/* Addresses */}
        <View
          style={[
            styles.section,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          {/* Billing Address */}
          <View style={{ width: "48%" }}>
            <Text style={styles.bold}>Billing Details</Text>
            {order.billingDetails.sameAsShipping ? (
              <>
                <Text style={[styles.bold, { marginTop: 4 }]}>
                  {order.user?.name}
                </Text>
                <Text>{order.user?.mobileNumber}</Text>
                {/* <Text style={{ marginTop: 4, fontWeight: "600" }}>Address</Text> */}
                <Text>{order.shippingAddress.address}</Text>
                <Text>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.postalCode}
                </Text>
              </>
            ) : (
              <>
                <Text style={[styles.bold, { marginTop: 4 }]}>
                  {order.billingDetails.firstName}{" "}
                  {order.billingDetails.lastName}
                </Text>
                {/* If phone exists in billingDetails, you can include it here */}
                {/* <Text style={{ marginTop: 4, fontWeight: "600" }}>Address</Text> */}
                <Text>{order.billingDetails.address}</Text>
                <Text>
                  {order.billingDetails.city}, {order.billingDetails.state} -{" "}
                  {order.billingDetails.postalCode}
                </Text>
              </>
            )}
          </View>

          {/* Shipping Address */}
          <View style={{ width: "48%" }}>
            <Text style={styles.bold}>Shipping Details</Text>
            <Text style={[styles.bold, { marginTop: 4 }]}>
              {order.user?.name}
            </Text>
            <Text>{order.user?.mobileNumber}</Text>
            {/* <Text style={{ marginTop: 4, fontWeight: "600" }}>Address</Text> */}
            <Text>{order.shippingAddress.address}</Text>
            <Text>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.postalCode}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>Item</Text>
            <Text style={styles.tableHeaderCell}>Qty</Text>
            <Text style={styles.tableHeaderCell}>Unit (₹)</Text>
            <Text style={styles.tableHeaderCell}>Total (₹)</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { textAlign: "left", paddingLeft: 10 },
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.tableCell}>{item.qty}</Text>
              <Text style={styles.tableCell}>₹{item.price.toFixed(2)}</Text>
              <Text style={styles.tableCell}>
                ₹{(item.qty * item.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalWrapper}>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>Subtotal</Text>
            <Text>₹{priceExclGST.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>GST (3% Included)</Text>
            <Text>₹{gstAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalPaidRow}>
            <Text style={{ fontWeight: "bold" }}>Total Amount Paid</Text>
            <Text style={{ fontWeight: "bold" }}>
              ₹{order.totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Thank you for your purchase! For support, contact
            support@kelayaa.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const Invoice = ({ order }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        ~ {new Date().toLocaleString()} ~
      </Text>
      <Text style={styles.title}>Order Invoice</Text>
      <Text style={styles.author}>React Redux Ecommerce</Text>
      <Text style={styles.subtitle}>Order Summary</Text>

      {/* Table Header */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text>Title</Text></View>
          <View style={styles.tableColHeader}><Text>Price</Text></View>
          <View style={styles.tableColHeader}><Text>Quantity</Text></View>
          <View style={styles.tableColHeader}><Text>Material</Text></View>
          <View style={styles.tableColHeader}><Text>Stone</Text></View>
        </View>

        {/* Table Body */}
        {order.products.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}><Text>{item.product.title}</Text></View>
            <View style={styles.tableCol}><Text>${item.product.price}</Text></View>
            <View style={styles.tableCol}><Text>{item.count}</Text></View>
            <View style={styles.tableCol}><Text>{item.product.material}</Text></View>
            <View style={styles.tableCol}><Text>{item.product.stone}</Text></View>
          </View>
        ))}
      </View>

      <Text style={styles.text}>
        <Text>Date: {"               "}{new Date(order.paymentIntent.created * 1000).toLocaleString()}</Text>
        {"\n"}
        <Text>Order Id: {"         "}{order.paymentIntent.id}</Text>
        {"\n"}
        <Text>Order Status: {"  "}{order.orderStatus}</Text>
        {"\n"}
        <Text>Total Paid: {"       "}{order.paymentIntent.amount}</Text>
      </Text>

      <Text style={styles.footer}> ~ Thank you for shopping with us ~ </Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    padding: "100px",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: { 
    flexDirection: "row" 
  },
  tableColHeader: { 
    width: "20%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
  tableCol: { 
    width: "20%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
});

export default Invoice;

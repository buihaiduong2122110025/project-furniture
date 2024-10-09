import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from '@/firebaseConfig';

const db = getFirestore(app);

// Define your interfaces
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string; // Assuming this is a URL string
}

interface Order {
    userEmail: string;
    timestamp: string; // Adjust the type if you're using Date objects
    items: OrderItem[];
    totalAmount: number;
}

const MyOrderScreen = ({ route, navigation }: { route: any, navigation: any }) => {
    const [activeTab, setActiveTab] = useState('Delivered');
    const [orderList, setOrderList] = useState<Order[]>([]); // Use the Order interface here

    // Hàm lấy danh sách đơn hàng từ Firestore
    const getOrderList = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'orders'));
            const orders: Order[] = []; // Ensure you're using the Order type
            querySnapshot.forEach((doc) => {
                orders.push(doc.data() as Order); // Cast the data to the Order type
            });
            setOrderList(orders);
        } catch (error) {
            console.error("Error fetching orders: ", error);
        }
    };

    useEffect(() => {
        getOrderList();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>My Order</Text>
            </View>
            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity onPress={() => setActiveTab('Delivered')}>
                    <Text style={activeTab === 'Delivered' ? styles.activeTab : styles.inactiveTab}>Delivered</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Processing')}>
                    <Text style={activeTab === 'Processing' ? styles.activeTab : styles.inactiveTab}>Processing</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('Canceled')}>
                    <Text style={activeTab === 'Canceled' ? styles.activeTab : styles.inactiveTab}>Canceled</Text>
                </TouchableOpacity>
            </View>

            {/* Order Cards */}
            {orderList.length > 0 ? orderList.map((order, index) => (
                <View key={index} style={styles.orderCard}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>Order No. {order.userEmail}</Text>
                        <Text style={styles.orderDate}>{order.timestamp}</Text>
                    </View>
                    <View style={styles.orderDetails}>
                        {order.items.map((item, itemIndex) => (
                            <View key={item.id} style={styles.orderItem}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    {/* <Text style={styles.itemPrice}>${item.price}</Text>
                                    <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text> */}
                                </View>
                            </View>
                        ))}
                        <Text style={styles.orderDetailText}>Total Amount: ${order.totalAmount}</Text>
                    </View>
                    <View style={styles.orderActions}>
                        <TouchableOpacity style={styles.detailButton}
                            onPress={() => navigation.navigate('OrderDetail', { orderData: { ...order, orderId: `ORD-${index + 1}` } })} // Tạo ID giả
                            >
                            <Text style={styles.detailButtonText}>View Details</Text>
                        </TouchableOpacity>
                        <Text style={styles.orderStatus}>{activeTab}</Text>
                    </View>
                </View>
            )) : <Text>No orders found</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    header: {
        width: 225,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        marginTop: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    activeTab: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingBottom: 5,
    },
    inactiveTab: {
        fontSize: 16,
        color: '#888',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    orderInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 14,
        color: '#888',
    },
    orderDetails: {
        marginBottom: 15,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 12,
        color: '#E29547',
    },
    itemQuantity: {
        fontSize: 12,
        color: '#666',
    },
    orderActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailButton: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    detailButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    orderStatus: {
        fontSize: 14,
        color: '#00a000',
        fontWeight: 'bold',
    },
    orderDetailText:{}
});

export default MyOrderScreen;

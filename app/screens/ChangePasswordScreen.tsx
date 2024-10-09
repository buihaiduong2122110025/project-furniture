import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { getAuth, updatePassword } from "firebase/auth";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có giống nhau không
    if (newPassword !== confirmPassword) {
      Alert.alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (user) {
      try {
        await updatePassword(user, newPassword);
        Alert.alert("Mật khẩu đã được cập nhật thành công!");
      } catch (error) {
        Alert.alert("Lỗi khi cập nhật mật khẩu: ", error.message);
      }
    } else {
      Alert.alert("Người dùng chưa đăng nhập.");
    }
  };

  return (
    <View style={styles.container}>
      <Title>Đổi Mật Khẩu</Title>
      <TextInput
        label="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
        Đổi Mật Khẩu
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default ChangePassword;

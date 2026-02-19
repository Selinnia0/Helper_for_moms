import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AyarlarEkrani() {
  const [ad, setAd] = useState('');
  const [dogumTarihi, setDogumTarihi] = useState(new Date());
  const [pickerAcik, setPickerAcik] = useState(false);
  const [bildirim, setBildirim] = useState(true);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('kullaniciAdi').then(v => { if (v) setAd(v); });
    AsyncStorage.getItem('dogumTarihi').then(v => { if (v) setDogumTarihi(new Date(v)); });
    AsyncStorage.getItem('bildirim').then(v => { if (v) setBildirim(v === 'true'); });
  }, []));

  const kaydet = async () => {
    await AsyncStorage.setItem('kullaniciAdi', ad);
    await AsyncStorage.setItem('dogumTarihi', dogumTarihi.toISOString());
    await AsyncStorage.setItem('bildirim', bildirim.toString());
    Alert.alert('Kaydedildi ✅', 'Ayarların güncellendi!');
  };

  const veriSifirla = () => {
    Alert.alert(
      'Tüm Verileri Sil',
      'Tüm kayıtlar silinecek. Emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet, Sil', style: 'destructive', onPress: async () => {
            await AsyncStorage.multiRemove(['gunlukKayitlar', 'beslemeKayitlar', 'panasKayitlari']);
            Alert.alert('Silindi', 'Tüm veriler silindi.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Ayarlar</Text>
        <Text style={styles.subText}>Kişisel bilgilerini güncelle</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

        <View style={styles.inputGrup}>
          <Text style={styles.label}>Adın</Text>
          <TextInput
            style={styles.input}
            placeholder="Adını yaz..."
            value={ad}
            onChangeText={setAd}
          />
        </View>

        <View style={styles.inputGrup}>
          <Text style={styles.label}>Tahmini Doğum Tarihi</Text>
          <TouchableOpacity style={styles.tarihBtn} onPress={() => setPickerAcik(true)}>
            <Ionicons name="calendar-outline" size={20} color="#EC407A" />
            <Text style={styles.tarihText}>
              {dogumTarihi.toLocaleDateString('tr-TR')}
            </Text>
          </TouchableOpacity>
        </View>

        {pickerAcik && (
          <DateTimePicker
            value={dogumTarihi}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setPickerAcik(false);
              if (date) setDogumTarihi(date);
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tercihler</Text>
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Bildirimler</Text>
            <Text style={styles.switchAlt}>Günlük hatırlatmalar</Text>
          </View>
          <Switch
            value={bildirim}
            onValueChange={setBildirim}
            trackColor={{ false: '#ddd', true: '#FCE4EC' }}
            thumbColor={bildirim ? '#EC407A' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.kaydetBtn} onPress={kaydet}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.kaydetText}>Kaydet</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tehlikeli Bölge</Text>
        <TouchableOpacity style={styles.silBtn} onPress={veriSifirla}>
          <Ionicons name="trash-outline" size={20} color="#F44336" />
          <Text style={styles.silText}>Tüm Verileri Sil</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#7E57C2', padding: 24, paddingTop: 60,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 13, color: '#D1C4E9', marginTop: 4 },
  section: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16,
    padding: 16, shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 6, elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  inputGrup: { marginBottom: 16 },
  label: { fontSize: 13, color: '#888', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    padding: 12, fontSize: 15, color: '#333', backgroundColor: '#fafafa',
  },
  tarihBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    padding: 12, backgroundColor: '#fafafa',
  },
  tarihText: { fontSize: 15, color: '#333' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  switchLabel: { fontSize: 15, color: '#333', fontWeight: '600' },
  switchAlt: { fontSize: 12, color: '#999', marginTop: 2 },
  kaydetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#EC407A', margin: 16,
    padding: 16, borderRadius: 16,
  },
  kaydetText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  silBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#FFCDD2', borderRadius: 12,
    padding: 14, backgroundColor: '#FFF5F5',
  },
  silText: { color: '#F44336', fontWeight: '600', fontSize: 15 },
});

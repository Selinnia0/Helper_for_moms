import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

type Kayit = { id: string; tarih: string; metin: string };

export default function GunlukEkrani() {
  const [kayitlar, setKayitlar] = useState<Kayit[]>([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [metin, setMetin] = useState('');

  const yukle = async () => {
    const str = await AsyncStorage.getItem('gunlukKayitlar');
    if (str) setKayitlar(JSON.parse(str));
  };

  useFocusEffect(useCallback(() => { yukle(); }, []));

  const kaydet = async () => {
    if (!metin.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir şeyler yaz!');
      return;
    }
    const yeniKayit: Kayit = {
      id: Date.now().toString(),
      tarih: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      metin: metin.trim(),
    };
    const yeniListe = [yeniKayit, ...kayitlar];
    setKayitlar(yeniListe);
    await AsyncStorage.setItem('gunlukKayitlar', JSON.stringify(yeniListe));
    setMetin('');
    setModalAcik(false);
  };

  const sil = async (id: string) => {
    Alert.alert('Sil', 'Bu kaydı silmek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          const yeni = kayitlar.filter(k => k.id !== id);
          setKayitlar(yeni);
          await AsyncStorage.setItem('gunlukKayitlar', JSON.stringify(yeni));
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bebeğim İçin Günlük</Text>
        <Text style={styles.subText}>Bebeğine özel notların</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {kayitlar.length === 0 && (
          <View style={styles.bos}>
            <Ionicons name="journal-outline" size={64} color="#ccc" />
            <Text style={styles.bosText}>Henüz kayıt yok</Text>
            <Text style={styles.bosAlt}>Sağ alttaki + butonuna tıkla</Text>
          </View>
        )}
        {kayitlar.map((k) => (
          <View key={k.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.tarih}>{k.tarih}</Text>
              <TouchableOpacity onPress={() => sil(k.id)}>
                <Ionicons name="trash-outline" size={18} color="#ccc" />
              </TouchableOpacity>
            </View>
            <Text style={styles.baslik}>Bebeğim için bugün … yaptım.</Text>
            <Text style={styles.icerik}>{k.metin}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalAcik(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalAcik} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalBaslik}>Bebeğim için bugün … yaptım.</Text>
            <TextInput
              style={styles.input}
              placeholder="Yazınız..."
              multiline
              numberOfLines={5}
              value={metin}
              onChangeText={setMetin}
              textAlignVertical="top"
            />
            <View style={styles.modalButonlar}>
              <TouchableOpacity style={styles.iptalBtn} onPress={() => { setModalAcik(false); setMetin(''); }}>
                <Text style={styles.iptalText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.kaydetBtn} onPress={kaydet}>
                <Text style={styles.kaydetText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: {
    backgroundColor: '#EC407A', padding: 24, paddingTop: 60,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 13, color: '#FFD6E5', marginTop: 4 },
  scroll: { flex: 1 },
  bos: { alignItems: 'center', marginTop: 80 },
  bosText: { fontSize: 18, color: '#ccc', marginTop: 16 },
  bosAlt: { fontSize: 13, color: '#ddd', marginTop: 4 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  tarih: { fontSize: 12, color: '#999' },
  baslik: { fontSize: 13, color: '#EC407A', fontWeight: '600', marginBottom: 6 },
  icerik: { fontSize: 15, color: '#333', lineHeight: 22 },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    backgroundColor: '#EC407A', width: 56, height: 56,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#EC407A', shadowOpacity: 0.4, shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 24, width: '100%',
  },
  modalBaslik: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: '#eee', borderRadius: 12,
    padding: 12, fontSize: 15, minHeight: 120, color: '#333',
  },
  modalButonlar: { flexDirection: 'row', gap: 12, marginTop: 16 },
  iptalBtn: {
    flex: 1, padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#EC407A', alignItems: 'center',
  },
  iptalText: { color: '#EC407A', fontWeight: 'bold' },
  kaydetBtn: {
    flex: 1, padding: 12, borderRadius: 12,
    backgroundColor: '#EC407A', alignItems: 'center',
  },
  kaydetText: { color: '#fff', fontWeight: 'bold' },
});

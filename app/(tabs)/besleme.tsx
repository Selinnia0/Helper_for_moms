import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Alert
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

const TURLER = ['Meme', 'Biberon', 'Mama'];
type Kayit = { id: string; tarih: string; tur: string; sure: number; miktar: number };

export default function BeslemeEkrani() {
  const [kayitlar, setKayitlar] = useState<Kayit[]>([]);
  const [modalAcik, setModalAcik] = useState(false);
  const [tur, setTur] = useState('Meme');
  const [sure, setSure] = useState(10);
  const [miktar, setMiktar] = useState(50);

  const yukle = async () => {
    const str = await AsyncStorage.getItem('beslemeKayitlar');
    if (str) setKayitlar(JSON.parse(str));
  };

  useFocusEffect(useCallback(() => { yukle(); }, []));

  const kaydet = async () => {
    const yeniKayit: Kayit = {
      id: Date.now().toString(),
      tarih: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      tur, sure, miktar: tur === 'Biberon' ? miktar : 0,
    };
    const yeniListe = [yeniKayit, ...kayitlar];
    setKayitlar(yeniListe);
    await AsyncStorage.setItem('beslemeKayitlar', JSON.stringify(yeniListe));
    setModalAcik(false);
    setSure(10); setMiktar(50); setTur('Meme');
  };

  const sil = async (id: string) => {
    Alert.alert('Sil', 'Bu kaydı silmek istiyor musun?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          const yeni = kayitlar.filter(k => k.id !== id);
          setKayitlar(yeni);
          await AsyncStorage.setItem('beslemeKayitlar', JSON.stringify(yeni));
        }
      }
    ]);
  };

  const turRengi = (t: string) => {
    if (t === 'Meme') return '#EC407A';
    if (t === 'Biberon') return '#42A5F5';
    return '#66BB6A';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Besleme Takibi</Text>
        <Text style={styles.subText}>Bebeğinin beslenme kayıtları</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {kayitlar.length === 0 && (
          <View style={styles.bos}>
            <Ionicons name="nutrition-outline" size={64} color="#ccc" />
            <Text style={styles.bosText}>Henüz kayıt yok</Text>
          </View>
        )}
        {kayitlar.map((k) => (
          <View key={k.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.turBadge, { backgroundColor: turRengi(k.tur) + '22' }]}>
                <Text style={[styles.turText, { color: turRengi(k.tur) }]}>{k.tur}</Text>
              </View>
              <Text style={styles.tarih}>{k.tarih}</Text>
              <TouchableOpacity onPress={() => sil(k.id)}>
                <Ionicons name="trash-outline" size={18} color="#ccc" />
              </TouchableOpacity>
            </View>
            <View style={styles.detayRow}>
              <View style={styles.detay}>
                <Ionicons name="time-outline" size={16} color="#888" />
                <Text style={styles.detayText}>{k.sure} dk</Text>
              </View>
              {k.tur === 'Biberon' && (
                <View style={styles.detay}>
                  <Ionicons name="water-outline" size={16} color="#888" />
                  <Text style={styles.detayText}>{k.miktar} mL</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setModalAcik(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalAcik} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalBaslik}>Yeni Besleme Kaydı</Text>

            <Text style={styles.label}>Tür Seç:</Text>
            <View style={styles.turRow}>
              {TURLER.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.turBtn, tur === t && { backgroundColor: turRengi(t) }]}
                  onPress={() => setTur(t)}
                >
                  <Text style={[styles.turBtnText, tur === t && { color: '#fff' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Süre: <Text style={{ color: '#EC407A', fontWeight: 'bold' }}>{sure} dk</Text></Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1} maximumValue={60} step={1}
              value={sure} onValueChange={(v) => setSure(Math.round(v))}
              minimumTrackTintColor="#EC407A" thumbTintColor="#EC407A"
            />

            {tur === 'Biberon' && (
              <>
                <Text style={styles.label}>Miktar: <Text style={{ color: '#42A5F5', fontWeight: 'bold' }}>{miktar} mL</Text></Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={10} maximumValue={300} step={10}
                  value={miktar} onValueChange={(v) => setMiktar(Math.round(v))}
                  minimumTrackTintColor="#42A5F5" thumbTintColor="#42A5F5"
                />
              </>
            )}

            <View style={styles.modalButonlar}>
              <TouchableOpacity style={styles.iptalBtn} onPress={() => setModalAcik(false)}>
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
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  header: {
    backgroundColor: '#42A5F5', padding: 24, paddingTop: 60,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 13, color: '#BBDEFB', marginTop: 4 },
  scroll: { flex: 1 },
  bos: { alignItems: 'center', marginTop: 80 },
  bosText: { fontSize: 18, color: '#ccc', marginTop: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 12, shadowColor: '#000',
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  turBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  turText: { fontSize: 12, fontWeight: 'bold' },
  tarih: { flex: 1, fontSize: 12, color: '#999' },
  detayRow: { flexDirection: 'row', gap: 16 },
  detay: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detayText: { fontSize: 14, color: '#555' },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    backgroundColor: '#42A5F5', width: 56, height: 56,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff', borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24,
  },
  modalBaslik: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 4, marginTop: 8 },
  turRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  turBtn: {
    flex: 1, padding: 10, borderRadius: 12,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  turBtnText: { color: '#555', fontWeight: '600' },
  modalButonlar: { flexDirection: 'row', gap: 12, marginTop: 20 },
  iptalBtn: {
    flex: 1, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#42A5F5', alignItems: 'center',
  },
  iptalText: { color: '#42A5F5', fontWeight: 'bold' },
  kaydetBtn: {
    flex: 1, padding: 14, borderRadius: 12,
    backgroundColor: '#42A5F5', alignItems: 'center',
  },
  kaydetText: { color: '#fff', fontWeight: 'bold' },
});

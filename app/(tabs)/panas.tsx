import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const DUYGULAR = [
  'İlgili', 'Sıkıntılı', 'Heyecanlı', 'Mutsuz', 'Güçlü',
  'Suçlu', 'Hevesli', 'Gururlu', 'Gergin', 'Aktif',
  'Sinirli', 'Uyanık', 'Utanmış', 'İlhamlı', 'Kararlı',
  'Odaklanmış', 'Titrek', 'Korkmuş', 'Coşkulu', 'Endişeli',
];

const ETIKETLER = ['Hiç', 'Biraz', 'Ortalama', 'Oldukça', 'Çok Fazla'];

export default function PanasEkrani() {
  const [degerler, setDegerler] = useState<number[]>(new Array(DUYGULAR.length).fill(0));

  const guncelle = (index: number, value: number) => {
    const yeni = [...degerler];
    yeni[index] = Math.round(value);
    setDegerler(yeni);
  };

  const kaydet = async () => {
    const kayit = {
      tarih: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR'),
      degerler: DUYGULAR.map((ad, i) => ({ ad, puan: degerler[i] })),
    };
    const mevcutStr = await AsyncStorage.getItem('panasKayitlari');
    const mevcut = mevcutStr ? JSON.parse(mevcutStr) : [];
    mevcut.unshift(kayit);
    await AsyncStorage.setItem('panasKayitlari', JSON.stringify(mevcut));
    Alert.alert('Kaydedildi ✅', 'Duygu durumun kaydedildi!');
    setDegerler(new Array(DUYGULAR.length).fill(0));
  };

  const sifirla = () => {
    setDegerler(new Array(DUYGULAR.length).fill(0));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PANAS Duygu Testi</Text>
        <Text style={styles.subText}>Her duygu için uygun puanı seç</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {DUYGULAR.map((duygu, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.duyguAd}>{index + 1}. {duygu}</Text>
            <View style={styles.etiketRow}>
              {ETIKETLER.map((e, i) => (
                <Text key={i} style={styles.etiket}>{e}</Text>
              ))}
            </View>
            <View style={styles.numRow}>
              {[0, 1, 2, 3, 4].map((n) => (
                <Text key={n} style={styles.num}>{n}</Text>
              ))}
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={4}
              step={1}
              value={degerler[index]}
              onValueChange={(val) => guncelle(index, val)}
              minimumTrackTintColor="#EC407A"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#EC407A"
            />
            <Text style={styles.secilen}>
              Seçilen: <Text style={{ fontWeight: 'bold', color: '#EC407A' }}>{ETIKETLER[degerler[index]]}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.butonRow}>
        <TouchableOpacity style={styles.iptalBtn} onPress={sifirla}>
          <Text style={styles.iptalText}>Sıfırla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.kaydetBtn} onPress={kaydet}>
          <Text style={styles.kaydetText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9' },
  header: {
    backgroundColor: '#66BB6A',
    padding: 24, paddingTop: 60,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 13, color: '#C8E6C9', marginTop: 4 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 6, elevation: 2,
  },
  duyguAd: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  etiketRow: { flexDirection: 'row', justifyContent: 'space-between' },
  etiket: { fontSize: 9, color: '#999', textAlign: 'center', flex: 1 },
  numRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  num: { fontSize: 12, color: '#666', flex: 1, textAlign: 'center' },
  secilen: { fontSize: 13, color: '#888', textAlign: 'right', marginTop: 4 },
  butonRow: {
    flexDirection: 'row', padding: 16, gap: 12,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
  },
  iptalBtn: {
    flex: 1, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#66BB6A', alignItems: 'center',
  },
  iptalText: { color: '#66BB6A', fontWeight: 'bold', fontSize: 16 },
  kaydetBtn: {
    flex: 1, padding: 14, borderRadius: 12,
    backgroundColor: '#66BB6A', alignItems: 'center',
  },
  kaydetText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

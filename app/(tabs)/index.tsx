import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function AnaSayfa() {
  const [hafta, setHafta] = useState(0);
  const [ad, setAd] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('dogumTarihi').then((val) => {
      if (val) {
        const dogum = new Date(val);
        const bugun = new Date();
        const fark = Math.floor((dogum.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24 * 7));
        setHafta(40 - fark);
      }
    });
    AsyncStorage.getItem('kullaniciAdi').then((val) => {
      if (val) setAd(val);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Merhaba {ad || 'Anne'} 👋</Text>
        <Text style={styles.subText}>Hamilelik Takip Uygulaması</Text>
      </View>

      <View style={styles.haftaCard}>
        <Text style={styles.haftaLabel}>Şu Anki Haftan</Text>
        <Text style={styles.haftaNum}>{hafta > 0 ? hafta : '?'}</Text>
        <Text style={styles.haftaLabel}>. Hafta</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${Math.min((hafta / 40) * 100, 100)}%` }]} />
        </View>
        <Text style={styles.haftaAlt}>{40 - hafta > 0 ? `Doğuma ${40 - hafta} hafta kaldı` : 'Doğum zamanı yaklaştı!'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Hızlı Erişim</Text>

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: '#FCE4EC' }]}>
          <Ionicons name="heart" size={32} color="#EC407A" />
          <Text style={styles.cardTitle}>Duygu Durumu</Text>
          <Text style={styles.cardSub}>PANAS Testi</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="journal" size={32} color="#66BB6A" />
          <Text style={styles.cardTitle}>Günlük</Text>
          <Text style={styles.cardSub}>Bebeğim İçin</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="nutrition" size={32} color="#42A5F5" />
          <Text style={styles.cardTitle}>Besleme</Text>
          <Text style={styles.cardSub}>Kayıt Tut</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="calendar" size={32} color="#FFA726" />
          <Text style={styles.cardTitle}>Randevu</Text>
          <Text style={styles.cardSub}>Yaklaşan</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#EC407A" />
        <Text style={styles.infoText}>
          Bilgi ve hafta takibini güncellemek için Ayarlar bölümüne git.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: {
    backgroundColor: '#EC407A',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subText: { fontSize: 14, color: '#FFD6E5', marginTop: 4 },
  haftaCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  haftaLabel: { fontSize: 14, color: '#999' },
  haftaNum: { fontSize: 64, fontWeight: 'bold', color: '#EC407A' },
  progressBar: {
    width: '100%', height: 8, backgroundColor: '#f0f0f0',
    borderRadius: 4, marginTop: 12, overflow: 'hidden',
  },
  progress: { height: '100%', backgroundColor: '#EC407A', borderRadius: 4 },
  haftaAlt: { fontSize: 13, color: '#888', marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 16, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  card: {
    width: '45%', margin: '2.5%', padding: 16,
    borderRadius: 16, alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginTop: 8 },
  cardSub: { fontSize: 12, color: '#666', marginTop: 2 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FCE4EC', margin: 16,
    padding: 12, borderRadius: 12, gap: 8,
  },
  infoText: { flex: 1, fontSize: 13, color: '#888' },
});

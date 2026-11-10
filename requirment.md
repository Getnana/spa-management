buatkan single page application berbasis codeigniter desain mobile first.

dengan fitur kurang lebih:

1. manajemen data inti: data layanan pijat, data terapis, data transaksi, dan data booking
2. monitoring transaksi dan pendapatan: total pendapatan harian/mingguan/bulanan, jumlah transaksi, layanan terlaris dan pendapatan per terapis.
3. monitoring kinerja terapis: jumlah layanan yang ditangani, jam kerja, total pendapatan yg dihasilkan, rating pelanggan
4. monitoring booking & operasional: jumlah booking masuk, status booking (pending, selesai, batal), jam sibuk
5. laporan dan rekap otomatis: laporan pendapatan, alporan transaki dan laporan kinerja terapis

role = owner, staff admin/receptionist, dan therapist

akses owner :

- full dashboard
- laporan pendapatan
- kelola user
- kelola layanan
- kelola harga
- lihat semua booking
- monitoring terapis

akses staff/receptionist:

- input booking cust
- edit booking
- checkin/checkout cust
- input pembayaran manual
- lihat jadwal terapis
- kelola data cust

akses therapist:

- lihat jadwal sendiri
- lihat booking yg ditangani
- update status treatment
- lihat rating customer

arsitektur modul spa_monitoring_system_architecture.svg

Berikut saran dan catatan penting untuk sistem monitoring spa kamu:
Struktur sudah solid. Kelima modul yang kamu rencanakan sudah saling terhubung dengan baik — data inti jadi fondasi, monitoring jadi pengolah, laporan jadi output.

Saran tambahan per modul:
Manajemen data inti — tambahkan field durasi layanan dan kategori layanan (misal: relaksasi, medis, kecantikan). Ini penting untuk kalkulasi jam sibuk dan rekomendasi jadwal terapis.
Monitoring transaksi — pisahkan antara pendapatan kotor dan pendapatan bersih (setelah potongan komisi terapis jika ada). Ini penting untuk laporan ke owner yang lebih akurat.
Monitoring terapis — untuk rating, pertimbangkan sistem bintang 1–5 yang diinput staff saat checkout, bukan oleh customer langsung, supaya lebih terkontrol. Tambahkan juga metrik tingkat pembatalan untuk tiap terapis.
Monitoring booking — saran tambahkan fitur sumber booking (walk-in, WhatsApp, telepon, online). Ini membantu owner tahu channel mana yang paling efektif.
Laporan otomatis — sangat disarankan laporan bisa diexport ke PDF/Excel. Untuk owner, tambahkan laporan perbandingan periode (bulan ini vs bulan lalu).

Saran teknis tambahan:

Notifikasi: tambahkan notifikasi ke staff saat ada booking baru masuk, dan ke terapis saat jadwal berubah.
Audit log: catat siapa yang mengubah data apa dan kapan — penting untuk akuntabilitas staff.
Soft delete: booking atau transaksi yang dibatal jangan langsung dihapus, simpan dengan status cancelled agar bisa dianalisis.
Validasi overlap jadwal: sistem harus mencegah terapis dijadwalkan di dua booking yang waktunya bertabrakan.

customer_interaction_flow_spa.svg

Poin kunci dari alur ini:
Customer tidak punya akun di sistem. Semua interaksi customer dilakukan melalui Staff sebagai perantara — mulai dari booking, check-in, hingga input rating. Ini desain yang tepat untuk spa tradisional karena lebih simpel operasionalnya.
Ada 3 touchpoint utama customer:

Saat booking — customer menyampaikan kebutuhan, staff yang menginput
Saat tiba — customer check-in, staff memverifikasi dan memberi tahu terapis
Saat checkout — customer bayar dan beri feedback lisan, staff yang mencatat ke sistem

Data customer yang perlu disimpan untuk memaksimalkan pengalaman kunjungan berikutnya: riwayat layanan, preferensi terapis, catatan khusus (misal alergi minyak tertentu), dan total kunjungan untuk program loyalitas.

bagaimana customer memberi rating?
QR code / link setelah selesai

Staff tunjukkan QR, Customer isi sendiri di HP mereka. hanya mengisi komentar(opsional) dan rating

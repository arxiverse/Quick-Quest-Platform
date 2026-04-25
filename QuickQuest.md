# 🚀 Quick Quest Platform: The Manifesto

**"Instan, Sehat, dan Berkelanjutan"**

Catatan ini merupakan _highlight_ dari pemikiran developer untuk membangun infrastruktur software "Quick Quest" serta arsitekturnya yang akan dikembangkan di masa depan.

---

## 01. Q&A: Apa itu Quick Quest?

**Q: Apa itu Platform Quick Quest?** **A:** Quick Quest adalah platform aplikasi digital yang menjadi solusi buat individu yang pengen dapet uang dengan cara instan, sehat, dan berkelanjutan. [cite: 1]

**Q: Gimana sejarah ide ini muncul?** **A:** Muncul dari keresahan atas 19 juta lapangan kerja yang dijanjikan pemerintah tapi belum kelihatan eksekusinya. Platform ini pakai prinsip _Person-to-Person_ (P2P) dengan dua peran utama: **Quest Giver** & **Quest Runner**. Platform cuma fasilitator yang ambil untung dari _fee_ transaksi. [cite: 1]

---

## 02. Latar Belakang (The Hard Truth) 🔍

Ide ini bukan muncul dari ruang hampa, tapi hasil observasi tajam di lapangan:

### 1. Jiwa Sosialis vs Realita Ekonomi

Orang Indonesia itu dasarnya suka tolong-menolong. Tapi zaman sekarang, ada rasa "nggak enakan" kalau dibantu tanpa ngasih imbalan. Ekonomi modern mewajibkan setiap pengeluaran waktu dan tenaga dihargai dengan hasil yang adil. Sayangnya, banyak Gen-Z terjebak gaya hidup **H.E.D.O.N (High Expense, Destitute On Nature)** yang malah menjerumuskan ke tindakan negatif (judi online, pinjol, kriminal) demi kekayaan instan. [cite: 1]

### 2. Paradoks Game vs Dunia Kerja

Banyak pengangguran yang punya jiwa kompetitif tinggi di game ("No Mythic No Game"), tapi kesulitan cari kerja di dunia nyata. Ada paradoks besar: lulusan S1 ditolak karena kurang pengalaman, sementara untuk cari pengalaman harus kerja dulu. QQM hadir untuk mengubah kompetisi "kosong" di game menjadi kontribusi nyata yang menghasilkan uang. [cite: 1]

---

## 03. Referensi Arsitektur (The Giants' Shoulders) 🏗️

### 1. Sistem Ojol (Ojek Online)

Kita pakai sistem _Matching & Geolocation_ milik Ojol. Kalau dalam radius 500m nggak ada _Runner_, sistem bakal meluas secara otomatis ke 1km, 2km, dan seterusnya sampai ketemu. [cite: 1]

### 2. Platform Freelance

Kita ambil konsep _On-Demand Service_ dan konektivitas digitalnya. Bedanya, QQM lebih fokus ke pekerjaan mikro dan instan yang bisa dikerjakan siapa saja di sekitar lokasi Giver. [cite: 1]

---

## 04. Core Mechanics: Quick Quest System ⚙️

Platform ini menggabungkan kecepatan Ojol dengan fleksibilitas Freelance.

- **Pemberian Upah:** Menggunakan rentang (Min/Max) untuk menilai kualitas kerja Runner. [cite: 1]
- **Dynamic Radius Broadcasting:** \* Radius awal 1km selama 15 menit. [cite: 1]
  - Ekspansi radius (+1km) dilakukan setiap 5 menit jika belum ketemu match. [cite: 1]
- **Performance Point (PP):** Sistem _rank_ lokal untuk mengalihkan kompetisi game jadi kontribusi nyata. Skill spesifik akan menentukan PP di bidang tersebut. [cite: 1, 2]

---

## 05. The Revised Flow 🌊

### 🔵 Quest Giver Flow

1. **Post Quest:** Isi deskripsi, skill tag, upah, tipe (Solo/Kelompok), dan lokasi. [cite: 1, 2]
2. **Lock Escrow:** Giver wajib deposit dana sebelum _broadcast_. Gak ada dana = Gak ada quest. [cite: 1, 2]
3. **Match & Share Lokasi:** Setelah match, Giver kirim pin lokasi via _in-app chat_. [cite: 1, 2]
4. **Audit & Release:** Setelah Runner selesai, Giver audit fisik. Klik "Terima" maka dana cair otomatis. [cite: 1, 2]

### 🟢 Quest Runner Flow

1. **Dashboard Filter:** Lihat list quest sesuai skill dan lokasi terdekat. [cite: 1, 2]
2. **Ambil Quest:** Sistem bakal _lock_ quest (kalau tipe Solo) biar nggak direbut orang lain. [cite: 1, 2]
3. **Mulai Kerja:** Tekan tombol "Mulai Kerja" buat nyatet _timestamp_. [cite: 1, 2]
4. **Klaim Selesai:** Selesai kerja, tekan tombol untuk memicu notifikasi audit ke Giver. [cite: 1, 2]

---

## 06. Escrow & Dispute Logic (Trustless Trust) ⚖️

Sistem keamanan dana menggunakan **Escrow State Machine (FSM)**:
`UNPAID` ➡️ `LOCKED` ➡️ `IN_PROGRESS` ➡️ `PENDING_CONFIRMATION` ➡️ `RELEASED / DISPUTED` [cite: 1, 2]

**3 Layer Penyelesaian Sengketa:**

1.  **Layer 1 (Auto Timer):** Anti-ghosting. Kalau Giver nggak audit dalam X jam, dana otomatis cair ke Runner. [cite: 1, 2]
2.  **Layer 2 (Evidence Based):** Upload bukti foto/video dalam 24 jam jika terjadi sengketa. [cite: 1, 2]
3.  **Layer 3 (Platform Mediasi):** Tim QQ turun tangan buat kasih keputusan final. Pihak yang salah kena pinalti PP atau suspend. [cite: 1, 2]

---

## 07. Identity & Tech Stack 💻

- **Identity:** Rebranding dari "N" ke **"Q"** dengan struktur awal yang tetap dipertahankan.
- **Stack:** Supabase (DB/Auth), Apache Kafka (Streaming), Drogon C++ (High Performance API), ObjectBox (Local Cache). [cite: 2]

---

_Quick Quest Platform - Build for the Future of Work_

---

# RAW Idea

Catatan ini hanya sebagai Highlight dari Pemikiran Developer untuk membangun sebuah infrastruktur Software "Quick Quest" serta arsitekturnya yang kedepannya harus dikembangkan.

# Perkenalkan

- Q : Apa itu Platform Quick Quest?
- A : Quick Quest merupakan sebuah platform aplikasi digital yang berfungsi sebagai solusi untuk individu yang ingin mendapatkan uang dengan cara yang instan, sehat dan berkelanjutan.

- Q : Bagaimana sejarah dari Ide Platform Quick Quest ini Muncul?
- A : Ide untuk mengembangkan Platform Quick Quest ini muncul dari rasa kekesalan atas 19 Juta Lapangan pekerjaan dari Pemerintah Republik Indonesia yang sampai saat ini belum ada eksekusinya. Ide untuk mengembangkan Platform Quick Quest ini menggunakan Prinsip Person-to-Person (P2P) yang dimana ianya terbagi atas 2 Peran yaitu: Quest Giver & Quest Runner.
  Quest Giver adalah Individu yang memberikan pekerjaan melalui broadcast diplatform untuk diperlihatkan oleh Quest Runner sedangkan, Quest Runner adalah Individu yang menerima tugas/pekerjaan(Quest) dari Quest Giver pada bidang tertentu. Peran platform adalah hanya sebagai penyedia layanan yang mengambil untung dari Fee transaksi Penggunanya.

- Q : Ceritakan Latar Belakang dari Platform Ini
- A : Latar Belakang dari platform ini sangat panjang, ianya dilalui dari hasil observasi secara tidak langsung dilapangan serta banyak referensi yang menguatkan platform ini harus segera dikembangkan.

- Q : Latar Belakang pertama platform ini ingin dikembangkan adalah dimulai dari hasil observasi lapangan baik itu di Kampus, Publik dan Tempat Lainnya dimana: Orang Indonesia itu jiwanya adalah sosialis dan suka tolong menolong sesama, baik itu ianya tidak kenal maupun sesama teman/sahabat. Zaman semakin berkembang, biasanya orang jika ingin meminta tolong ataupun ditolong ada rasa tidak enakan jika tidak memberi sepeser apapun kepada yang menolong sehingga menimbulkan rasa sungkan dan rasa malu. Oleh karena itu yang menerima bantuan orang sering kali memberi imbalan kepada penolong sebagai penghargaan atas jasanya agar impas. Hal ini memberi isyarat bahwa seseorang jika ia ditolong secara sukarela maka jasanya akan selalu dikenang karena telah mengorbankan waktu dan tenaganya untuk membantu orang lain. Namun dikarenakan semakin meningkatnya kebutuhan yang mengharuskan orang harus memberikan imbalan lebih sering daripada ikhlas namun hasilnya kadang memberikan sebuah kerugian. Ada sebuah pepatah yang mengatakan bahwa "Semakin kamu ikhlas maka perjalanan hidupmu akan semakin ringan serta rezekimu akan selalu dilimpahkan", Pepatah tersebut mengisyaratkan bahwa, semakin kita sering menolong orang tanpa mengharapkan imbalan apapun maka suatu saat ia akan menerima rezeki yang melimpah dikemudian hari. Zaman telah berubah, Ekonomi mewajibkan Individu untuk selalu bertransaksi disetiap apapun yang ia dikeluarkan, baik itu Waktu, Tenaga, Uang dan bahkan harus rela berkorban Fisik untuk mendapatkan Hasil. Terkadang Hasil yang keluar selalu tidak adil dengan apa yang ia keluarkan, Usaha terkadang selalu mengkhianati hasil. Sehingga hal ini memunculkan banyak sekali ketimpangan terutama pada kaum generasi muda yaitu Gen Z. Kaum Generasi Z dibesarkan oleh masa transisi Teknologi Era Analog ke Teknologi Era Modern sehingga gaya hidupnya pun condong berubah ke arah yang ingin selalu serba instan. Gaya Hidup Serba Mewah, Instan, Keinginan diatas Kebutuhan menimbulkan konflik pada realita. Banyak generasi muda yang pada akhirnya ingin mengeluarkan sedikit tenaga untuk menghasilkan hasil yang tinggi dan sesuai ekspektasi namun hal itu justru menjadi kebalikannya sehingga kaum muda saat ini sangat mudah sekali untuk terjerumus ke gaya hidup H.E.D.O.N (High Expense, Destitute On Nature). Bukan selalu baik, nyatanya gaya hidup HEDON ini selalu terjerumus ke tindakan negatif seperti Tindakan Kriminal, Pencurian, Judi Online, Pinjaman Online, Begal bahkan Tindakan Korupsi yang bisa ditanam pada mentalitas seorang Generasi Muda demi hanya ingin mengejar kekayaan instan dengan pengeluaran tenaga yang rendah.

- Q : Latar Belakang kedua dimulai dari hasil observasi berkepanjangan bahwa psikologi orang Indonesia diwaktu senggang atau masih menggangur adalah sering ngegame supaya dapat mengisi waktu dikala senggang. Namun dikarenakan memandang layar handphone dalam jangka waktu yang panjang bisa berakibat buruk karena mata terlalu lama terpapar radiasi sinar biru dari handphone. Ada sebuah ucapan dari seorang gamer yang sedang menggangur "Kalau tidak naik rank malam ini belum berhenti", "Gak chicken gak turu", "No Mythic no Game", "Pokoknya push terus sampai pagi". Ini menunjukkan bahwa jiwa orang Indonesia adalah kompetitif, berkompetisi untuk mendapatkan peringkat yang terbaik didalam gamenya walaupun itu tidak menghasilkan apapun, hanya sebuah pencapaian yang seharusnya tidak perlu dikejar sampai jauh jauh malam, sementara diluar sana kompetisi untuk mendapatkan pekerjaan menjadi sangat sulit. Seorang pengganguran yang memiliki Ijazah S1 dalam obrolan adalah sebagai berikut: "Aku udah susah payah ngejar pendidikan sampai ngeluarin banyak biaya untuk pendidikan, tapi hasilnya? Aku ngelamar kerja Ijazahku ditolak karena tidak memenuhi persyaratan", "Yang diincar itu orang dalam, kalau kamu punya orang dalam, mencari kerja itu sangat gampang, Tinggal bilang saja ke orangnya saya butuh kerja. Gak butuh waktu lama udah langsung masuk kantor", "Nyari karyawan tapi syarat harus ada pengalaman. Gimana bisa kami yang kuliah ini bisa punya pengalaman jika kami harus lulus terlebih dahulu di pendidikan. Kami ini fokus kuliah untuk mendapatkan pekerjaan tapi syarat harus pengalaman". Ini menunjukkan sebuah paradox yang dimana Jika kuliah maka akan mudah mendapatkan pekerjaan, namun direalitanya pengalaman sangat dibutuhkan dibandingkan pendidikan. Fakta bahwa banyak pemuda Indonesia yang telah menyelesaikan pendidikannya kerap sulit untuk mendapatkan pekerjaan yang sebanding, banyak dari mereka bilang bahwa: "Mending kerja, gak usah kuliah. Pengalaman dibutuhkan, bukan hanya pendidikan. Ini merupakan keluhan pemuda Indonesia yang sulit mendapatkan pekerjaan yang layak, banyak dari mereka yang memilih kerja serabutan bahkan paling parah adalah menggangur.

Jadi itu adalah latar belakang dari Kenapa Platform ini harus muncul dipermukaan dalam waktu cepat.

- Q : Apa saja referensi anda dalam membuat platform ini?
- A : Referensi Pertama kami dalam membuat platform ini adalah Ojol atau Ojek Online. Kenapa Ojol? kenapa tidak yang lain?. Dalam beberapa tahun terakhir ojol atau Ojek Online di Indonesia sangat berkembang pesat dikarenakan orang membutuhkan transportasi yang murah, cepat dan sesuai. Digitalisasi Ojek Online di Indonesia memiliki dampak yang sangat signifikan dikarenakan Ekosistemnya yang begitu luas dari Sabang sampai Merauke. Banyak UMKM memilih Platform ini karena mereka berkembang bisa sebagai solusi transportasi contohnya saja kita ambil Platform Gojek: Gojek memiliki jasa untuk mengantar makanan yaitu GoFood. GoFood ditujukan kepada UMKM yang memiliki Bisnis Makanan seperti Rumah Makan, CoffeeShop dan Bisnis Makanan lainnya dan juga Gojek juga memiliki jasa untuk mengantar barang yaitu GoSend. GoSend tidak berafiliasi kepada GoFood namun memiliki cara kerja yang sama untuk mengantar pesanan barang yang ditujukan untuk pebisnis Toko Online seperti Tokopedia yang dimana Pebisnis Toko Online memerlukan Jasa Kurir untuk mengantarkan Pesanan barang agar sampai ke tujuan. Tetapi bukan itu yang kami jadikan referensi, yang kami jadikan referensi adalah cara kerjanya di Sistem Ojolnya yang dimana Setiap kali Pengguna ingin berjalan kemanapun, hasilnya akan selalu tetap ketemu karena mengandalkan Lokasi Pengguna dan Lokasi Driver terdekat dari Lokasi Pengguna. Sistem algoritma ini menggunakan sistem geolocation untuk menentukan Lokasi Pengguna dan Lokasi Driver. Sistem Ojol dalam menentukan Lokasi Pengguna dan Driver ditentukan dari Jarak, Jika tidak ada driver didalam rentang lokasi pengguna yaitu 500 Meter maka jarak matching akan diperluas menjadi radius 1 Kilometer, jika tidak ada maka matching diperluas lagi dalam radius sampai benar benar ketemu Driver.

- Q : Referensi kedua kami adalah Platform Freelance, Latar belakang platform freelance muncul dari pesatnya perkembangan teknologi informasi dan internet yang mengubah pola kerja tradisional menjadi berbasis digital dan remote. Hal ini didorong oleh kebutuhan akan fleksibilitas waktu, keinginan untuk bekerja mandiri tanpa terikat perusahaan, serta meningkatnya permintaan layanan profesional secara on-demand. Poin utama dari perkembangan platform ini terutama di Indonesia adalah:

1. Transformasi Digital dan Konektivitas:

- Akses Internet yang Meluas: Pesatnya perkembangan infrastruktur komputer dan internet di Indonesia memungkinkan pekerja dan pemberi kerja terhubung tanpa batasan geografis.
- Munculnya Gig Economy: Pergeseran global ke arah gig economy memicu kebutuhan akan wadah digital untuk transaksi jasa secara mandiri.

2. Kebutuhan Fleksibilitas Kerja:

- Kendali Penuh: Banyak tenaga kerja muda menginginkan kendali lebih besar atas waktu, lokasi, dan beban kerja mereka daripada terikat pada satu perusahaan.
- Solusi Pengangguran: Platform freelance menjadi solusi produktif bagi mereka yang belum memiliki pekerjaan tetap namun ingin tetap memiliki penghasilan bulanan.

3. Efisiensi bagi Pelaku Bisnis:

- Penghematan Biaya: Platform seperti Fastwork membantu pemilik bisnis menemukan tenaga ahli dengan cara yang lebih sederhana, cepat, dan hemat biaya dibandingkan rekrutmen permanen.
- Akses ke Talenta Spesifik: Perusahaan dapat dengan mudah menyewa profesional untuk proyek tertentu (seperti pengembangan perangkat lunak atau desain grafis) melalui sistem berbasis web.

Q : Jika referensinya Sistem Ojol dan Sistem Freelance bagaimana cara kerja dari Platform Quick Quest?
A : Sistem dari Platform Quick Quest menggunakan prinsip yang sama seperti sistem ojol namun dari referensi freelance maka ini ditujukan untuk mencari pekerjaan dan menyelesaikan pekerjaan. Sistem Quick Quest akan dibagi menjadi 2 Role yaitu "Quest Runner" dan "Quest Giver". Quest Giver adalah pengguna yang menggunakan platform sebagai pemberi pekerjaan, pekerjaan yang diberikan oleh Quest Giver bisa beragam tergantung tingkat kesulitannya, bisa saja pekerjaan ringan seperti membersihkan rumah, membenarkan kode yang error dan membantu mengantarkan barang kepada orang lain yang dimana pendapatan yang dihasilkan oleh Quest Runner tidak seberapa, Estimasi adalah Rp. 50.000 - Rp. 100.000. Sedangkan Quest Runner adalah pengguna yang bertindak sebagai penerima pekerjaan dari Quest Giver yang dimana pengguna yang menerima pekerjaan ini sangat beragam disemua bidang, mulai dari pekerjaan ringan sampai dengan pekerjaan berat. Sistem Quick Quest tidak mengandalkan sistem matching yang sama persis dengan sistem ojol namun memiliki konsep yang hampir sama dengan menambahkan elemen baru untuk menentukan pengguna mana yang akan menerima pekerjaan dan memberikan pekerjaan, ianya menggunakan sistem broadcast yang dimana alurnya sebagai berikut:
Quest Giver mengisi Form detail pekerjaan serta estimasi upah minimum dalam rentang (Pemberian Upah dalam nilai Rentang Minimum/Maximum adalah cara yang paling aman untuk menilai Quest Runner dalam bekerja, yang apakah pekerjaan yang telah dikerjakan telah sesuai ataupun tidak) -> Quest Giver akan menentukan Tipe Pekerjaan: Per-Individu atau Ber-Kelompok (mis: 5 orang Quest Runner) -> Sistem akan menyimpan form tersebut didalam database -> Sistem akan menentukan radius matching minimal adalah 1Km dari lokasi Quest Giver selama 15 menit -> Sistem akan membroadcast detail pekerjaan tersebut kedalam dashboard Quest Runner tertanda sebagai LIVE / Sedang Berlangsung / Terbuka yang dekat dari Lokasi Quest Giver -> Jika Tipe Quest adalah Per-Individu dan belum matching oleh Quest Runner maka Jarak Radius akan Ditingkatkan menjadi 2Km, Jika Tipe Quest adalah Ber-Kelompok maka sistem akan tetap berlangsung untuk mengumpulkan Quest Runner sampai dengan cocoknya yang disesuaikan oleh Quest Giver. Penentuan perluasan radius jarak disini adalah setiap 5 Menit, Jika dalam 5 Menit Quest Runner belum terkumpulkan maka sistem akan tetap menahan sampai benar benar lewat dari 5 Menit kemudian Radius ditingkatkan menjadi 2 Kilometer dari Lokasi Quest Giver -> Jika Tipe Quest adalah Per-Individu telah Match maka Sesi Broadcast akan dibekukan tertanda sebagai "Match" di dashboard Quest Runner lainnya dan sesi akan tetap dibroadcast sampai Quest Giver memberi upah atau Mengganti dengan yang lain -> Jika Quest Runner telah diberi Upah oleh Quest Giver maka Sesi Broadcast pekerjaan dari Quest Giver tertanda Telah Selesai dan Sesi Broadcast akan Ditutup ditandai oleh "Pekerjaan Selesai", Jika Tipe Quest adalah Ber-Kelompok telah Match sistemnya akan sama dengan tipe Per-Individu namun akan ada sedikit penyesuaian didashboard Quest Giver ditandai dengan tampilan : "Quest Runner belum cukup, apakah anda ingin melanjutkan atau tidak?" Jika dilanjutkan maka Sesi akan dibekukan dan akan tetap terlihat oleh Quest Runner yang lain sampai Quest Giver memberikan Upah kepada kelompok Quest Runner.
Platform Quick Quest mengadopsi sistem rank yang kami sebut sebagai pp(Performance Point). Untuk apa sistem Rank pp ini?, Dalam latar belakang yang kedua adalah bagaimana caranya untuk mengalihkan kompetisi game menjadi kontribusi nyata?, PP (Performace Point) akan bertindak sebagai poin yang dikumpulkkan oleh Quest Giver dan Quest Runner. Sistem Performance Point ini menggunakan prinsip local rank. Apa itu Prinsip Local Rank?, Sebelum kita membahas lebih lanjut maka ada hal yang perlu diperhatikan disini: Pada saat pendaftaran, pengguna akan dimintai keterangan untuk mengisi bidang/skill yang dikuasai oleh pengguna, itu berguna sebagai matching pekerjaan yang cocok didashboard pengguna.

---

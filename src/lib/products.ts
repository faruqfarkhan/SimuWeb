import type { Product } from './types';

// Prices converted from USD to IDR (approx. 1 USD = 16,000 IDR) and rounded.
export const products: Product[] = [
  {
    id: 1,
    name: 'Gitar Akustik',
    price: 4799000,
    description: 'Gitar akustik dreadnought klasik dengan nada yang kaya dan penuh.',
    longDescription:
      'Rasakan suara abadi dari gitar akustik dreadnought klasik kami. Dibuat dari kayu mahoni dan spruce berkualitas tinggi, instrumen ini menawarkan nada resonan yang kaya, sempurna untuk semua gaya bermain. Menampilkan profil leher yang nyaman dan perangkat keras yang tahan lama untuk kinerja andal selama bertahun-tahun.',
    image: 'https://picsum.photos/600/400?random=1',
    dataAiHint: 'acoustic guitar',
  },
  {
    id: 2,
    name: 'Keyboard Elektrik',
    price: 7999000,
    description: 'Keyboard portabel 61-kunci dengan ratusan suara bawaan.',
    longDescription:
      'Bebaskan kreativitas Anda dengan keyboard elektrik portabel 61-kunci ini. Dilengkapi dengan ratusan suara, ritme, dan efek berkualitas tinggi. Menampilkan tuts yang peka terhadap sentuhan, sistem pelajaran bawaan, dan konektivitas MIDI, ini adalah pilihan ideal untuk pemula dan musisi berpengalaman.',
    image: 'https://picsum.photos/600/400?random=2',
    dataAiHint: 'electric keyboard',
  },
  {
    id: 3,
    name: 'Headphone Studio',
    price: 2399000,
    description: 'Headphone over-ear yang dirancang untuk pemantauan profesional.',
    longDescription:
      'Dengarkan setiap detail musik Anda dengan headphone studio profesional ini. Desain over-ear, closed-back memberikan isolasi kebisingan yang sangat baik, sementara driver large-aperture menghasilkan reproduksi audio yang akurat dan seimbang. Sempurna untuk mixing, mastering, atau mendengarkan secara kritis.',
    image: 'https://picsum.photos/600/400?random=3',
    dataAiHint: 'studio headphones',
  },
  {
    id: 4,
    name: 'Mikrofon Kondenser',
    price: 3199000,
    description: 'Mikrofon kondenser diafragma besar untuk vokal berkualitas studio.',
    longDescription:
      'Tangkap audio murni dengan mikrofon kondenser diafragma besar ini. Respons frekuensi yang lebar dan sensitivitas tinggi membuatnya sempurna untuk merekam vokal, instrumen akustik, dan podcast. Termasuk shock mount dan pop filter untuk hasil profesional langsung dari kotaknya.',
    image: 'https://picsum.photos/600/400?random=4',
    dataAiHint: 'condenser microphone',
  },
  {
    id: 5,
    name: 'DJ Turntable',
    price: 11199000,
    description: 'Turntable direct-drive torsi tinggi untuk DJ profesional.',
    longDescription:
      'Standar emas untuk DJ profesional, turntable direct-drive torsi tinggi ini memberikan kinerja dan keandalan yang tak tertandingi. Menampilkan motor yang dikendalikan kuarsa, kontrol pitch yang dapat disesuaikan, dan konstruksi yang tahan lama, turntable ini dibuat untuk menahan kerasnya penggunaan setiap malam di lingkungan klub mana pun.',
    image: 'https://picsum.photos/600/400?random=5',
    dataAiHint: 'dj turntable',
  },
  {
    id: 6,
    name: 'Synthesizer',
    price: 14399000,
    description: 'Synthesizer analog dengan suara klasik dan fitur modern.',
    longDescription:
      'Jelajahi alam semesta sonik dengan synthesizer analog yang kuat ini. Menggabungkan suara hangat klasik dengan fleksibilitas modern, ia memiliki beberapa osilator, filter yang kaya, dan matriks modulasi yang intuitif. Antarmuka langsungnya mengundang eksperimen dan desain suara tanpa akhir.',
    image: 'https://picsum.photos/600/400?random=6',
    dataAiHint: 'music synthesizer',
  },
  {
    id: 7,
    name: 'Mesin Drum',
    price: 7359000,
    description: 'Buat ritme yang menarik dengan mesin drum serbaguna ini.',
    longDescription:
      'Dari irama klasik hingga alur modern, mesin drum serbaguna ini siap membantu Anda. Ini mencakup perpustakaan besar suara drum ikonik, sequencer langkah yang kuat, dan kontrol kinerja yang memudahkan untuk membuat dan memanipulasi ritme dengan cepat. Suatu keharusan bagi produser dari genre apa pun.',
    image: 'https://picsum.photos/600/400?random=7',
    dataAiHint: 'drum machine',
  },
  {
    id: 8,
    name: 'Antarmuka Audio',
    price: 3999000,
    description: 'Antarmuka audio USB 2-in/2-out untuk perekaman berkualitas tinggi.',
    longDescription:
      'Rekam musik Anda dengan kualitas sebening kristal dengan antarmuka audio USB 2-in/2-out ini. Ini fitur preamp headroom tinggi, konversi digital murni, dan pemantauan tanpa latensi. Ringkas dan ditenagai oleh bus, ini adalah pusat yang sempurna untuk pengaturan studio rumah Anda.',
    image: 'https://picsum.photos/600/400?random=8',
    dataAiHint: 'audio interface',
  },
  {
    id: 9,
    name: 'Gitar Elektrik',
    price: 9599000,
    description: 'Gitar elektrik solid-body serbaguna untuk rock, blues, dan lainnya.',
    longDescription:
      'Gitar elektrik solid-body yang ikonik ini adalah pekerja keras sejati. Dengan pickup serbaguna dan profil leher yang nyaman, sangat cocok untuk berbagai genre, mulai dari rock yang renyah hingga blues yang halus. Konstruksi yang kokoh memastikan daya tahan untuk pertunjukan dan sesi studio.',
    image: 'https://picsum.photos/600/400?random=9',
    dataAiHint: 'electric guitar',
  },
  {
    id: 10,
    name: 'Gitar Bass',
    price: 8799000,
    description: 'Gitar bass 4-senar klasik dengan nada low-end yang kuat.',
    longDescription:
      'Letakkan dasar untuk alur Anda dengan gitar bass 4-senar klasik ini. Dikenal karena nadanya yang kuat dan menggelegar, ini telah menjadi andalan dalam genre musik yang tak terhitung jumlahnya. Leher yang halus dan bodi yang seimbang membuatnya nyaman dimainkan selama berjam-jam.',
    image: 'https://picsum.photos/600/400?random=10',
    dataAiHint: 'bass guitar',
  },
  {
    id: 11,
    name: 'Biola Akustik',
    price: 5599000,
    description: 'Biola ukuran penuh buatan tangan yang ideal untuk siswa menengah.',
    longDescription:
      'Tingkatkan perjalanan musik Anda dengan biola akustik ukuran penuh buatan tangan kami. Dibuat dari kayu maple dan spruce pilihan, menghasilkan nada yang hangat dan ekspresif. Ideal untuk siswa menengah yang ingin maju, ia hadir lengkap dengan busur, rosin, dan tas jinjing.',
    image: 'https://picsum.photos/600/400?random=11',
    dataAiHint: 'acoustic violin',
  },
  {
    id: 12,
    name: 'Saksofon Alto',
    price: 12799000,
    description: 'Saksofon alto berlapis emas untuk nada yang halus dan responsif.',
    longDescription:
      'Rasakan nada yang halus dan kaya dari saksofon alto kami. Selesai dengan lapisan pernis emas yang indah, tidak hanya terlihat memukau tetapi juga memberikan suara yang responsif dan bersemangat. Sempurna untuk siswa jazz dan klasik, ia menawarkan intonasi dan ergonomi yang hebat.',
    image: 'https://picsum.photos/600/400?random=12',
    dataAiHint: 'alto saxophone',
  },
  {
    id: 13,
    name: 'Monitor Studio',
    price: 4899000,
    description: 'Monitor studio nearfield bertenaga untuk pencampuran yang akurat (Pasangan).',
    longDescription:
      'Percayai mixing Anda dengan sepasang monitor studio nearfield bertenaga ini. Dirancang untuk reproduksi suara yang datar dan akurat, mereka mengungkapkan setiap nuansa dalam rekaman Anda. Dengan amplifier Kelas D bi-amped dan kontrol penyesuaian akustik, mereka beradaptasi dengan ruangan mana pun.',
    image: 'https://picsum.photos/600/400?random=13',
    dataAiHint: 'studio monitors',
  },
  {
    id: 14,
    name: 'Pengontrol MIDI',
    price: 2999000,
    description: 'Pengontrol keyboard MIDI 49-tuts dengan pad dan kenop.',
    longDescription:
      'Kendalikan studio virtual Anda dengan pengontrol keyboard MIDI 49-tuts ini. Menampilkan tuts semi-tertimbang, 8 pad drum yang peka terhadap kecepatan, dan kenop yang dapat dialihkan, ini memberikan kontrol langsung atas instrumen dan DAW Anda. Integrasi yang mulus dan konstruksi yang kokoh.',
    image: 'https://picsum.photos/600/400?random=14',
    dataAiHint: 'midi controller',
  },
  {
    id: 15,
    name: 'Mixer Digital',
    price: 15999000,
    description: 'Mixer digital 16-saluran yang ringkas dengan kontrol nirkabel.',
    longDescription:
      'Revolusikan suara live Anda dengan mixer digital 16-saluran yang ringkas ini. Menawarkan preamp berkualitas studio, efek bawaan, dan kemampuan untuk mencampur secara nirkabel dari tablet apa pun. Ini kuat, portabel, dan sangat fleksibel untuk band, tempat, dan rumah ibadah.',
    image: 'https://picsum.photos/600/400?random=15',
    dataAiHint: 'digital mixer',
  },
  {
    id: 16,
    name: 'Ukulele Konser',
    price: 1599000,
    description: 'Ukulele konser mahoni dengan suara yang cerah dan ceria.',
    longDescription:
      'Bawa getaran pulau ke musik Anda dengan ukulele konser mahoni kami. Ukurannya yang sedikit lebih besar dari soprano memberikan nada yang lebih penuh dan lebih bergema sambil tetap menjaga suara ukulele klasik yang cerah. Sangat cocok untuk pemula dan pemain berpengalaman.',
    image: 'https://picsum.photos/600/400?random=16',
    dataAiHint: 'concert ukulele',
  },
];

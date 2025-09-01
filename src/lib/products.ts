import type { Product } from './types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Acoustic Guitar',
    price: 299.99,
    description: 'Classic dreadnought acoustic guitar with a rich, full tone.',
    longDescription:
      'Experience the timeless sound of our classic dreadnought acoustic guitar. Crafted from high-quality mahogany and spruce, this instrument offers a rich, resonant tone perfect for all playing styles. Features a comfortable neck profile and durable hardware for years of reliable performance.',
    image: 'https://picsum.photos/600/400?random=1',
    dataAiHint: 'acoustic guitar',
  },
  {
    id: 2,
    name: 'Electric Keyboard',
    price: 499.99,
    description: '61-key portable keyboard with hundreds of built-in sounds.',
    longDescription:
      'Unleash your creativity with this 61-key portable electric keyboard. It comes packed with hundreds of high-quality sounds, rhythms, and effects. Featuring touch-sensitive keys, a built-in lesson system, and MIDI connectivity, it’s the ideal choice for both beginners and seasoned musicians.',
    image: 'https://picsum.photos/600/400?random=2',
    dataAiHint: 'electric keyboard',
  },
  {
    id: 3,
    name: 'Studio Headphones',
    price: 149.99,
    description: 'Over-ear headphones designed for professional monitoring.',
    longDescription:
      'Hear every detail of your music with these professional studio headphones. The over-ear, closed-back design provides excellent noise isolation, while the large-aperture drivers deliver accurate and balanced audio reproduction. Perfect for mixing, mastering, or critical listening.',
    image: 'https://picsum.photos/600/400?random=3',
    dataAiHint: 'studio headphones',
  },
  {
    id: 4,
    name: 'Condenser Microphone',
    price: 199.99,
    description: 'Large-diaphragm condenser mic for studio-quality vocals.',
    longDescription:
      'Capture pristine audio with this large-diaphragm condenser microphone. Its wide frequency response and high sensitivity make it perfect for recording vocals, acoustic instruments, and podcasts. Includes a shock mount and pop filter for professional results right out of the box.',
    image: 'https://picsum.photos/600/400?random=4',
    dataAiHint: 'condenser microphone',
  },
  {
    id: 5,
    name: 'DJ Turntable',
    price: 699.99,
    description: 'High-torque, direct-drive turntable for professional DJs.',
    longDescription:
      'The gold standard for professional DJs, this high-torque, direct-drive turntable delivers unparalleled performance and reliability. Featuring a quartz-controlled motor, adjustable pitch control, and a durable construction, it’s built to withstand the rigors of nightly use in any club environment.',
    image: 'https://picsum.photos/600/400?random=5',
    dataAiHint: 'dj turntable',
  },
  {
    id: 6,
    name: 'Synthesizer',
    price: 899.99,
    description: 'Analog synthesizer with a classic sound and modern features.',
    longDescription:
      'Explore the sonic universe with this powerful analog synthesizer. Combining a classic warm sound with modern flexibility, it features multiple oscillators, a rich filter, and an intuitive modulation matrix. Its hands-on interface invites endless experimentation and sound design.',
    image: 'https://picsum.photos/600/400?random=6',
    dataAiHint: 'music synthesizer',
  },
  {
    id: 7,
    name: 'Drum Machine',
    price: 459.99,
    description: 'Create compelling rhythms with this versatile drum machine.',
    longDescription:
      'From classic beats to modern grooves, this versatile drum machine has you covered. It includes a vast library of iconic drum sounds, a powerful step sequencer, and performance controls that make it easy to create and manipulate rhythms on the fly. A must-have for producers of any genre.',
    image: 'https://picsum.photos/600/400?random=7',
    dataAiHint: 'drum machine',
  },
  {
    id: 8,
    name: 'Audio Interface',
    price: 249.99,
    description: '2-in/2-out USB audio interface for high-quality recording.',
    longDescription:
      'Record your music in crystal-clear quality with this 2-in/2-out USB audio interface. It features high-headroom preamps, pristine digital conversion, and zero-latency monitoring. Compact and bus-powered, it’s the perfect centerpiece for your home studio setup.',
    image: 'https://picsum.photos/600/400?random=8',
    dataAiHint: 'audio interface',
  },
];

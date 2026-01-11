export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  precio: number;
  importancia: number;
  rachaRequerida: number;
  categoria: string;
  comprado?: boolean; // Nuevo campo visual
}

export const EVENTOS_DATA: Evento[] = [
  {
    id: '1',
    titulo: 'Fiesta de Bienvenida FIEC',
    descripcion: 'Música en vivo, snacks y el mejor ambiente para iniciar el semestre con energía.',
    fecha: '2026-03-15',
    precio: 10.00,
    importancia: 5,
    rachaRequerida: 15,
    categoria: 'Social',
    comprado: true // Este evento aparecerá como ya obtenido
  },
  {
    id: '2',
    titulo: 'Bingo Universitario',
    descripcion: 'Participa por laptops, tablets y bonos de cafetería mientras te relajas.',
    fecha: '2026-02-10',
    precio: 5.00,
    importancia: 4,
    rachaRequerida: 10,
    categoria: 'Premios'
  },
  {
    id: '3',
    titulo: 'Torneo E-Sports: FIFA 26',
    descripcion: 'Demuestra quién es el mejor en la cancha virtual. ¡Premios en efectivo!',
    fecha: '2026-02-25',
    precio: 7.50,
    importancia: 3,
    rachaRequerida: 12,
    categoria: 'Deportes'
  }
];
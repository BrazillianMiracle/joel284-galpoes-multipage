export interface AnuncioFight {
    id: number;
    nome: string;
    modalidade: string;
    cidade: string;
    bairro: string;
    experiencia: string;
    precoHora: number;
    whatsapp: string;
    desc: string;
    fotos: string[];
}

const modalidades = ["Muay Thai", "Boxe", "Jiu-Jitsu", "Kickboxing", "MMA", "Defesa Pessoal"];
const bairrosGoiania = [
    "Setor Bueno", "Setor Marista", "Setor Oeste", "Jardim Goiás", 
    "Setor Sul", "Setor Universitário", "Parque Amazônia", "Setor Coimbra"
];

export const bancoDeDadosFight: AnuncioFight[] = Array.from({ length: 30 }, (_, i) => {
    const id = i + 1;
    const modalidade = modalidades[i % modalidades.length];
    const bairro = bairrosGoiania[i % bairrosGoiania.length];
    
    // Distribuição linear exata das fotos: 3 fotos por perfil (Do 1.jpg até o 90.jpg)
    const foto1 = i * 3 + 1;
    const foto2 = i * 3 + 2;
    const foto3 = i * 3 + 3;

    const precos = [75, 90, 100, 120, 140, 160];
    const experiencias = ["3 anos de experiência", "5 anos de experiência", "8 anos de graduação", "Faixa Preta Certificado"];

    return {
        id,
        nome: `Mestre / Personal Fight N° ${id}`,
        modalidade,
        cidade: "Goiânia",
        bairro,
        experiencia: experiencias[i % experiencias.length],
        precoHora: precos[i % precos.length],
        whatsapp: "5562999999999", // Altere para o seu número definitivo caso queira concentrar os leads
        desc: `Treinamento privado focado em alta performance, condicionamento físico extremo e técnica refinada de ${modalidade}. Aulas dinâmicas montadas individualmente tanto para iniciantes focados em queima calórica quanto para atletas avançados.`,
        fotos: [
            `images/${foto1}.jpg`,
            `images/${foto2}.jpg`,
            `images/${foto3}.jpg`
        ]
    };
});
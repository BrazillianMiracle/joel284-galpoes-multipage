const fs = require('fs');
const path = require('path');

// Base de dados com as informações reais para popular o catálogo dinamicamente
const dadosModelos = [
    { local: "DAIA, Anápolis // Eixo BR-060", nome: "Nave Logística Triple A Premium", m2: "22.000", peso: "7", kva: "750", eixo: "45 km", preco: 145000, desc: "Pé-direito de 12 metros livres, docas com niveladores automáticos e sistema de proteção J4." },
    { local: "Perimetral Norte, Goiânia // Setor Goiânia 2", nome: "Centro Logístico Last Mile", m2: "3.100", peso: "5", kva: "75", eixo: "6.2 km", preco: 36000, desc: "Ideal para e-commerce rápido, distribuição urbana direta e cross-docking ágil." },
    { local: "Bairro Feliz, Goiânia // Proximidade Centro", nome: "Galpão Comercial de Matriz", m2: "1.800", peso: "6", kva: "150", eixo: "2.5 km", preco: 22000, desc: "Excelente vão livre sem colunas, pátio frontal murado de brita e portões de segurança duplos." },
    { local: "Distrito Industrial, Aparecida de Goiânia", nome: "Terminal de Cargas e Armazenamento", m2: "4.500", peso: "6", kva: "300", eixo: "12 km", preco: 55000, desc: "Pátio externo asfaltado com 4.000m² para manobra de bitrens e carretas pesadas de grade alta." },
    { local: "Vila Brasília, Aparecida de Goiânia", nome: "Módulo Comercial de Distribuição", m2: "1.200", peso: "4", kva: "45", eixo: "4.8 km", preco: 18000, desc: "Próximo aos principais eixos atacadistas de Goiânia. Escritórios climatizados e mezanino estruturado." },
    { local: "Anel Viário, Senador Canedo", nome: "Complexo Químico / Farmacêutico", m2: "8.000", peso: "6", kva: "500", eixo: "19 km", preco: 95000, desc: "Piso impermeabilizado com resina epóxi de alta densidade e reservatório de água pressurizado." },
    { local: "GO-060, Saída para Trindade", nome: "Showroom / Depósito Comercial", m2: "2.100", peso: "5", kva: "112", eixo: "8.5 km", preco: 29000, desc: "Fachada com vidros temperados refletivos e excelente visibilidade em rodovia de tráfego intenso." },
    { local: "Jardim Guanabara, Goiânia", nome: "Módulo Aeroporto Hub", m2: "3.400", peso: "5", kva: "150", eixo: "1.5 km", preco: 42000, desc: "Perfeito para operadores aéreos logísticos. Ampla área administrativa integrada." },
    { local: "Setor Sul, Goiânia", nome: "Depósito de Distribuição Compacto", m2: "750", peso: "3", kva: "30", axis: "0.5 km", preco: 12500, desc: "Docas para vans e furgões pequenos. Ideal para pequenas transportadoras urbanas." },
    { local: "BR-153, Aparecida de Goiânia", nome: "Mega Centro Logístico Multidocas", m2: "15.000", peso: "6", kva: "450", eixo: "10 km", preco: 210000, desc: "Portaria blindada 24h, bolsão externo para carretas e cross-docking completo com mais de 20 docas." }
];

// Monta o array exato de 100 anúncios calculando a sequência matemática de 1.jpg até 300.jpg (3 fotos por card)
let todosAnuncios = [];
let contadorFoto = 1;

for (let i = 1; i <= 100; i++) {
    let modelo = dadosModelos[(i - 1) % dadosModelos.length];
    todosAnuncios.push({
        id: i,
        local: modelo.local,
        nome: `${modelo.nome} #Ref ${String(i).padStart(3, '0')}`,
        m2: modelo.m2,
        peso: modelo.peso,
        kva: modelo.kva,
        eixo: modelo.eixo || "10 km",
        preco: modelo.preco,
        desc: modelo.desc,
        fotos: [
            `images/${contadorFoto++}.jpg`,
            `images/${contadorFoto++}.jpg`,
            `images/${contadorFoto++}.jpg`
        ]
    });
}

// Função geradora de template HTML limpo com CSS e Scripts Inline
function compilarPaginaHtml(numeroPagina, anunciosPagina) {
    
    // Monta os links corretos de paginação (index.html para a 1, e paginaX.html para o resto)
    let botoesPaginacao = '';
    for (let p = 1; p <= 10; p++) {
        let linkDestino = p === 1 ? 'index.html' : `pagina${p}.html`;
        if (p === numeroPagina) {
            botoesPaginacao += `
                <a href="${linkDestino}" class="bg-[#FFD700] text-[#0D1117] font-black px-4 py-2 rounded-xl text-xs border border-[#FFD700] shadow-md transition-all">${p}</a>
            `;
        } else {
            botoesPaginacao += `
                <a href="${linkDestino}" class="bg-white hover:bg-zinc-100 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-all">${p}</a>
            `;
        }
    }

    // Gera o Grid de cards injetando dinamicamente os caminhos matemáticos das fotos
    let gradeCards = anunciosPagina.map(anuncio => `
        <div class="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-[#FFD700] transition-all duration-300 flex flex-col justify-between group" data-price="${anuncio.preco}">
            <div class="space-y-1">
                <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img src="${anuncio.fotos[0]}" alt="Foto principal" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='images/hero.jpg'">
                    <span class="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">Disponível</span>
                </div>
                <div class="px-4 pt-2 grid grid-cols-2 gap-1">
                    <div class="aspect-[4/3] bg-slate-200 rounded overflow-hidden">
                        <img src="${anuncio.fotos[1]}" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                    </div>
                    <div class="aspect-[4/3] bg-slate-200 rounded overflow-hidden">
                        <img src="${anuncio.fotos[2]}" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                    </div>
                </div>
            </div>
            <div class="p-4 space-y-3 flex-grow flex flex-col justify-between mt-1">
                <div class="space-y-1">
                    <span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase block">${anuncio.local}</span>
                    <h3 class="text-sm font-bold uppercase text-[#0D1117] tracking-tight line-clamp-1">${anuncio.nome}</h3>
                    <p class="text-xs text-slate-500 font-medium line-clamp-2">${anuncio.desc}</p>
                    
                    <div class="grid grid-cols-2 gap-y-1.5 gap-x-2 pt-2 text-[10px] font-bold text-slate-600">
                        <div><i class="fa-solid fa-chart-area text-[#E6C200] mr-1"></i>${anuncio.m2} m²</div>
                        <div><i class="fa-solid fa-weight-hanging text-[#E6C200] mr-1"></i>${anuncio.peso} Ton/m²</div>
                        <div><i class="fa-solid fa-bolt text-[#E6C200] mr-1"></i>${anuncio.kva} KVA</div>
                        <div><i class="fa-solid fa-route text-[#E6C200] mr-1"></i>Eixo: ${anuncio.eixo}</div>
                    </div>
                </div>
                
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div class="space-y-0.5">
                        <span class="block text-[8px] font-bold uppercase text-zinc-400">Locação Mensal</span>
                        <span class="text-sm font-black text-[#0D1117]">R$ ${anuncio.preco.toLocaleString('pt-BR')}</span>
                    </div>
                    <a href="https://wa.me/5562999999999?text=Interesse%20no%20Galpao%20Ref%20${anuncio.id}" target="_blank" class="bg-[#0D1117] hover:bg-[#FFD700] text-white hover:text-[#0D1117] text-xs font-bold px-3 py-2 rounded-xl transition-all">
                        <i class="fa-brands fa-whatsapp"></i> Falar com Consultor
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galpões Goiânia v2.0 // Terminal de Negócios Logísticos - Página ${numeroPagina}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        goiania: {
                            yellow: '#FFD700',
                            yellowDark: '#E6C200',
                            dark: '#0D1117',
                            slateBg: '#F8FAFC',
                            cardBorder: '#E2E8F0'
                        }
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F1F5F9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    </style>
</head>
<body class="bg-goiania-slateBg text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-goiania-yellow selection:text-goiania-dark">

    <header class="bg-goiania-dark text-white sticky top-0 z-50 border-b border-zinc-800 shadow-md backdrop-blur-md bg-opacity-95">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <a href="index.html" class="bg-goiania-yellow text-goiania-dark font-black px-3 py-1 rounded text-base sm:text-xl tracking-tighter uppercase block">
                    GALPÕES GOIÂNIA <span class="text-[10px] align-super text-zinc-500">V2</span>
                </a>
            </div>
            <nav class="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <span class="text-goiania-yellow">Página Atual: ${numeroPagina} / 10</span>
            </nav>
            <a href="https://wa.me/5562999999999?text=Quero%20anunciar%20meu%20galp%C3%A3o%20na%20plataforma" target="_blank"
               class="bg-goiania-yellow hover:bg-goiania-yellowDark text-goiania-dark font-black px-5 py-2 rounded-lg text-xs uppercase transition-all duration-200 transform hover:scale-[1.02] tracking-wider">
                Anunciar Imóvel
            </a>
        </div>
    </header>

    <section class="hero-section" style="background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('images/hero.jpg') no-repeat center center/cover; min-height: 45vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 40px 20px; color: #ffffff;">
        <div class="hero-content" style="max-width: 900px; width: 100%;">
            <span style="background-color: rgba(255, 193, 7, 0.2); color: #ffc107; padding: 6px 16px; border-radius: 20px; font-size: 11pt; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; border: 1px solid rgba(255, 193, 7, 0.4);">
                Logística de Alta Performance
            </span>
            <h1 style="font-size: 28pt; font-weight: 900; text-transform: uppercase; margin: 21px 0 12px 0; line-height: 1.2; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
                Infraestrutura Industrial Estratégica
            </h1>
            <p style="font-size: 13pt; color: #e0e0e0; max-width: 650px; margin: 0 auto; line-height: 1.5; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);">
                Filtragem instantânea local da página ${numeroPagina} — Catálogo Estático Otimizado sem Erros.
            </p>
        </div>
    </section>

    <main class="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow w-full">
        
        <aside class="lg:col-span-1 space-y-6 h-fit lg:sticky lg:top-24">
            <div class="bg-white p-5 rounded-2xl border border-goiania-cardBorder shadow-sm space-y-6">
                <div class="flex items-center gap-2 border-b pb-4 border-slate-100">
                    <i class="fa-solid fa-sliders text-goiania-dark"></i>
                    <h2 class="font-bold text-sm uppercase text-goiania-dark tracking-wide">Refinar Painel</h2>
                </div>

                <div class="space-y-2">
                    <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Busca Textual Local</label>
                    <div class="relative">
                        <input type="text" id="search-input" placeholder="Buscar nesta página..." 
                               class="w-full pl-3 pr-10 py-3 rounded-xl border border-goiania-cardBorder focus:outline-none focus:border-goiania-dark text-xs bg-slate-50 text-slate-800 font-medium">
                        <i class="fa-solid fa-magnifying-glass absolute right-3.5 top-3.5 text-slate-400 text-xs"></i>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Locação Teto</label>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <input type="range" min="10000" max="250000" step="5000" value="250000" id="price-range" class="w-full accent-goiania-dark cursor-pointer">
                        <div class="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                            <span>Mín: R$ 10k</span>
                            <span class="text-goiania-dark font-black" id="price-display">R$ 250.000/mês</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <section class="lg:col-span-3 space-y-6">
            <div class="bg-white px-5 py-3 rounded-xl border border-goiania-cardBorder shadow-sm flex justify-between items-center">
                <span class="text-xs font-bold uppercase text-slate-500 tracking-wider"><i class="fa-solid fa-list-check text-goiania-dark mr-1"></i> Terminais Disponíveis</span>
                <span class="text-[11px] font-black bg-goiania-dark text-white px-3 py-1 rounded-full" id="counter-display">10 Ativos Exibidos</span>
            </div>

            <div id="galpoes-wrapper" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                ${gradeCards}
            </div>

            <div class="flex flex-wrap justify-center items-center gap-2 pt-8 border-t border-slate-200">
                ${botoesPaginacao}
            </div>
        </section>
    </main>

    <footer class="bg-goiania-dark text-zinc-500 text-xs py-6 border-t border-zinc-800 text-center mt-auto">
        <p>© 2026 Galpões Goiânia. Todos os ativos e estilos estruturados inline para máxima fidelidade.</p>
    </footer>

    <script>
        class TerminalAtivosEngine {
            constructor() {
                this.searchInput = document.getElementById("search-input");
                this.priceRange = document.getElementById("price-range");
                this.priceDisplay = document.getElementById("price-display");
                this.counterDisplay = document.getElementById("counter-display");
                this.wrapper = document.getElementById("galpoes-wrapper");
                this.cards = this.wrapper ? this.wrapper.querySelectorAll("[data-price]") : [];
                this.init();
            }

            init() {
                if (this.searchInput) this.searchInput.addEventListener("input", () => this.handleFilteringState());
                if (this.priceRange) {
                    this.priceRange.addEventListener("input", (e) => {
                        const parsedValue = parseInt(e.target.value, 10);
                        this.priceDisplay.textContent = "R$ " + parsedValue.toLocaleString('pt-BR') + "/mês";
                        this.handleFilteringState();
                    });
                }
            }

            handleFilteringState() {
                const searchCriteria = this.searchInput.value.toLowerCase().trim();
                const maxPriceTreshold = parseInt(this.priceRange.value, 10);
                let viableMatches = 0;

                this.cards.forEach((card) => {
                    const cardInnerContent = card.textContent.toLowerCase();
                    const targetPrice = parseInt(card.getAttribute("data-price") || "0", 10);
                    
                    const matchesSearch = cardInnerContent.includes(searchCriteria);
                    const matchesPrice = targetPrice <= maxPriceTreshold;

                    if (matchesSearch && matchesPrice) {
                        card.style.display = "flex";
                        viableMatches++;
                    } else {
                        card.style.display = "none";
                    }
                });

                this.counterDisplay.textContent = viableMatches + " Ativos Mapeados";
            }
        }
        document.addEventListener("DOMContentLoaded", () => {
            new TerminalAtivosEngine();
        });
    </script>
</body>
</html>`;
}

// Executa a gravação física de todas as 10 páginas HTML na raiz do projeto de forma limpa e automática
for (let p = 1; p <= 10; p++) {
    let nomeFinalDoArquivo = p === 1 ? 'index.html' : `pagina${p}.html`;
    
    // Divide logicamente o array gigante para ter exatamente 10 anúncios por página HTML
    let indiceInicio = (p - 1) * 10;
    let indiceFim = indiceInicio + 10;
    let dadosDoSegmento = todosAnuncios.slice(indiceInicio, indiceFim);
    
    let htmlCompilado = compilarPaginaHtml(p, dadosDoSegmento);
    
    fs.writeFileSync(path.join(__dirname, nomeFinalDoArquivo), htmlCompilado, 'utf8');
    console.log(`[SUCESSO] Gerado com fidelidade estática -> ${nomeFinalDoArquivo}`);
}

console.log("\n[OK!] Sistema MPA completo escrito em disco. Sem scripts perdidos e sem styles.css quebrados!");
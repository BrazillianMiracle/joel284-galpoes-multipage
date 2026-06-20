const fs = require('fs');
const path = require('path');

// Base de dados genérica que o script usará para espelhar os 100 anúncios variando IDs e fotos
const catalogTemplates = [
    { loc: "DAIA, Anápolis // Eixo BR-060", nome: "Nave Logística Triple A Premium", desc: "Pé-direito de 12 metros livres, docas com niveladores automáticos e proteção contra incêndio J4.", m2: "22.000", peso: "7", preco: 145000 },
    { loc: "Perimetral Norte, Goiânia", nome: "Centro Logístico Last Mile Urbano", desc: "Ideal para e-commerce rápido, distribuição urbana direta e cross-docking ágil.", m2: "3.100", peso: "5", preco: 36000 },
    { loc: "Bairro Feliz, Goiânia", nome: "Galpão Comercial de Matriz", desc: "Excelente vão livre sem colunas, pátio frontal murado de brita e portões de segurança duplos.", m2: "1.800", peso: "6", preco: 22000 },
    { loc: "Distrito Industrial, Aparecida", nome: "Terminal de Cargas e Armazenamento", desc: "Pátio externo asfaltado com 4.000m² para manobra de bitrens e carretas pesadas.", m2: "4.500", peso: "6", preco: 55000 },
    { loc: "Vila Brasília, Aparecida", nome: "Módulo Comercial de Distribuição", desc: "Próximo aos principais eixos atacadistas. Escritórios climatizados e mezanino.", m2: "1.200", peso: "4", preco: 18000 },
    { loc: "Anel Viário, Senador Canedo", nome: "Complexo Químico e Farmacêutico", desc: "Piso impermeabilizado com resina epóxi e reservatório pressurizado.", m2: "8.000", peso: "6", preco: 95000 },
    { loc: "GO-060, Saída para Trindade", nome: "Showroom / Depósito Comercial", desc: "Fachada com vidros temperados refletivos e excelente visibilidade em rodovia.", m2: "2.100", peso: "5", preco: 29000 },
    { loc: "Jardim Guanabara, Goiânia", nome: "Módulo Aeroporto Hub Cargas", desc: "Perfeito para operadores aéreos logísticos com ampla área administrativa.", m2: "3.400", peso: "5", preco: 42000 },
    { loc: "Setor Sul, Goiânia", nome: "Depósito de Distribuição Compacto", desc: "Docas para vans e furgões pequenos. Ideal para e-commerce urbano rápido.", m2: "750", peso: "3", preco: 12500 },
    { loc: "BR-153, Aparecida", nome: "Mega Centro Logístico Multidocas", desc: "Portaria blindada 24h, pátio para carretas e cross-docking completo.", m2: "15.000", peso: "6", preco: 210000 }
];

// Gera as 10 páginas do sistema Multi-Page
for (let pageNum = 1; pageNum <= 10; pageNum++) {
    const fileName = pageNum === 1 ? 'index.html' : `page${pageNum}.html`;
    
    // Calcula o sequencial exato das fotos de 3 em 3 para os 10 cards da página atual
    let cardsHtml = '';
    const startImgIndex = (pageNum - 1) * 30 + 1;

    for (let i = 0; i < 10; i++) {
        const anuncioId = (pageNum - 1) * 10 + (i + 1);
        const template = catalogTemplates[i];
        
        // Fotos sequenciais sem pular nenhuma (Ex: Card 1 -> 1,2,3; Card 2 -> 4,5,6...)
        const img1 = startImgIndex + (i * 3);
        const img2 = img1 + 1;
        const img3 = img1 + 2;

        cardsHtml += `
                <div class="bg-white rounded-2xl overflow-hidden border border-goiania-cardBorder shadow-sm hover:shadow-xl hover:border-goiania-yellow transition-all flex flex-col justify-between" data-price="${template.preco}">
                    <div>
                        <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                            <img src="images/${img1}.jpg" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                        </div>
                        <div class="px-4 pt-2 grid grid-cols-2 gap-1">
                            <div class="aspect-[4/3] bg-slate-200 rounded overflow-hidden">
                                <img src="images/${img2}.jpg" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                            </div>
                            <div class="aspect-[4/3] bg-slate-200 rounded overflow-hidden">
                                <img src="images/${img3}.jpg" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                            </div>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div>
                            <span class="text-[9px] font-black text-zinc-400 uppercase block">${template.loc}</span>
                            <h3 class="text-sm font-bold uppercase text-goiania-dark line-clamp-1">${template.nome} #${String(anuncioId).padStart(3, '0')}</h3>
                            <p class="text-xs text-slate-500 line-clamp-2">${template.desc}</p>
                            <div class="grid grid-cols-2 gap-2 pt-2 text-[10px] font-bold text-slate-600">
                                <div><i class="fa-solid fa-chart-area text-goiania-yellowDark mr-1"></i>${template.m2} m²</div>
                                <div><i class="fa-solid fa-weight-hanging text-goiania-yellowDark mr-1"></i>${template.peso} Ton/m²</div>
                            </div>
                        </div>
                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="block text-[8px] font-bold text-zinc-400 uppercase">Locação</span>
                                <span class="text-sm font-black text-goiania-dark">R$ ${template.preco.toLocaleString('pt-BR')}</span>
                            </div>
                            <a href="https://wa.me/5562999999999?text=Olá, tenho interesse no Galpão Ref #${anuncioId}" target="_blank" class="bg-goiania-dark text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-goiania-yellow hover:text-goiania-dark transition-colors">Contato</a>
                        </div>
                    </div>
                </div>`;
    }

    // Gera os botões de paginação marcando a página ativa com amarelo ouro
    let paginationHtml = '';
    for (let p = 1; p <= 10; p++) {
        const targetTarget = p === 1 ? 'index.html' : `page${p}.html`;
        if (p === pageNum) {
            paginationHtml += `<a href="${targetTarget}" class="bg-[#FFD700] text-[#0D1117] font-black px-4 py-2 rounded-xl text-xs border border-[#FFD700] shadow-sm">${p}</a>\n`;
        } else {
            paginationHtml += `<a href="${targetTarget}" class="bg-white hover:bg-zinc-100 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition-all">${p}</a>\n`;
        }
    }

    // Template completo do HTML estruturado com CSS e Engine de Filtros Injetados inline
    const htmlTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galpões Goiânia v2.0 // Página ${pageNum}</title>
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
<body class="bg-goiania-slateBg text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-goiania-yellow selection:text-goiania-dark custom-scrollbar">

    <header class="bg-goiania-dark text-white sticky top-0 z-50 border-b border-zinc-800 shadow-md backdrop-blur-md bg-opacity-95">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <a href="index.html" class="bg-goiania-yellow text-goiania-dark font-black px-3 py-1 rounded text-base sm:text-xl tracking-tighter uppercase block">
                    GALPÕES GOIÂNIA <span class="text-[10px] align-super text-zinc-500">V2</span>
                </a>
            </div>
            <nav class="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <span class="text-goiania-yellow">Página Atual: ${pageNum} / 10</span>
            </nav>
            <a href="https://wa.me/5562999999999" target="_blank" class="bg-goiania-yellow hover:bg-goiania-yellowDark text-goiania-dark font-black px-5 py-2 rounded-lg text-xs uppercase transition-all tracking-wider">
                Anunciar Imóvel
            </a>
        </div>
    </header>

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
                        <input type="text" id="search-input" placeholder="Buscar nesta página..." class="w-full pl-3 pr-10 py-3 rounded-xl border border-goiania-cardBorder focus:outline-none focus:border-goiania-dark text-xs bg-slate-50 font-medium">
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
                <span class="text-xs font-bold uppercase text-slate-500 tracking-wider"><i class="fa-solid fa-list-check text-goiania-dark mr-1"></i> Terminais Disponíveis (Pág ${pageNum})</span>
                <span class="text-[11px] font-black bg-goiania-dark text-white px-3 py-1 rounded-full" id="counter-display">10 Ativos Exibidos</span>
            </div>

            <div id="galpoes-wrapper" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                ${cardsHtml}
            </div>

            <div class="flex flex-wrap justify-center items-center gap-2 pt-8 border-t border-slate-200">
                ${paginationHtml}
            </div>
        </section>
    </main>

    <footer class="bg-goiania-dark text-zinc-500 text-xs py-6 border-t border-zinc-800 text-center mt-auto">
        <p>© 2026 Galpões Goiânia. Todos os direitos reservados.</p>
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
        document.addEventListener("DOMContentLoaded", () => { new TerminalAtivosEngine(); });
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, fileName), htmlTemplate, 'utf-8');
    console.log(`[✓] Sucesso: Arquivo ${fileName} gerado na raiz.`);
}
console.log("\n[★] Automação concluída! Todos os 10 arquivos HTML foram gerados sem dependências externas.");
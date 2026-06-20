const fs = require('fs');
const path = require('path');

// Base de dados com 10 templates tipificados de alta qualidade para rotacionar dinamicamente
const catalogTemplates = [
    { loc: "DAIA, Anápolis // Distrito Industrial", nome: "Nave Logística Triple A Premium", desc: "Pé-direito de 12 metros livres, docas com niveladores automáticos, sistema de sprinkler J4 completo e pátio fortificado para manobras de alta tonelagem.", m2: "22.000", peso: "7", preco: 145000 },
    { loc: "Perimetral Norte, Goiânia // Saída GO-080", nome: "Centro Logístico Last Mile Urbano", desc: "Ideal para e-commerce de alto giro, distribuição urbana ultra-rápida, cross-docking ágil e monitoramento inteligente perimetral 24 horas.", m2: "3.100", peso: "5", preco: 36000 },
    { loc: "Bairro Feliz, Goiânia // Próximo à BR-153", nome: "Galpão Comercial de Matriz Atacadista", desc: "Excelente vão livre 100% aproveitável sem colunas centrais, pátio frontal murado em brita britada de alta drenagem e portões de segurança duplos.", m2: "1.800", peso: "6", preco: 22000 },
    { loc: "Distrito Industrial, Aparecida de Goiânia", nome: "Terminal de Cargas e Armazenamento Pesado", desc: "Pátio externo asfaltado com mais de 4.000m² exclusivos para manobra e pernoite de bitrens, rodotrens e carretas pesadas de longo curso.", m2: "4.500", peso: "6", preco: 55000 },
    { loc: "Vila Brasília, Aparecida // Próximo ao Eixo", nome: "Módulo Comercial de Distribuição e Estoque", desc: "Localização estratégica adjacente aos principais eixos atacadistas do estado. Conta com escritórios executivos climatizados e mezanino estruturado.", m2: "1.200", peso: "4", preco: 18000 },
    { loc: "Anel Viário, Senador Canedo // Polo Industrial", nome: "Complexo Logístico Químico e Farmacêutico", desc: "Piso industrial de alta resistência impermeabilizado com tripla camada de resina epóxi, contenção de resíduos e reservatório d'água pressurizado.", m2: "8.000", peso: "6", preco: 95000 },
    { loc: "GO-060, Goiânia // Km 2 Saída para Trindade", nome: "Showroom Comercial com Depósito Acoplado", desc: "Fachada imponente revestida em vidros temperados refletivos (pele de vidro) oferecendo máxima visibilidade comercial e fluxo constante na rodovia.", m2: "2.100", peso: "5", preco: 29000 },
    { loc: "Jardim Guanabara, Goiânia // Hub Aeroporto", nome: "Módulo Logístico Aeroportuário Hub Cargas", desc: "Posicionado de forma excelente para operadores aéreos logísticos, transportadoras nacionais integradas e ampla estrutura administrativa de suporte.", m2: "3.400", peso: "5", preco: 42000 },
    { loc: "Setor Sul, Goiânia // Área Central", nome: "Depósito de Distribuição Compacto Express", desc: "Docas exclusivas dimensionadas para furgões, vans e veículos leves comerciais. A solução perfeita para entregas e-commerce urgentes e fracionadas.", m2: "750", peso: "3", preco: 12500 },
    { loc: "BR-153, Aparecida de Goiânia // Eixo Federal", nome: "Mega Centro Logístico Multidocas e Cross-Docking", desc: "Segurança armada de última geração com portaria blindada, eclusas de segurança, pátio de espera de carretas de grande porte e fluxo otimizado.", m2: "15.000", peso: "6", preco: 210000 }
];

// Loop principal de geração de 10 páginas (index + page2 até page10)
for (let pageNum = 1; pageNum <= 10; pageNum++) {
    const fileName = pageNum === 1 ? 'index.html' : `page${pageNum}.html`;
    
    // Cálculo matemático estrito para garantir 30 imagens por página (10 cards * 3 imagens cada = 30 imagens consecutivas)
    const startImgIndex = (pageNum - 1) * 30 + 1;
    let cardsHtml = '';

    for (let i = 0; i < 10; i++) {
        const anuncioId = (pageNum - 1) * 10 + (i + 1);
        const template = catalogTemplates[i]; // Rotaciona os 10 templates perfeitamente
        
        // Sequenciamento exato das 3 fotos de cada card sem pular nenhuma do range 1 a 300
        const img1 = startImgIndex + (i * 3);
        const img2 = img1 + 1;
        const img3 = img1 + 2;

        cardsHtml += `
                <div class="bg-white rounded-2xl overflow-hidden border border-goiania-cardBorder shadow-sm hover:shadow-xl hover:border-goiania-yellow transition-all duration-300 flex flex-col justify-between group cursor-pointer" 
                     data-price="${template.preco}" 
                     onclick="openGalleryModal('${anuncioId}', '${template.nome.replace(/'/g, "\\'")}', '${template.loc.replace(/'/g, "\\'")}', '${template.desc.replace(/'/g, "\\'")}', '${template.m2}', '${template.peso}', ${template.preco}, ${img1}, ${img2}, ${img3})">
                    <div>
                        <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                            <img src="images/${img1}.jpg" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='images/hero.jpg'">
                            <div class="absolute top-3 right-3 bg-goiania-dark/80 backdrop-blur-sm text-white font-mono text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                                REF #${String(anuncioId).padStart(3, '0')}
                            </div>
                        </div>
                        <div class="px-4 pt-2 grid grid-cols-2 gap-1.5">
                            <div class="aspect-[4/3] bg-slate-200 rounded-lg overflow-hidden">
                                <img src="images/${img2}.jpg" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                            </div>
                            <div class="aspect-[4/3] bg-slate-200 rounded-lg overflow-hidden">
                                <img src="images/${img3}.jpg" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                            </div>
                        </div>
                    </div>
                    <div class="p-4 space-y-3">
                        <div>
                            <span class="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">${template.loc}</span>
                            <h3 class="text-sm font-bold uppercase text-goiania-dark line-clamp-1 group-hover:text-goiania-yellowDark transition-colors">${template.nome}</h3>
                            <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">${template.desc}</p>
                            <div class="grid grid-cols-2 gap-2 pt-3 text-[10px] font-bold text-slate-600">
                                <div class="bg-slate-50 px-2 py-1.5 rounded-lg flex items-center border border-slate-100"><i class="fa-solid fa-chart-area text-goiania-yellowDark mr-1.5 text-xs"></i>${template.m2} m²</div>
                                <div class="bg-slate-50 px-2 py-1.5 rounded-lg flex items-center border border-slate-100"><i class="fa-solid fa-weight-hanging text-goiania-yellowDark mr-1.5 text-xs"></i>${template.peso} T/m²</div>
                            </div>
                        </div>
                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between" onclick="event.stopPropagation();">
                            <div>
                                <span class="block text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Locação Mensal</span>
                                <span class="text-sm font-black text-goiania-dark">R$ ${template.preco.toLocaleString('pt-BR')}</span>
                            </div>
                            <a href="https://wa.me/5562999999999?text=Olá, vi o anúncio no site e tenho interesse no Galpão Ref #${anuncioId}" target="_blank" class="bg-goiania-dark text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-goiania-yellow hover:text-goiania-dark shadow-sm transition-all duration-200">Contato</a>
                        </div>
                    </div>
                </div>`;
    }

    // Geração perfeita da paginação real (MPA) destacando a página atual em amarelo ouro
    let paginationHtml = '';
    for (let p = 1; p <= 10; p++) {
        const targetUrl = p === 1 ? 'index.html' : `page${p}.html`;
        if (p === pageNum) {
            paginationHtml += `<a href="${targetUrl}" class="bg-[#FFD700] text-[#0D1117] font-black px-4 py-2 rounded-xl text-xs border border-[#FFD700] shadow-md z-10">${p}</a>\n`;
        } else {
            paginationHtml += `<a href="${targetUrl}" class="bg-white hover:bg-zinc-100 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 shadow-sm transition-all duration-200">${p}</a>\n`;
        }
    }

    // Template HTML completo com o Modal Interativo UI/UX injetado diretamente em cada página
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

    <header class="bg-goiania-dark text-white sticky top-0 z-40 border-b border-zinc-800 shadow-md backdrop-blur-md bg-opacity-95">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <a href="index.html" class="bg-goiania-yellow text-goiania-dark font-black px-3 py-1 rounded text-base sm:text-xl tracking-tighter uppercase block">
                GALPÕES GOIÂNIA <span class="text-[10px] align-super text-zinc-500">V2</span>
            </a>
            <nav class="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <span class="text-goiania-yellow">Página Atual: ${pageNum} / 10</span>
            </nav>
            <a href="https://wa.me/5562999999999" target="_blank" class="bg-goiania-yellow hover:bg-goiania-yellowDark text-goiania-dark font-black px-5 py-2 rounded-lg text-xs uppercase transition-all tracking-wider shadow-sm">
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

    <div id="gallery-modal" class="hidden fixed inset-0 z-50 bg-goiania-dark/80 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300 opacity-0" onclick="closeGalleryModal()">
        <div class="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col md:flex-row" onclick="event.stopPropagation();">
            
            <div class="md:w-1/2 bg-slate-900 p-4 flex flex-col justify-between gap-4">
                <div class="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-800">
                    <img id="modal-main-img" src="" class="w-full h-full object-cover transition-all duration-300">
                </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-goiania-yellow transition-all" onclick="changeModalPreview(0)">
                        <img id="modal-thumb-0" src="" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                    </div>
                    <div class="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-goiania-yellow transition-all" onclick="changeModalPreview(1)">
                        <img id="modal-thumb-1" src="" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                    </div>
                    <div class="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-goiania-yellow transition-all" onclick="changeModalPreview(2)">
                        <img id="modal-thumb-2" src="" class="w-full h-full object-cover" onerror="this.src='images/hero.jpg'">
                    </div>
                </div>
            </div>

            <div class="md:w-1/2 p-6 flex flex-col justify-between space-y-6">
                <div>
                    <div class="flex justify-between items-start">
                        <span id="modal-loc" class="text-[10px] font-black text-zinc-400 uppercase tracking-wider"></span>
                        <button onclick="closeGalleryModal()" class="text-slate-400 hover:text-goiania-dark text-lg p-1 transition-colors"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <h2 id="modal-title" class="text-xl font-extrabold uppercase text-goiania-dark mt-1 tracking-tight"></h2>
                    
                    <span class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md mt-2 border border-emerald-200">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Imóvel Verificado & Disponível
                    </span>

                    <p id="modal-desc" class="text-xs text-slate-600 mt-4 leading-relaxed font-medium"></p>
                    
                    <div class="grid grid-cols-2 gap-3 mt-6">
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Área Construída</span>
                            <div class="text-sm font-black text-goiania-dark mt-0.5"><i class="fa-solid fa-chart-area text-goiania-yellowDark mr-1"></i><span id="modal-m2"></span> m²</div>
                        </div>
                        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Piso Industrial</span>
                            <div class="text-sm font-black text-goiania-dark mt-0.5"><i class="fa-solid fa-weight-hanging text-goiania-yellowDark mr-1"></i><span id="modal-peso"></span> T/m²</div>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Valor do Aluguel</span>
                        <span id="modal-price" class="text-xl font-black text-goiania-dark tracking-tight"></span>
                    </div>
                    <a id="modal-wa-link" href="" target="_blank" class="bg-goiania-dark text-white text-xs font-bold px-5 py-3 rounded-xl hover:bg-goiania-yellow hover:text-goiania-dark shadow-md flex items-center gap-2 transition-all duration-200">
                        <i class="fa-brands fa-whatsapp text-sm"></i> Falar com Corretor
                    </a>
                </div>
            </div>

        </div>
    </div>

    <script>
        let modalImages = [];

        function openGalleryModal(id, nome, loc, desc, m2, peso, preco, im1, im2, im3) {
            modalImages = [\`images/\${im1}.jpg\`, \`images/\${im2}.jpg\`, \`images/\${im3}.jpg\`];
            
            document.getElementById('modal-title').textContent = nome + " #" + String(id).padStart(3, '0');
            document.getElementById('modal-loc').textContent = loc;
            document.getElementById('modal-desc').textContent = desc;
            document.getElementById('modal-m2').textContent = m2;
            document.getElementById('modal-peso').textContent = peso;
            document.getElementById('modal-price').textContent = "R$ " + preco.toLocaleString('pt-BR') + "/mês";
            document.getElementById('modal-wa-link').href = "https://wa.me/5562999999999?text=" + encodeURIComponent("Olá! Desejo agendar uma visita ao Galpão Ref #" + String(id).padStart(3, '0') + " (" + nome + ").");
            
            const mainImg = document.getElementById('modal-main-img');
            mainImg.src = modalImages[0];
            mainImg.onerror = function() { this.src = 'images/hero.jpg'; };

            for(let k=0; k<3; k++) {
                const th = document.getElementById('modal-thumb-' + k);
                th.src = modalImages[k];
                th.parentElement.classList.remove('border-goiania-yellow');
                if(k === 0) th.parentElement.classList.add('border-goiania-yellow');
            }

            const m = document.getElementById('gallery-modal');
            m.classList.remove('hidden');
            setTimeout(() => { m.classList.remove('opacity-0'); }, 10);
        }

        function changeModalPreview(idx) {
            const mainImg = document.getElementById('modal-main-img');
            mainImg.src = modalImages[idx];
            mainImg.onerror = function() { this.src = 'images/hero.jpg'; };

            for(let k=0; k<3; k++) {
                document.getElementById('modal-thumb-' + k).parentElement.classList.remove('border-goiania-yellow');
            }
            document.getElementById('modal-thumb-' + idx).parentElement.classList.add('border-goiania-yellow');
        }

        function closeGalleryModal() {
            const m = document.getElementById('gallery-modal');
            m.classList.add('opacity-0');
            setTimeout(() => { m.classList.add('hidden'); }, 300);
        }

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
                this.counterDisplay.textContent = viableMatches + " Ativos Exibidos";
            }
        }
        document.addEventListener("DOMContentLoaded", () => { new TerminalAtivosEngine(); });
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, fileName), htmlTemplate, 'utf-8');
    console.log(`[✓] Sucesso: Arquivo ${fileName} gerado na raiz.`);
}
console.log("\n[★] Concluído! Todos os arquivos HTML (1 a 10) agora possuem 10 anúncios cada e efeitos UI/UX de clique e expansão.");
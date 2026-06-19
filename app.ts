import { bancoDeDadosFight, AnuncioFight } from './database';

class GoiasFightEngine {
    private wrapper: HTMLElement | null = document.getElementById("fight-wrapper");
    private searchInput: HTMLInputElement | null = document.getElementById("search-input") as HTMLInputElement;
    private modalidadeFilter: HTMLSelectElement | null = document.getElementById("modalidade-filter") as HTMLSelectElement;
    private modal: HTMLElement | null = document.getElementById("fight-modal");
    private counterDisplay: HTMLElement | null = document.getElementById("counter-display");

    private itemsPerPage: number = 10;
    private pageNumber: number = 1;

    constructor(pageNumber: number) {
        this.pageNumber = pageNumber || 1;
        this.initListeners();
        this.processAndRender();
        this.renderPagination();
    }

    private initListeners(): void {
        const render = () => this.processAndRender();
        this.searchInput?.addEventListener("input", render);
        this.modalidadeFilter?.addEventListener("change", render);
    }

    private processAndRender(): void {
        const busca = this.searchInput?.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        const modalidade = this.modalidadeFilter?.value || "todas";

        const filtrados = bancoDeDadosFight.filter(a => {
            const matchesModalidade = modalidade === "todas" || a.modalidade === modalidade;
            const textoMassa = `${a.nome} ${a.bairro} ${a.desc} ${a.modalidade}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return matchesModalidade && (!busca || textoMassa.includes(busca));
        });

        let listaExibicao: AnuncioFight[] = [];

        if (busca || modalidade !== "todas") {
            listaExibicao = filtrados;
            if (this.counterDisplay) this.counterDisplay.textContent = `${listaExibicao.length} ENCONTRADOS`;
        } else {
            const start = (this.pageNumber - 1) * this.itemsPerPage;
            listaExibicao = bancoDeDadosFight.slice(start, start + this.itemsPerPage);
            if (this.counterDisplay) this.counterDisplay.textContent = `PÁGINA ${this.pageNumber} DE 3`;
        }

        this.renderCards(listaExibicao);
    }

    private renderCards(lista: AnuncioFight[]): void {
        if (!this.wrapper) return;
        this.wrapper.innerHTML = "";

        if (lista.length === 0) {
            this.wrapper.innerHTML = `
                <div class="col-span-full text-center py-16 text-zinc-400 font-bold text-xs uppercase tracking-wider bg-zinc-900 rounded-2xl border border-zinc-800">
                    Nenhum personal fight localizado com esses critérios.
                </div>`;
            return;
        }

        lista.forEach(a => {
            const card = document.createElement("div");
            card.className = "bg-zinc-900 text-white rounded-2xl overflow-hidden border border-zinc-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer";
            card.addEventListener("click", () => this.abrirModal(a));

            card.innerHTML = `
                <div class="space-y-1">
                    <div class="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                        <img src="${a.fotos[0]}" alt="${a.nome}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                        <span class="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">Disponível</span>
                    </div>
                    <div class="px-4 pt-2 grid grid-cols-2 gap-1.5">
                        ${a.fotos.slice(1).map(f => `
                            <div class="aspect-[16/10] bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                                <img src="${f}" loading="lazy" class="w-full h-full object-cover">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="p-5 space-y-4 flex-grow flex flex-col justify-between">
                    <div class="space-y-1">
                        <span class="text-[9px] font-black tracking-widest text-red-500 uppercase block">${a.modalidade} // ${a.bairro}</span>
                        <h3 class="text-sm font-black uppercase text-white tracking-tight line-clamp-1 group-hover:text-red-500 transition-colors">${a.nome}</h3>
                        <p class="text-xs text-zinc-400 font-medium line-clamp-2 leading-relaxed">${a.desc}</p>
                        <div class="pt-3 text-[10px] font-bold text-zinc-400 border-t border-zinc-800 mt-2">
                            <i class="fa-solid fa-graduation-cap text-red-500 mr-1.5"></i>${a.experiencia}
                        </div>
                    </div>
                    <div class="pt-3 border-t border-zinc-800 flex items-center justify-between mt-2">
                        <div class="space-y-0.5">
                            <span class="block text-[8px] font-bold uppercase text-zinc-500">Valor / Hora</span>
                            <span class="text-sm font-black text-white">R$ ${a.precoHora}/h</span>
                        </div>
                        <button class="bg-red-600 text-white group-hover:bg-white group-hover:text-black text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-colors">Ver Perfil</button>
                    </div>
                </div>`;
            this.wrapper.appendChild(card);
        });
    }

    private renderPagination(): void {
        document.querySelectorAll(".pagination-container").forEach(container => {
            container.innerHTML = "";
            const frag = document.createDocumentFragment();

            for (let i = 1; i <= 3; i++) {
                const link = document.createElement("a");
                link.href = i === 1 ? "index.html" : `page${i}.html`;
                link.textContent = i.toString();
                link.className = i === this.pageNumber
                    ? "bg-red-600 text-white text-xs font-black w-9 h-9 flex items-center justify-center rounded-xl shadow-sm cursor-default pointer-events-none"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-black w-9 h-9 flex items-center justify-center rounded-xl transition-all";
                frag.appendChild(link);
            }
            container.appendChild(frag);
        });
    }

    private abrirModal(a: AnuncioFight): void {
        if (!this.modal) return;

        this.modal.innerHTML = `
            <div class="bg-zinc-900 text-white w-full max-w-[900px] max-h-[92vh] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative flex flex-col md:flex-row overflow-y-auto custom-scrollbar">
                <button class="absolute top-4 right-4 bg-red-600 text-white hover:bg-white hover:text-black w-9 h-9 rounded-full flex items-center justify-center font-black text-sm z-50 cursor-pointer" id="close-modal-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="w-full md:w-1/2 bg-zinc-950 p-4 flex flex-col justify-between gap-4">
                    <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
                        <img id="modal-main-view" src="${a.fotos[0]}" alt="Principal" class="w-full h-full object-cover">
                    </div>
                    <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        ${a.fotos.map((foto, index) => `
                            <img src="${foto}" alt="Foto ${index + 1}" class="w-20 h-14 object-cover rounded-xl border-2 ${index === 0 ? 'border-red-600' : 'border-transparent'} hover:border-red-600 cursor-pointer transition-all thumb-img">
                        `).join('')}
                    </div>
                </div>
                <div class="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div>
                        <span class="text-[10px] font-black tracking-widest text-red-500 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded uppercase">${a.modalidade} // Goiânia</span>
                        <h2 class="text-xl font-black text-white tracking-tight uppercase mt-3">${a.nome}</h2>
                        <p class="text-zinc-400 text-xs leading-relaxed mt-3 font-medium">${a.desc}</p>
                        <div class="grid grid-cols-2 gap-3 pt-4">
                            <div class="bg-zinc-950 p-3 rounded-xl border border-zinc-800"><span class="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Região Metropolitana</span><strong class="text-xs font-black text-white"><i class="fa-solid fa-location-dot mr-1.5 text-red-500"></i>${a.bairro}</strong></div>
                            <div class="bg-zinc-950 p-3 rounded-xl border border-zinc-800"><span class="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider">Experiência</span><strong class="text-xs font-black text-white"><i class="fa-solid fa-graduation-cap mr-1.5 text-red-500"></i>Graduado</strong></div>
                        </div>
                    </div>
                    <div class="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div class="space-y-0.5">
                            <span class="block text-[9px] font-bold uppercase text-zinc-500">Hora / Aula</span>
                            <span class="text-lg font-black text-white">R$ ${a.precoHora} <span class="text-[10px] text-zinc-500 font-medium">/hora</span></span>
                        </div>
                        <a href="https://wa.me/${a.whatsapp}?text=Olá,%20vi%20seu%20anúncio%2520no%20Goiás%2520Fight%20e%20gostaria%20de%20agendar%20um%20treino%20de%20${encodeURIComponent(a.modalidade)}" target="_blank" class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase px-4 py-3 rounded-xl text-center transition-all flex items-center justify-center gap-2"><i class="fa-brands fa-whatsapp text-sm"></i> Chamar no Whats</a>
                    </div>
                </div>
            </div>`;

        const mainView = document.getElementById("modal-main-view") as HTMLImageElement;
        const thumbs = document.querySelectorAll(".thumb-img");
        thumbs.forEach(thumb => {
            thumb.addEventListener("click", (e: Event) => {
                const target = e.target as HTMLImageElement;
                if (mainView && target) {
                    mainView.src = target.src;
                    thumbs.forEach(t => t.classList.remove("border-red-600"));
                    target.classList.add("border-red-600");
                }
            });
        });

        document.getElementById("close-modal-btn")?.addEventListener("click", () => this.fecharModal());
        this.modal.classList.remove("opacity-0", "pointer-events-none");
        document.body.style.overflow = "hidden";
    }

    private fecharModal(): void {
        if (!this.modal) return;
        this.modal.classList.add("opacity-0", "pointer-events-none");
        document.body.style.overflow = "";
    }
}

(window as any).initFightPage = (page: number) => {
    new GoiasFightEngine(page);
};
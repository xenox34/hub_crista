// Base de données des outils OSINT
const osintTools = [
    // Pseudonymes
    {
        name: "WhatsMyName",
        category: "username",
        desc: "Recherche un nom d'utilisateur sur des centaines de sites web et plateformes sociales simultanément.",
        url: "https://whatsmyname.app",
        tags: ["Usernames", "Social Media", "OSINT"],
        icon: "fa-user-ninja"
    },
    {
        name: "Sherlock Project",
        category: "username",
        desc: "Outil puissant d'investigation pour traquer des comptes utilisateurs sur une multitude de réseaux.",
        url: "https://sherlock-project.github.io",
        tags: ["Python", "CLI", "Username"],
        icon: "fa-magnifying-glass"
    },
    {
        name: "Namechk",
        category: "username",
        desc: "Vérifiez la disponibilité et l'existence d'un pseudo ou nom de domaine sur les plateformes Web2 & Web3.",
        url: "https://namechk.com",
        tags: ["Usernames", "Domains"],
        icon: "fa-id-badge"
    },

    // Imagerie & Géolocalisation
    {
        name: "Yandex Images",
        category: "image",
        desc: "Moteur de recherche inversée d'images extrêmement puissant pour reconnaître visages et lieux.",
        url: "https://yandex.com/images",
        tags: ["Reverse Image", "Recognition"],
        icon: "fa-image"
    },
    {
        name: "GeoSpy AI",
        category: "image",
        desc: "Plateforme IA capable de déterminer la géolocalisation d'une photo grâce aux indices visuels.",
        url: "https://geospy.web.app",
        tags: ["AI", "Geolocation"],
        icon: "fa-earth-americas"
    },
    {
        name: "SunCalc",
        category: "image",
        desc: "Calcule le mouvement du soleil et des ombres pour déterminer l'heure et le lieu précis d'une photo.",
        url: "https://www.suncalc.org",
        tags: ["Chronolocation", "Shadows"],
        icon: "fa-sun"
    },
    {
        name: "ExifTool Online",
        category: "image",
        desc: "Analyse approfondie des métadonnées EXIF cachées dans les images (GPS, appareil, date).",
        url: "https://exif.regex.info/exif.cgi",
        tags: ["EXIF", "Metadata", "GPS"],
        icon: "fa-file-image"
    },

    // Réseaux & IP
    {
        name: "Shodan",
        category: "network",
        desc: "Moteur de recherche mondial pour les serveurs, objets connectés (IoT), caméras et routeurs.",
        url: "https://www.shodan.io",
        tags: ["IoT", "Port Scan", "Network"],
        icon: "fa-network-wired"
    },
    {
        name: "Censys",
        category: "network",
        desc: "Analyse des hôtes Internet, certificats SSL/TLS et de l'exposition globale des réseaux.",
        url: "https://censys.io",
        tags: ["Certificates", "Hosts"],
        icon: "fa-server"
    },
    {
        name: "VirusTotal",
        category: "network",
        desc: "Analyse de fichiers, URL, adresses IP et domaines suspects par des dizaines d'antivirus.",
        url: "https://www.virustotal.com",
        tags: ["Malware", "IP Lookup"],
        icon: "fa-shield-virus"
    },

    // Emails & Leaks
    {
        name: "EPIEO",
        category: "email",
        desc: "Recherche de comptes sociaux et profils Google liés à une adresse e-mail ou numéro de téléphone.",
        url: "https://epieos.com",
        tags: ["Email Lookup", "Google ID"],
        icon: "fa-envelope"
    },
    {
        name: "Have I Been Pwned",
        category: "email",
        desc: "Vérifiez si une adresse email ou un compte a été compromis dans une fuite de données publique.",
        url: "https://haveibeenpwned.com",
        tags: ["Breaches", "Leaked Data"],
        icon: "fa-user-shield"
    },
    {
        name: "DeHashed",
        category: "email",
        desc: "Moteur de recherche de fuites de données pour auditer les identifiants et hashs compromis.",
        url: "https://dehashed.com",
        tags: ["Data Leak", "Hashes"],
        icon: "fa-database"
    },

    // Réseaux Sociaux
    {
        name: "Social Searcher",
        category: "social",
        desc: "Moteur de recherche de médias sociaux en temps réel. Analyse de mentions publiques et tendances.",
        url: "https://www.social-searcher.com",
        tags: ["Social Media", "Realtime"],
        icon: "fa-hashtag"
    },

    // Archives & Web
    {
        name: "Wayback Machine",
        category: "web",
        desc: "Explorez les versions archivées et l'historique passé de n'importe quel site web.",
        url: "https://web.archive.org",
        tags: ["Archive", "History"],
        icon: "fa-clock-rotate-left"
    },
    {
        name: "CyberChef",
        category: "web",
        desc: "Outil complet de traitement de données : encodage, décodage, déchiffrement et analyse.",
        url: "https://gchq.github.io/CyberChef",
        tags: ["Decoder", "Crypto", "Utility"],
        icon: "fa-kitchen-set"
    }
];

// Modèles de Google Dorks
const dorkTemplates = [
    { title: "Fichiers PDF / Documents sensibles", query: 'site:{target} filetype:pdf OR filetype:doc OR filetype:xlsx "confidentiel"' },
    { title: "Répertoires ouverts (Open Directories)", query: 'site:{target} intitle:"index of" "parent directory"' },
    { title: "Pages de Connexion / Panneaux Admin", query: 'site:{target} inurl:admin OR inurl:login OR inurl:dashboard' },
    { title: "Fichiers de Configuration & Logs", query: 'site:{target} ext:env OR ext:log OR ext:db OR ext:sql' }
];

// État global
let currentCategory = 'all';

// Éléments du DOM
const toolsGrid = document.getElementById('toolsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const emptyState = document.getElementById('emptyState');
const dorkTargetInput = document.getElementById('dorkTarget');
const dorksListContainer = document.getElementById('dorksList');

// Initialisation
function init() {
    document.getElementById('count-all').innerText = osintTools.length;
    renderTools();
    renderDorks();

    // Recherche texte
    searchInput.addEventListener('input', () => renderTools());

    // Filtres par catégorie
    categoryFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-btn');
        if (!btn) return;

        document.querySelectorAll('.cat-btn').forEach(b => {
            b.classList.remove('bg-sky-500', 'text-slate-950', 'font-bold');
            b.classList.add('bg-slate-900', 'text-slate-400');
        });

        btn.classList.remove('bg-slate-900', 'text-slate-400');
        btn.classList.add('bg-sky-500', 'text-slate-950', 'font-bold');

        currentCategory = btn.dataset.category;
        renderTools();
    });

    // Écouteur pour Google Dorks
    dorkTargetInput.addEventListener('input', renderDorks);
}

// Affichage des cartes d'outils
function renderTools() {
    const filterText = searchInput.value.toLowerCase().trim();

    const filteredTools = osintTools.filter(tool => {
        const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;
        const matchesSearch = tool.name.toLowerCase().includes(filterText) ||
                              tool.desc.toLowerCase().includes(filterText) ||
                              tool.tags.some(tag => tag.toLowerCase().includes(filterText));
        return matchesCategory && matchesSearch;
    });

    if (filteredTools.length === 0) {
        toolsGrid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        toolsGrid.innerHTML = filteredTools.map(tool => `
            <div class="glass glass-hover p-6 rounded-2xl flex flex-col justify-between h-full border border-slate-800">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 text-xl">
                            <i class="fa-solid ${tool.icon}"></i>
                        </div>
                        <span class="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                            ${tool.category}
                        </span>
                    </div>

                    <h3 class="text-xl font-bold text-white mb-2">${tool.name}</h3>
                    <p class="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">${tool.desc}</p>
                </div>

                <div>
                    <div class="flex flex-wrap gap-1.5 mb-6">
                        ${tool.tags.map(tag => `<span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">#${tag}</span>`).join('')}
                    </div>

                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" 
                       class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-slate-950 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all border border-slate-800">
                        <span>OUVRIR L'OUTIL</span>
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }
}

// Affichage et génération des Dorks
function renderDorks() {
    const target = dorkTargetInput.value.trim() || 'example.com';

    dorksListContainer.innerHTML = dorkTemplates.map(template => {
        const finalQuery = template.query.replace(/{target}/g, target);
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;

        return `
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="overflow-hidden">
                    <div class="text-xs font-bold text-slate-300 mb-1 flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                        ${template.title}
                    </div>
                    <div class="text-xs font-mono text-cyan-400 truncate bg-slate-950 p-2 rounded border border-slate-800">
                        ${escapeHtml(finalQuery)}
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button onclick="copyToClipboard('${escapeJsString(finalQuery)}', this)" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition" title="Copier">
                        <i class="fa-solid fa-copy"></i>
                    </button>
                    <a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition">
                        <span>Lancer</span>
                        <i class="fa-solid fa-external-link text-[10px]"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = btnElement.querySelector('i');
        icon.className = 'fa-solid fa-check text-emerald-400';
        setTimeout(() => {
            icon.className = 'fa-solid fa-copy';
        }, 2000);
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function escapeJsString(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Lancement au chargement
window.onload = init;

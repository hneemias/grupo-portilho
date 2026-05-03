"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  MoveRight,
  Phone,
  Mail,
  MapPin,
  Maximize,
  X,
  Star,
  Cpu,
  ArrowRight,
  Image as ImageIcon,
  Leaf,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { sendContactMessage } from './actions/contact';

const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), { ssr: false });

export default function Home() {
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [albuns, setAlbuns] = useState<any[]>([]);
  const [parceiros, setParceiros] = useState<any[]>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // LIGHTBOX STATE
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // DYNAMIC MAP DATA (Connected to Supabase)
  const [kpis, setKpis] = useState([
    { valor: "+1.000", titulo: "Clientes Atendidos", label: "", bg: "bg-[#4d523b]" },
    { valor: "+300 MIL", titulo: "Toneladas Carregadas", label: "", bg: "bg-[#6b7054]" },
    { valor: "900 T", titulo: "Entregues p/ Dia", label: "", bg: "bg-[#4d523b]" },
    { valor: "25%", titulo: "Crescimento Ano", label: "2023 x 2022", bg: "bg-[#6b7054]" },
    { valor: "45%", titulo: "Crescimento", label: "2022 x 2021", bg: "bg-[#4d523b]" },
    { valor: "7", titulo: "Regiões Logística", label: "Envios", bg: "bg-[#6b7054]" }
  ]);

  const [mapPins, setMapPins] = useState([
    { id: 'cariri', state: 'Fazenda Santo Antônio (Cariri-TO)', coords: [-11.8906, -49.1558] as [number, number] },
    { id: 'edeia', state: 'Armazém Unidade I (Edéia-GO)', coords: [-17.3371, -49.9304] as [number, number] },
    { id: 'gurupi', state: 'Fazenda Nova Esperança (Gurupi-TO)', coords: [-11.7297, -49.0678] as [number, number] },
    { id: 'sucupira', state: 'Fazenda Santa Rosa (Sucupira-TO)', coords: [-11.9934, -48.6186] as [number, number] },
    { id: 'pium', state: 'Fazenda Vale Verde (Pium-TO)', coords: [-10.4419, -49.1834] as [number, number] },
    { id: 'caseara', state: 'Fazenda N. Sra. da Guia (Caseara-TO)', coords: [-9.2789, -49.9547] as [number, number] },
    { id: 'py', state: 'Fazenda La Amistad (Paraguai)', coords: [-23.5, -56.5] as [number, number] }
  ]);

  // TESTIMONIALS STATE (Connected to Supabase)
  const [testemunhos, setTestemunhos] = useState([
    { id: '1', nome: "Hneemias Barbosa", papel: "Empresário", texto: "Tenho grande admiração pelo profissional que a equipe da Portilho é. Sempre demonstraram ser uma força íntegra, responsável e extremamente dedicada em tudo na logística agro.", estrelas: 5, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    { id: '2', nome: "Marta Nogueira", papel: "Produtora Rural", texto: "A precisão dos silos e a comunicação pontual no envio de safras mudaram o jogo para a nossa fazenda. O nível de cuidado deles com os grãos é surpreendente.", estrelas: 5, avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d" },
    { id: '3', nome: "Carlos Viana", papel: "Diretor Comercial Sementeira", texto: "Confio toda a cadeia de armazenamento ao Grupo Portilho há 4 anos. Nenhuma perda climática e uma gestão de frota absolutamente primorosa.", estrelas: 5, avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d" }
  ]);
  const [testemunhoIndex, setTestemunhoIndex] = useState(0);

  // GLOBAL SETTINGS STATE
  const [configs, setConfigs] = useState<Record<string, string>>({
    footer_phone: '+55 64 8485-2950',
    footer_email: 'contato@grupoportilho.com.br',
    footer_address: 'Avenida Principal, Setor Sul - Edéia - GO, 75940-000',
    wa_number: '55648485295'
  });

  // FETCH SUPABASE DATA
  useEffect(() => {
    const supabase = createClient();

    const fetchData = async () => {
      // Fetch Depoimentos
      const { data: depoimentosData } = await supabase
        .from('gp_depoimentos')
        .select('*')
        .order('created_at', { ascending: false });

      if (depoimentosData && depoimentosData.length > 0) {
        setTestemunhos(depoimentosData.map(d => ({
          id: d.id,
          nome: d.nome,
          papel: d.papel,
          texto: d.texto,
          estrelas: d.estrelas,
          avatar: d.avatar_url || "https://i.pravatar.cc/150"
        })));
      }

      // Fetch KPIs
      const { data: kpisData } = await supabase
        .from('gp_kpis')
        .select('*')
        .order('ordem', { ascending: true });

      if (kpisData && kpisData.length > 0) {
        setKpis(kpisData.map((k, i) => ({
          valor: k.valor,
          titulo: k.label,
          label: k.unidade || "",
          bg: i % 2 === 0 ? "bg-[#4d523b]" : "bg-[#6b7054]"
        })));
      }

      // Fetch Mapa
      const { data, error } = await supabase
        .from('gp_mapa_unidades')
        .select('*');

      if (error) {
        console.error('Erro ao buscar pins:', error);
      } else if (data) {
        const formatted = data.map((item: any) => ({
          id: item.id,
          state: item.nome,
          coords: [item.latitude, item.longitude] as [number, number]
        }));
        setMapPins(formatted);
      }

      // Fetch Configurações
      const { data: configData } = await supabase
        .from('gp_configuracoes')
        .select('*');

      if (configData) {
        const configMap: Record<string, string> = {};
        configData.forEach(c => configMap[c.chave] = c.valor);
        setConfigs(prev => ({ ...prev, ...configMap }));
      }

      // Fetch Álbuns e Galeria
      const { data: albunsData } = await supabase
        .from('gp_albuns')
        .select(`
          *,
          gp_galeria (*)
        `)
        .order('created_at', { ascending: false });

      if (albunsData) {
        setAlbuns(albunsData);
      }

      // Fetch Parceiros
      const { data: parceirosData } = await supabase
        .from('gp_parceiros')
        .select('*')
        .eq('is_ativo', true)
        .order('ordem', { ascending: true });

      if (parceirosData) {
        setParceiros(parceirosData);
      }
    };

    fetchData();
  }, []);

  // LIGHTBOX KEYBOARD NAVIGATION EFFECT
  useEffect(() => {
    if (!lightboxOpen || albuns.length === 0) return;
    const albumAtual = albuns[activeAlbumIndex];
    const fotos = albumAtual?.gp_galeria || [];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => prev === fotos.length - 1 ? 0 : prev + 1);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => prev === 0 ? fotos.length - 1 : prev - 1);
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeAlbumIndex, albuns]);

  // Smooth scroll handler function
  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await sendContactMessage(formData);

    if (result.success) {
      setToastMsg("Sua solicitação foi recebida com sucesso. Nossa equipe entrará em contato!");
      (e.target as HTMLFormElement).reset();
    } else {
      setToastMsg("Erro ao enviar mensagem. Por favor, tente novamente.");
    }

    setFormSubmitting(false);
    setTimeout(() => setToastMsg(null), 5000);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#ffffff] font-inter overflow-hidden relative">

      {/* TOAST SYSTEM (USER RULE #2: ALWAYS USE TOAST NOT ALERT) */}
      {toastMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#031d38] text-[#a3e635] px-6 py-4 rounded-xl shadow-2xl z-[1000] flex items-center gap-3 animate-[fade-in-down_0.3s_ease-out]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="font-bold text-sm tracking-wide">{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-4 hover:opacity-50"><X className="w-4 h-4 text-white" /></button>
        </div>
      )}

      {/* HEADER & HERO WRAPPER */}
      <div id="inicio" className="relative w-full h-auto min-h-[700px] lg:h-[95vh] flex flex-col overflow-hidden">

        {/* Background Image: Imposing Sunset / Harvesters / Cinemático */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/img/Portilho-0025.jpg"
            alt="Grupo Portilho Agro background"
            className="w-full h-full object-cover transform scale-105 motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
          />
          {/* Subtle Glowing Tech Ring Effect (Overpowering the competitor) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#a3e635]/20 rounded-full shadow-[0_0_120px_rgba(163,230,53,0.15)] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#a3e635]/30 rounded-full shadow-[0_0_80px_rgba(163,230,53,0.2)] pointer-events-none" />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#01142e]/95 via-[#01142e]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#01142e] via-transparent to-transparent opacity-80" />
        </div>

        {/* HEADER */}
        <header className="relative z-50 w-full flex items-center justify-between h-28 lg:h-32">
          {/* LEFT: Logo Envelope - Separated aggressively like the competitor's but superior via envelope shape */}
          <div className="h-full bg-white flex items-center px-10 xl:px-16 rounded-br-[80px] shadow-[10px_0_30px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col items-center justify-center">
              <img
                src="/assets/img/logo_completa_traced.svg"
                alt="Grupo Portilho"
                className="h-10 lg:h-14 w-auto object-contain"
              />
            </div>
          </div>

          {/* CENTER: Navigation */}
          <nav className="hidden lg:flex items-center gap-12 font-bold text-white text-[15px] mr-auto pl-16">
            <a href="#inicio" onClick={(e) => smoothScroll(e, 'inicio')} className="relative after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-[3px] after:bg-[#a3e635] after:rounded-full hover:text-[#a3e635] transition-colors">Início</a>
            <a href="#portfolio" onClick={(e) => smoothScroll(e, 'portfolio')} className="hover:text-[#a3e635] transition-colors">Portfólio & Serviços</a>
            <a href="#empresa" onClick={(e) => smoothScroll(e, 'empresa')} className="hover:text-[#a3e635] transition-colors">A Empresa</a>
            <a href="#galeria" onClick={(e) => smoothScroll(e, 'galeria')} className="hover:text-[#a3e635] transition-colors">Infraestrutura</a>
            <a href="#contato" onClick={(e) => smoothScroll(e, 'contato')} className="hover:text-[#a3e635] transition-colors">Contato</a>
          </nav>

          {/* RIGHT: CTA Button */}
          <div className="hidden lg:block pr-8 lg:pr-16">
            <button onClick={(e) => smoothScroll(e, 'contato')} className="bg-[#a3e635] hover:bg-[#84cc16] text-[#051c36] font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]">
              Fale Conosco
            </button>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 flex-1 flex flex-col justify-center pb-20 pt-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-[#a3e635]"></span>
              <span className="text-[#a3e635] font-bold tracking-widest uppercase text-sm">Agronegócio & Logística</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-plus-jakarta font-black text-white leading-[1.1] drop-shadow-2xl">
              Nossa Safra é a <br /><span className="text-[#a3e635]">Força</span> do Futuro.
            </h1>
            <p className="mt-8 text-white/90 text-lg md:text-xl max-w-2xl font-medium leading-relaxed drop-shadow-lg">
              Impulsionando o solo nacional com arquitetura de precisão médica. Do tratamento à base de dados para a sua produção até a exportação nos modais logísticos mais robustos do agronegócio.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <button onClick={(e) => smoothScroll(e, 'portfolio')} className="bg-[#a3e635] hover:bg-[#84cc16] text-[#051c36] font-bold px-10 py-4 rounded-xl transition-all shadow-xl hover:scale-105 flex items-center gap-3">
                Explorar Soluções <MoveRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PORTFÓLIO / NOSSO ECOSSISTEMA SECTION (Dark Texture Style) */}
      <section id="portfolio" className="relative w-full bg-[#1b1c18] py-28 px-8 lg:px-16 overflow-hidden">
        {/* Subtle SVG texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

        {/* Glowing aura center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#a3e635] opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <span className="bg-[#a3e635]/10 text-[#a3e635] px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase border border-[#a3e635]/20">Portfólio Premium</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2 font-plus-jakarta">Nosso Domínio Operacional</h2>
            <p className="text-white/60 text-lg max-w-xl font-medium mx-auto">
              Qualidade impecável garantida do início ao extremo fim da cadeia produtiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              { title: "Agronegócio", desc: "Gestão sustentável e sementes premium.", bg: "bg-[#2a2d24]" },
              { title: "Pecuária", desc: "Nutrição e cuidado genético extremo.", bg: "bg-[#252b20]" },
              { title: "Armazéns", desc: "Controle climático total em silos.", bg: "bg-[#2a2c30]" },
              { title: "Logística", desc: "Frota moderna e inteligência via IA.", bg: "bg-[#1c2229]" }
            ].map((item, idx) => (
              <div key={idx} className={`${item.bg} rounded-[2.5rem] border border-white/5 hover:border-[#a3e635]/30 overflow-hidden flex flex-col h-[320px] transition-all duration-300 group cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}>
                <div className="flex-1 p-8 pb-4 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-5xl text-[#a3e635] opacity-90 drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]">
                      {idx === 0 ? "🌱" : idx === 1 ? "🐄" : idx === 2 ? "🏛️" : "🚛"}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-2xl mb-3 font-plus-jakarta">{item.title}</h3>
                  <p className="text-white/60 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: ÁREAS DE ATUAÇÃO (DATA-DRIVEN) */}
      <section id="atuacao" className="w-full bg-[#f8f6f0] pt-28 pb-14 px-8 lg:px-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

          {/* Left: KPI Grid */}
          <div className="flex-1 w-full relative z-10">
            <div className="text-center lg:text-left mb-12">
              <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-medium text-[#4d523b]">
                Áreas de <strong className="font-black text-[#051c36]">atuação</strong>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 lg:gap-6">
              {kpis.map((kpi, idx) => (
                <div key={idx} className={`${kpi.bg} rounded-3xl p-6 lg:p-8 flex flex-col justify-center items-center text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-white/5`}>
                  <h3 className="text-3xl lg:text-4xl font-black text-[#a3e635] mb-2 drop-shadow-md">{kpi.valor}</h3>
                  {kpi.label && <span className="text-[#e1e2d7] font-bold text-[9px] tracking-widest uppercase mb-1 opacity-80">{kpi.label}</span>}
                  <p className="text-white font-bold text-sm lg:text-sm uppercase tracking-wide leading-tight">{kpi.titulo}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D MAP & DYNAMIC PINS */}
          <div className="flex-[1.2] relative flex justify-center items-center w-full">
            <div className="relative w-full max-w-[600px] h-[550px]">
              <InteractiveMap pins={mapPins} />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: MODELO DE PRODUÇÃO SUSTENTÁVEL (DADOS DO PDF) */}
      <section className="w-full bg-[#f8f6f0] pb-28 px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#051c36] rounded-[3rem] p-10 lg:p-20 overflow-hidden relative shadow-2xl">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-12 text-[#a3e635]/5">
              <Leaf className="w-64 h-64 rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#a3e635]/10 border border-[#a3e635]/20 px-4 py-2 rounded-full mb-8">
                  <Sparkles className="w-4 h-4 text-[#a3e635]" />
                  <span className="text-[#a3e635] font-bold text-xs uppercase tracking-widest">Modelo de Atividade Agrícola</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-plus-jakarta font-black text-white leading-tight mb-8">
                  O Equilíbrio entre <br />
                  <span className="text-[#a3e635]">Potência e Natureza.</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a3e635] mb-4 group-hover:bg-[#a3e635] group-hover:text-[#051c36] transition-all">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold text-xl mb-2">Integração ILP</h4>
                    <p className="text-white/50 text-sm leading-relaxed">Rotação estratégica Lavoura-Pecuária que restaura a saúde do solo e maximiza a produtividade por hectare.</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a3e635] mb-4 group-hover:bg-[#a3e635] group-hover:text-[#051c36] transition-all">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold text-xl mb-2">Selo REVERTE</h4>
                    <p className="text-white/50 text-sm leading-relaxed">Em parceria com a Syngenta, aplicamos o programa de agricultura sustentável mais rigoroso do mercado nacional.</p>
                  </div>
                </div>
              </div>

              {/* Data Cards Table-like Style */}
              <div className="w-full lg:w-[400px] flex flex-col gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 hover:border-[#a3e635]/40 transition-colors group">
                  <span className="text-[#a3e635] font-black text-[10px] uppercase tracking-widest block mb-4">Escala de Operação</span>
                  <div className="flex items-end gap-2">
                    <span className="text-white text-5xl font-black leading-none">25 MIL</span>
                    <span className="text-white/40 font-bold mb-1 uppercase text-xs">Hectares</span>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2.5rem] p-8 hover:border-[#a3e635]/40 transition-colors group">
                  <span className="text-[#a3e635] font-black text-[10px] uppercase tracking-widest block mb-4">Eficiência Média</span>
                  <div className="flex items-end gap-2">
                    <span className="text-white text-5xl font-black leading-none">4,22</span>
                    <span className="text-white/40 font-bold mb-1 uppercase text-xs">Sc/ha Safra</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE 3D ISOMETRIC CONCEPT & A ESSÊNCIA SECTION */}
      <section id="empresa" className="w-full bg-[#f8f6f0] py-28 px-8 lg:px-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] border-[2px] border-dashed border-[#6b7054]/10 rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none animate-[spin_120s_linear_infinite]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border-[1px] border-solid border-[#6b7054]/10 rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* História da Empresa */}
          <div className="flex flex-col lg:flex-row gap-16 mb-24 relative z-10 items-start">
            <div className="flex-1 relative sticky top-12">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#a3e635]/20 to-transparent blur-3xl opacity-60 rounded-full" />
              <img
                src="/assets/img/lucival_portilho.jpg"
                alt="Lucival Portilho - Fundador"
                className="w-full h-auto max-h-[700px] rounded-[3rem] object-cover object-top shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative z-10 ring-8 ring-white"
              />
              <div className="absolute -bottom-6 right-8 bg-[#051c36] text-white px-8 py-6 rounded-3xl shadow-xl z-20">
                <span className="block text-[#a3e635] font-black text-3xl mb-1">+100%</span>
                <span className="text-xs uppercase tracking-widest font-bold">Compromisso</span>
              </div>
            </div>

            <div className="flex-[1.5] flex flex-col gap-6">
              <div className="inline-flex mb-2">
                <span className="bg-[#a3e635]/10 text-[#6b7054] px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase border border-[#a3e635]/30">A Empresa</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-black text-[#051c36] mb-4 leading-[1.1]">
                Tradição, coragem e <br /> <strong className="text-[#6b7054]">visão de futuro.</strong>
              </h2>

              <div className="space-y-6 text-[#051c36]/70 font-medium leading-relaxed">
                <p className="text-xl font-bold text-[#051c36]">
                  Com uma trajetória de mais de 25 anos no setor, o Grupo Portilho é liderado pelo Eng. Agrônomo Lucival Portilho Arantes, consolidando uma marca de autoridade e inovação no agronegócio brasileiro.
                </p>
                <p>
                  O período entre 1999 e 2016 foi fundamental para a fundação dos valores do grupo. Foi uma fase de intensa imersão técnica e acadêmica, onde Lucival Portilho acumulou expertise através de especializações em Proteção de Plantas (UFV), Gestão e Vendas (FGV) e cargos de alta diretoria em multinacionais líderes como a Syngenta.
                </p>
                <p>
                  Essa base sólida de conhecimento permitiu que em 2016 o grupo iniciasse sua operação própria com um diferencial competitivo raro: a união da experiência prática de campo com a visão estratégica de mercado global.
                </p>
                <p>
                  Hoje, essa evolução se manifesta no uso de biotecnologia e gestão baseada em dados, mantendo o compromisso de produzir alimentos com responsabilidade social e ambiental, respeitando o ciclo da natureza e preparando o solo para as próximas gerações.
                </p>
                <p className="border-l-4 border-[#a3e635] pl-6 py-2 text-lg font-bold text-[#051c36]">
                  Unimos o rigor científico à paixão pela terra, transformando conhecimento em produtividade sustentável para o Brasil.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Our highly-praised Manifesto Grid instead of basic text paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative z-10">
            <div className="group relative bg-white rounded-[2.5rem] p-10 lg:p-12 shadow-[0_10px_40px_rgba(5,28,54,0.04)] hover:shadow-[0_20px_60px_rgba(5,28,54,0.08)] transition-all duration-300 overflow-hidden flex flex-col border border-[#6b7054]/10">
              <div className="relative z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#a3e635] mb-2 block">Nosso Caminho</span>
                <h3 className="text-4xl font-plus-jakarta font-black text-[#051c36] mb-6">Missão</h3>
                <p className="text-2xl font-medium text-[#051c36]/80 leading-relaxed font-inter">
                  Produzir <strong className="text-[#051c36]">alimentos</strong> e melhorar a vida das pessoas.
                </p>
              </div>
            </div>

            <div className="group relative bg-[#051c36] rounded-[2.5rem] p-10 lg:p-12 shadow-[0_10px_40px_rgba(5,28,54,0.1)] hover:shadow-[0_20px_60px_rgba(5,28,54,0.2)] transition-all duration-300 overflow-hidden flex flex-col">
              <div className="relative z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#a3e635] mb-2 block">Nosso Horizonte</span>
                <h3 className="text-4xl font-plus-jakarta font-black text-white mb-6">Visão</h3>
                <p className="text-lg lg:text-xl font-medium text-white/90 leading-relaxed font-inter">
                  Ser a referência nacional em produtividade de forma sustentável, invadora, viável e ética.
                </p>
              </div>
            </div>

            <div className="group relative bg-[#6b7054] rounded-[2.5rem] p-10 lg:p-12 shadow-[0_10px_40px_rgba(5,28,54,0.04)] hover:shadow-[0_20px_60px_rgba(5,28,54,0.08)] transition-all duration-300 overflow-hidden flex flex-col text-white">
              <div className="relative z-10 flex flex-col h-full">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#e1e2d7] mb-2 block">Nossas Raízes</span>
                <h3 className="text-4xl font-plus-jakarta font-black mb-6">Valores</h3>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {["Empreendedorismo", "Etica Plena", "Melhoria", "Ousadia Sustentável", "Respeito e Natureza"].map((valor, i) => (
                    <div key={i} className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap">
                      {valor}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INOVAÇÃO & VISÃO 2026 (DADOS DO PDF) */}
      <section className="w-full bg-[#f8f6f0] pb-28 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#6b7054] font-bold tracking-widest uppercase text-xs mb-4 block">Inovação e Tecnologia</span>
              <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-black text-[#051c36]">
                Conectando aos <span className="text-[#6b7054]">Avanços Tecnológicos.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-[#051c36] text-white px-6 py-3 rounded-2xl shadow-xl">
              <Cpu className="w-5 h-5 text-[#a3e635]" />
              <span className="font-bold text-sm tracking-wide">Evolução Constante</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card IA */}
            <div className="group relative bg-white rounded-[2.5rem] p-10 lg:p-12 overflow-hidden border border-[#6b7054]/10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635] opacity-[0.05] -mr-16 -mt-16 rounded-full group-hover:scale-[3] transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-[#051c36] mb-6 flex items-center gap-4">
                  IA & Risco <div className="h-[2px] flex-1 bg-[#6b7054]/10" />
                </h3>
                <p className="text-[#051c36]/70 leading-relaxed mb-8 font-medium">
                  Destaque nacional na mídia especializada pela adoção de **Inteligência Artificial na mitigação de riscos agrícolas**, garantindo segurança operacional mesmo sob variações climáticas extremas.
                </p>
                <a
                  href="https://g1.globo.com/economia/agronegocios/noticia/2024/02/12/seguro-rural-parametrico-ganha-espaco-como-alternativa-para-proteger-safra.ghtml"
                  target="_blank"
                  className="inline-flex items-center gap-3 text-[#051c36] font-black uppercase text-xs tracking-widest hover:gap-5 transition-all"
                >
                  Ver Matéria Completa <ArrowRight className="w-4 h-4 text-[#a3e635]" />
                </a>
              </div>
            </div>

            {/* Card Expansão 2026 */}
            <div className="group relative bg-[#051c36] rounded-[2.5rem] p-10 lg:p-12 overflow-hidden text-white shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:scale-[3] transition-transform duration-700" />
              <div className="relative z-10">
                <span className="bg-[#a3e635]/10 text-[#a3e635] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#a3e635]/20 mb-6 inline-block">
                  Projeção 2026
                </span>
                <h3 className="text-3xl font-black text-white mb-6">Verticalização Algodoeira</h3>
                <p className="text-white/60 leading-relaxed mb-8 font-medium">
                  Início do processamento em Gurupi-TO, com tecnologia de ponta para classificação de fibras por resistência, comprimento e resiliência, fechando o ciclo produtivo com excelência.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="block text-[#a3e635] font-black text-xl mb-1">Unid. II</span>
                    <span className="text-[10px] uppercase font-bold text-white/40">240 mil sacas</span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="block text-white font-black text-xl mb-1">Gurupi</span>
                    <span className="text-[10px] uppercase font-bold text-white/40">Hub Logístico</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA GALERIA COM LIGHTBOX (AUTO-GRID) */}
      <section id="galeria" className="w-full bg-[#a3b174] py-24 px-8 lg:px-16 text-center text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-medium mb-12">Nossa <strong className="font-black">galeria</strong></h2>

          <div className="flex justify-center gap-8 mb-12 border-b border-white/20 pb-4 w-max mx-auto relative overflow-x-auto max-w-full">
            {albuns.map((album, idx) => (
              <button
                key={album.id}
                onClick={() => {
                  setActiveAlbumIndex(idx);
                  setLightboxIndex(0);
                }}
                className={`font-bold text-sm tracking-widest uppercase transition-colors whitespace-nowrap pb-2 border-b-2 ${activeAlbumIndex === idx ? 'text-white border-white' : 'text-white/50 hover:text-white border-transparent'}`}
              >
                {album.titulo}
              </button>
            ))}
          </div>

          <div className="relative group">
            {/* Navigation Buttons */}
            <button
              onClick={() => {
                const container = document.getElementById('album-scroll-container');
                if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
              }}
              className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#051c36] text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-[#a3e635] hover:text-[#051c36]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              id="album-scroll-container"
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {albuns.length > 0 && albuns[activeAlbumIndex]?.gp_galeria?.map((item: any, i: number) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[200px] md:w-[240px] snap-center group/card relative h-[150px] md:h-[180px] rounded-[1.5rem] overflow-hidden shadow-xl cursor-pointer hover:-translate-y-2 transition-all duration-300"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                >
                  <img src={item.url} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt={item.legenda} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051c36]/90 via-[#051c36]/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                    <h4 className="text-white font-bold text-sm leading-tight mb-1 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 delay-100">{item.legenda}</h4>
                    <span className="text-[#a3e635] font-bold tracking-widest text-[8px] uppercase flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-200">
                      <Maximize className="w-3 h-3" /> Ampliar
                    </span>
                    {item.is_capa && (
                      <div className="absolute top-4 right-4 bg-[#a3e635] text-[#051c36] p-1.5 rounded-full shadow-lg">
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {albuns.length === 0 && (
                <div className="w-full py-20 text-white/30 font-bold uppercase tracking-widest text-center">Nenhuma foto cadastrada na galeria.</div>
              )}
            </div>

            <button
              onClick={() => {
                const container = document.getElementById('album-scroll-container');
                if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
              }}
              className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#051c36] text-white rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-[#a3e635] hover:text-[#051c36]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* NOSSOS PARCEIROS DE PRODUÇÃO */}
      <section id="parceiros" className="w-full bg-[#f8f6f0] py-24 px-8 lg:px-16 text-center shadow-[inset_0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-medium mb-16 text-[#4d523b]">Parceiros de <strong className="font-black text-[#6b7054]">produção</strong></h2>

          <div className="relative flex overflow-x-hidden">
            <div className="flex animate-scroll whitespace-nowrap">
              {(parceiros.length > 0 ? [...parceiros, ...parceiros] : []).map((parceiro, index) => (
                <div key={`${parceiro.id}-${index}`} className="flex-shrink-0 mx-8 md:mx-16 py-8">
                  <div className="h-16 md:h-24 w-32 md:w-48 bg-white rounded-[1.5rem] p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 border border-[#6b7054]/20 group shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer">
                    <img
                      src={parceiro.logo_url}
                      alt={parceiro.nome}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}

              {parceiros.length === 0 && (
                <div className="w-full text-[#4d523b]/30 font-bold uppercase tracking-widest text-sm py-4">Carregando parceiros...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: DEPOIMENTOS DE CLIENTES */}
      <section id="depoimentos" className="w-full bg-[#051c36] py-28 px-8 lg:px-16 text-center shadow-[inset_0_10px_30px_rgba(0,0,0,0.2)] relative overflow-hidden">
        {/* Abstract Glow Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#a3e635] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-medium mb-16 text-white">
            O que dizem <strong className="font-black text-[#a3e635]">nossos clientes</strong>
          </h2>

          <div className="flex items-center justify-center gap-4 lg:gap-8 w-full">
            {/* Prev Button */}
            <button
              onClick={() => setTestemunhoIndex(prev => prev === 0 ? testemunhos.length - 1 : prev - 1)}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-white/5 hover:bg-[#a3e635] text-white/50 hover:text-[#051c36] flex justify-center items-center rounded-full transition-all flex-shrink-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Testimonials 3-Grid Container */}
            <div className="flex justify-center gap-6 flex-1 w-full overflow-hidden">
              {[0, 1, 2].map((offset) => {
                // Calculate index with wrap-around
                const tIndex = (testemunhoIndex + offset) % testemunhos.length;
                const item = testemunhos[tIndex];

                return (
                  <div key={`${tIndex}-${offset}`} className="bg-[#031428] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-[400px] min-h-[320px] hidden lg:flex flex-col items-center justify-between transition-all duration-500 hover:border-[#a3e635]/20 first:flex hover:-translate-y-2">
                    <div className="flex w-full items-center gap-4 mb-6">
                      <img src={item.avatar} alt={item.nome} className="w-16 h-16 rounded-full border-2 border-[#a3e635] object-cover shadow-[0_0_15px_rgba(163,230,53,0.3)]" />
                      <div className="text-left flex-1">
                        <h4 className="text-white font-bold font-plus-jakarta text-lg leading-tight">{item.nome}</h4>
                        <p className="text-white/50 text-xs font-medium">{item.papel}</p>
                      </div>
                    </div>

                    <div className="flex-1 w-full flex items-start mb-6 relative">
                      <div className="absolute -left-2 -top-2 text-5xl text-[#a3e635] opacity-20 font-serif leading-none">"</div>
                      <p className="text-white/80 italic text-[15px] leading-relaxed relative z-10 font-serif pt-2">
                        "{item.texto}"
                      </p>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1.5 w-full">
                      {[...Array(item.estrelas)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#a3e635] fill-current drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setTestemunhoIndex(prev => prev === testemunhos.length - 1 ? 0 : prev + 1)}
              className="w-12 h-12 lg:w-14 lg:h-14 bg-white/5 hover:bg-[#a3e635] text-white/50 hover:text-[#051c36] flex justify-center items-center rounded-full transition-all flex-shrink-0"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-12">
            {testemunhos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestemunhoIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${testemunhoIndex === idx ? 'bg-[#a3e635] scale-125' : 'bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FALE COM UM ESPECIALISTA */}
      <section id="contato" className="w-full bg-white py-24 px-8 lg:px-16 text-center border-t border-[#f8f6f0] relative z-10 px-4">
        <div className="max-w-4xl mx-auto bg-[#f8f6f0] rounded-3xl p-8 lg:p-12 shadow-2xl shadow-[#031d38]/5 border border-black/5">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-black text-[#031d38] font-plus-jakarta mb-4">O que você precisa <span className="text-[#a3e635]">hoje?</span></h3>
            <p className="text-[#031d38]/60 font-medium">Tem dúvida técnica sobre nossa logística? Fale com um de nossos especialistas abaixo.</p>
          </div>

          <form onSubmit={handleContactSubmit} className="flex flex-col gap-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[#031d38] text-sm font-bold mb-2 block">Nome:</label>
                <input name="nome" required type="text" className="w-full bg-white border border-[#031d38]/10 text-[#031d38] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3e635] transition-all shadow-sm" placeholder="Seu nome" />
              </div>
              <div>
                <label className="text-[#031d38] text-sm font-bold mb-2 block">E-mail:</label>
                <input name="email" required type="email" className="w-full bg-white border border-[#031d38]/10 text-[#031d38] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3e635] transition-all shadow-sm" placeholder="voce@email.com" />
              </div>
            </div>
            <div>
              <label className="text-[#031d38] text-sm font-bold mb-2 block">Assunto:</label>
              <input name="assunto" required type="text" className="w-full bg-white border border-[#031d38]/10 text-[#031d38] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3e635] transition-all shadow-sm" placeholder="Motivo do contato" />
            </div>
            <div>
              <label className="text-[#031d38] text-sm font-bold mb-2 block">Mensagem:</label>
              <textarea name="mensagem" required rows={4} className="w-full bg-white border border-[#031d38]/10 text-[#031d38] p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3e635] resize-none transition-all shadow-sm" placeholder="Detalhes..."></textarea>
            </div>
            <button type="submit" disabled={formSubmitting} className="w-full bg-[#031d38] hover:bg-[#a3e635] hover:text-[#051c36] text-white font-black py-4 rounded-xl transition-colors text-sm uppercase tracking-widest mt-2 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center">
              {formSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#031d38] py-16 px-8 lg:px-16 relative border-t-8 border-[#a3e635] z-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 lg:gap-24">

          <div className="max-w-xs">
            <div className="flex flex-col mb-4">
              <div className="font-plus-jakarta font-black text-4xl text-white flex items-center gap-0 leading-none">
                <span className="text-[#a3e635]">G</span>P
              </div>
            </div>
            <p className="text-white/60 text-xs font-medium leading-relaxed mb-4">
              Sustentabilidade, potência no agro e inovação. A força de um negócio que respeita a terra do início ao fim.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-[#a3e635] hover:text-[#031d38] transition-colors"><MoveRight className="w-4 h-4" /></div>
            </div>
          </div>

          <div className="flex gap-16 flex-wrap lg:justify-end flex-1">
            <div className="min-w-[200px]">
              <h4 className="text-white font-bold mb-6 font-plus-jakarta tracking-widest text-sm uppercase">Atendimento</h4>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li className="flex items-start gap-3 group">
                  <Phone className="w-5 h-5 text-[#a3e635] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-white/90 font-bold mb-0.5">Telefone Comercial</span>
                    <span className="hover:text-[#a3e635] cursor-pointer transition-colors">{configs.footer_phone}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <Mail className="w-5 h-5 text-[#a3e635] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-white/90 font-bold mb-0.5">Atendimento Eletrônico</span>
                    <span className="hover:text-[#a3e635] cursor-pointer transition-colors">{configs.footer_email}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="min-w-[200px]">
              <h4 className="text-white font-bold mb-6 font-plus-jakarta tracking-widest text-sm uppercase">Matriz Corporativa</h4>
              <ul className="space-y-4 text-white/60 text-sm font-medium">
                <li className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 text-[#a3e635] flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-white/90 font-bold mb-0.5">Goiás, Brasil</span>
                    <span className="leading-relaxed whitespace-pre-line">{configs.footer_address}</span>
                  </div>
                </li>
                <li className="pt-4 flex items-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a3e635] hover:text-[#051c36] transition-all hover:scale-110">
                    <span className="font-bold font-serif italic text-lg leading-none">in</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#a3e635] hover:text-[#051c36] transition-all hover:scale-110">
                    <span className="font-bold text-lg leading-none">IG</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-white/30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Grupo Portilho. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">Desenvolvido com excelência</p>
        </div>
      </footer>

      {/* WHATSAPP FLOAT BUTTON */}
      <a href={`https://wa.me/${configs.wa_number}`} target="_blank" className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.5)] hover:scale-110 hover:-translate-y-2 transition-all duration-300 z-[100] group flex items-center gap-0 hover:gap-3 overflow-hidden">
        <span className="w-0 overflow-hidden font-bold whitespace-nowrap group-hover:w-auto transition-all duration-300">Fale com um Especialista</span>
        <Phone className="w-7 h-7 fill-white/20" />
      </a>

      {/* LIGHTBOX MODAL (UI PRO MAX) */}
      {lightboxOpen && albuns.length > 0 && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#051c36]/90 backdrop-blur-md animate-[fade-in_0.2s_ease-out]" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/50 hover:text-white transition-colors z-[1000] bg-black/20 p-3 rounded-full hover:bg-black/50">
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const fotos = albuns[activeAlbumIndex]?.gp_galeria || [];
              setLightboxIndex(prev => prev === 0 ? fotos.length - 1 : prev - 1)
            }}
            className="absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#a3e635] text-white hover:text-[#051c36] p-4 rounded-full transition-all shadow-2xl z-[1000]"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative max-w-6xl w-full px-16 lg:px-24 flex justify-center" onClick={(e) => e.stopPropagation()}>
            {albuns[activeAlbumIndex]?.gp_galeria?.[lightboxIndex] && (
              <img
                src={albuns[activeAlbumIndex].gp_galeria[lightboxIndex].url}
                alt={albuns[activeAlbumIndex].gp_galeria[lightboxIndex].legenda}
                className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-[fade-in-up_0.3s_ease-out] ring-1 ring-white/10"
              />
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const fotos = albuns[activeAlbumIndex]?.gp_galeria || [];
              setLightboxIndex(prev => prev === fotos.length - 1 ? 0 : prev + 1)
            }}
            className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#a3e635] text-white hover:text-[#051c36] p-4 rounded-full transition-all shadow-2xl z-[1000]"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-center w-full max-w-lg px-4">
            <div className="bg-black/40 backdrop-blur text-white/90 font-bold tracking-widest text-sm px-6 py-2 rounded-full border border-white/10 shadow-lg">
              {lightboxIndex + 1} / {albuns[activeAlbumIndex]?.gp_galeria?.length || 0}
            </div>
            <p className="text-white md:text-lg font-medium drop-shadow-xl animate-[fade-in-up_0.4s_ease-out]">
              {albuns[activeAlbumIndex]?.gp_galeria?.[lightboxIndex]?.legenda}
            </p>
          </div>
        </div>
      )}

    </main>
  );
}

"use client";

import React, { useState } from 'react';
import { 
  Leaf, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Milestone, 
  History, 
  Zap,
  ChevronRight,
  Sparkles,
  Target
} from 'lucide-react';

export default function PropostaPremium() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <main className="flex min-h-screen flex-col bg-[#ffffff] font-inter overflow-x-hidden">
      
      {/* HEADER DA PROPOSTA */}
      <section className="relative w-full bg-primary py-20 px-8 lg:px-16 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary opacity-[0.05] blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-bold text-sm tracking-widest uppercase border border-secondary/20 mb-6 inline-block">
            Preview: Novas Seções Estratégicas
          </span>
          <h1 className="text-5xl lg:text-7xl font-plus-jakarta font-black leading-tight">
            Elevando a Autoridade <br />
            <span className="text-secondary">Digital do Grupo</span>
          </h1>
          <p className="mt-6 text-white/60 text-lg max-w-2xl font-medium leading-relaxed">
            Esta página demonstra como os dados extraídos da apresentação oficial podem ser transformados em seções de alto impacto, focadas em sustentabilidade e inovação tecnológica.
          </p>
        </div>
      </section>

      {/* 1. SEÇÃO: TIMELINE / LEGADO (IDEIA A) */}
      <section className="w-full bg-[#f8f6f0] py-28 px-8 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-16">
            <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-black text-primary mb-4">
              Uma Jornada de <span className="text-[#6b7054]">25 Anos</span>
            </h2>
            <p className="text-primary/60 font-medium max-w-xl">Desde a consultoria inicial em 1999 até a liderança no Tocantins em 2016, a trajetória do Grupo Portilho é marcada por aprendizado contínuo.</p>
          </div>

          {/* Timeline Premium Style */}
          <div className="relative flex flex-col gap-8">
            <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-[#6b7054]/10 hidden md:block" />
            
            {[
              { year: "1999", title: "O Início", desc: "Primeiras consultorias no agro e o desejo imenso de aprender.", icon: <History className="w-5 h-5"/> },
              { year: "2016", title: "Expansão Tocantins", desc: "Chegada oficial à Região Sul de TO, plantando as primeiras áreas de soja.", icon: <Target className="w-5 h-5"/> },
              { year: "Hoje", title: "Domínio Operacional", desc: "Mais de 25 mil hectares sob gestão com responsabilidade social e ambiental.", icon: <Zap className="w-5 h-5"/> }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="group relative flex items-start gap-8 bg-white p-8 rounded-[2.5rem] border border-[#6b7054]/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-default"
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary text-secondary flex items-center justify-center flex-shrink-0 z-10 shadow-lg group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <div>
                  <span className="text-secondary font-black text-2xl mb-1 block">{step.year}</span>
                  <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-primary/70 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO: AGRO SUSTENTÁVEL / ILP (IDEIA B) */}
      <section className="w-full bg-primary py-28 px-8 lg:px-16 overflow-hidden relative">
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-secondary opacity-[0.03] blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-4 block">Modelo de Produção</span>
            <h2 className="text-4xl lg:text-6xl font-plus-jakarta font-black text-white leading-tight mb-8">
              O Equilíbrio entre <br />
              <span className="text-secondary">Potência e Natureza.</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: "Integração Lavoura-Pecuária", text: "Uso rotativo do solo para máxima produtividade e saúde da terra.", icon: <Leaf /> },
                { title: "Selo REVERTE", text: "Parceria estratégica com Syngenta para agricultura regenerativa real.", icon: <ShieldCheck /> },
                { title: "Bio-Insumos", text: "Uso consciente de biológicos no tratamento e proteção de culturas.", icon: <Zap /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-white/50 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase (Mocked Data Visualization) */}
          <div className="flex-1 w-full h-[500px] bg-gradient-to-br from-[#1b2c4d] to-[#01142e] rounded-[3rem] p-12 border border-white/10 relative shadow-2xl flex flex-col justify-center items-center text-center overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-white/5">
                <Leaf className="w-64 h-64" />
             </div>
             <h3 className="text-secondary text-5xl font-black mb-4">25.000</h3>
             <p className="text-white text-xl font-bold tracking-widest uppercase">Hectares sob gestão sustentável</p>
             <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                  <span className="text-white/40 text-[10px] uppercase font-black block mb-2">Safra</span>
                  <span className="text-white text-xl font-bold">4,22 Sc/ha</span>
                </div>
                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
                  <span className="text-secondary/60 text-[10px] uppercase font-black block mb-2">2ª Safra</span>
                  <span className="text-secondary text-xl font-bold">Custo Zero</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO: FUTURO E TECNOLOGIA (IDEIA C) */}
      <section className="w-full bg-white py-28 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-primary font-bold text-xs uppercase tracking-widest mb-6">
            <Cpu className="w-4 h-4" /> Visão Tecnológica
          </div>
          <h2 className="text-4xl lg:text-5xl font-plus-jakarta font-black text-primary">O Amanhã é <span className="text-[#6b7054]">Data-Driven</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Algodoeira */}
          <div className="group relative bg-[#f8f6f0] rounded-[2.5rem] p-10 overflow-hidden border border-black/5 hover:border-secondary/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-[0.05] -mr-16 -mt-16 rounded-full group-hover:scale-[3] transition-transform duration-700" />
            <div className="relative z-10">
              <span className="text-[#6b7054] font-black text-sm uppercase mb-4 block">Expansão 2026</span>
              <h3 className="text-3xl font-bold text-primary mb-6">Nova Unidade Algodoeira (Gurupi-TO)</h3>
              <p className="text-primary/70 leading-relaxed mb-8">Processamento verticalizado com tecnologia de ponta para classificação de fibras (resistência, comprimento e resiliência).</p>
              <div className="flex items-center gap-3 text-primary font-black uppercase text-xs tracking-widest group-hover:gap-5 transition-all">
                Ver Projeção do Projeto <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card Inteligência Artificial */}
          <div className="group relative bg-primary rounded-[2.5rem] p-10 overflow-hidden text-white transition-all duration-500 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:scale-[3] transition-transform duration-700" />
            <div className="relative z-10">
              <span className="text-secondary font-black text-sm uppercase mb-4 block">Inovação</span>
              <h3 className="text-3xl font-bold text-white mb-6">IA na Mitigação de Riscos</h3>
              <p className="text-white/60 leading-relaxed mb-8">Fomos destaque na mídia nacional pela adoção de algoritmos preditivos que garantem a segurança da safra em tempos de mudança climática.</p>
              <div className="flex items-center gap-3 text-secondary font-black uppercase text-xs tracking-widest group-hover:gap-5 transition-all">
                Ler Matéria Completa <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER DA PROPOSTA */}
      <footer className="w-full bg-[#f8f6f0] py-12 px-8 text-center border-t border-black/5">
        <p className="text-primary/40 font-bold uppercase tracking-widest text-[10px]">
          Sugestão Antigravity para Grupo Portilho • 2024
        </p>
      </footer>

    </main>
  );
}

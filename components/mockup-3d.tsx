import React from 'react';
import { motion } from 'framer-motion';

export function Mockup3D({ itemId }: { itemId: string }) {
  const item = { id: itemId, mockupType: '3d' };
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* ── 3D mockups — full webpage layout previews */}

                    {/* 1. Orbital — deep purple, floating 3D spheres + rings */}
                    {/* 1. Orbital — deep purple bg, floating 3D spheres + ring */}
                    {item.id === "orbital-3d-universe" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#2d0070 0%,#1a0050 50%,#0f0030 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
                          <div className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-purple-400" style={{boxShadow:"0 0 6px #a78bfa"}}/><span className="text-[0.5rem] font-black text-white">ORBITAL</span></div>
                          <div className="flex gap-2">{["Home","Work","About","Contact"].map(l=><span key={l} className="text-[0.38rem] text-white/50">{l}</span>)}</div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-3">
                          <div className="flex-1">
                            <p className="text-[0.8rem] font-black text-white leading-tight">The New<br/><span className="text-purple-300">Color Theme</span></p>
                            <p className="text-[0.4rem] text-white/50 mt-1 leading-relaxed">Next-gen 3D particle universe with GPU-accelerated physics.</p>
                            <span className="mt-2 inline-block rounded-full bg-purple-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-white">Explore Now →</span>
                          </div>
                          {/* 3D sphere cluster */}
                          <div className="relative w-20 h-20 shrink-0">
                            <div className="absolute size-14 rounded-full top-0 right-0" style={{background:"radial-gradient(circle at 35% 30%, #c084fc, #7c3aed 55%, #2e0060)",boxShadow:"4px 6px 20px rgba(0,0,0,0.5), -2px -3px 0 rgba(255,255,255,0.08) inset"}}/>
                            <div className="absolute size-8 rounded-full bottom-0 left-0" style={{background:"radial-gradient(circle at 35% 30%, #e879f9, #9333ea 55%, #3b0080)",boxShadow:"3px 4px 14px rgba(0,0,0,0.5)"}}/>
                            <div className="absolute size-5 rounded-full top-1/2 left-1" style={{background:"radial-gradient(circle at 35% 30%, #a855f7, #6d28d9 55%, #1e0040)",boxShadow:"2px 3px 8px rgba(0,0,0,0.4)"}}/>
                            {/* ring */}
                            <div className="absolute top-1 right-1 size-8 rounded-full border-[2.5px] border-purple-300/60" style={{transform:"rotateX(70deg)",boxShadow:"0 0 8px rgba(192,132,252,0.4)"}}/>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Product tilt — bright yellow/green, floating 3D product icons */}
                    {item.id === "3d-product-tilt" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#eeff00 0%,#aacc00 40%,#22aa00 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 bg-black/20">
                          <div className="flex items-center gap-1"><span className="size-2 rounded-sm bg-white/80"/><span className="text-[0.5rem] font-black text-white">ventdsign</span></div>
                          <div className="flex gap-2 items-center">{["Home","About","Works"].map(l=><span key={l} className="text-[0.38rem] text-white/70">{l}</span>)}<span className="rounded-full bg-black px-2 py-0.5 text-[0.38rem] font-bold text-yellow-300">Sign Up</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.45rem] text-white/60 uppercase tracking-widest">Creative Studio</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Landing<br/>Page</p>
                            <p className="text-[0.38rem] text-white/60 mt-1">Stunning 3D product tilt with live glare.</p>
                            <span className="mt-1.5 inline-block rounded-full bg-black px-2.5 py-0.5 text-[0.42rem] font-bold text-yellow-300">Get Started →</span>
                          </div>
                          {/* floating 3D shape cluster */}
                          <div className="relative w-20 h-20 shrink-0">
                            {/* big 3D box */}
                            <div className="absolute top-0 right-0 w-12 h-12 rounded-lg" style={{background:"radial-gradient(circle at 30% 25%, #ffd700, #ff8c00 60%, #cc5500)",transform:"perspective(100px) rotateX(15deg) rotateY(-15deg)",boxShadow:"4px 5px 12px rgba(0,0,0,0.35), inset -2px -2px 0 rgba(0,0,0,0.15), inset 2px 2px 0 rgba(255,255,255,0.2)"}}/>
                            {/* small sphere */}
                            <div className="absolute bottom-1 left-0 size-7 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #88ff44, #22aa00 60%, #005500)",boxShadow:"2px 3px 8px rgba(0,0,0,0.3)"}}/>
                            {/* tiny cube */}
                            <div className="absolute top-8 left-3 size-4 rounded-sm" style={{background:"radial-gradient(circle at 30% 30%, #ff66cc, #cc0088 60%, #660044)",transform:"rotate(20deg)",boxShadow:"2px 2px 6px rgba(0,0,0,0.3)"}}/>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. HyperSpace — dark red/orange, isometric 3D dashboard */}
                    {item.id === "hyperspace-cyber-studio" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#1a0500 0%,#2d0800 40%,#1a0000 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-orange-900/30">
                          <div className="flex items-center gap-1"><span className="text-[0.5rem] font-black text-orange-400">HYPER</span><span className="text-[0.5rem] font-black text-white">SPACE</span></div>
                          <div className="flex gap-2">{["Work","About","FAQ"].map(l=><span key={l} className="text-[0.38rem] text-orange-300/50">{l}</span>)}<span className="rounded bg-orange-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-white">Hire Us</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-orange-500/60 uppercase tracking-widest">3D Agency</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">INFOGRAPHIC<br/><span className="text-orange-400">LANDING PAGE</span></p>
                            <p className="text-[0.38rem] text-orange-200/40 mt-1">Kinetic typography. Laser cursor trail.</p>
                            <span className="mt-1.5 inline-block rounded bg-orange-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-white">Start Project →</span>
                          </div>
                          {/* isometric 3D object */}
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            {/* isometric box */}
                            <svg viewBox="0 0 60 60" className="w-full h-full">
                              {/* top face */}
                              <polygon points="30,5 55,18 30,31 5,18" fill="rgba(251,146,60,0.9)" stroke="rgba(255,200,100,0.3)" strokeWidth="0.5"/>
                              {/* left face */}
                              <polygon points="5,18 30,31 30,55 5,42" fill="rgba(180,60,0,0.9)" stroke="rgba(255,150,50,0.2)" strokeWidth="0.5"/>
                              {/* right face */}
                              <polygon points="55,18 30,31 30,55 55,42" fill="rgba(220,80,0,0.85)" stroke="rgba(255,180,80,0.2)" strokeWidth="0.5"/>
                              {/* glow dot */}
                              <circle cx="30" cy="18" r="2.5" fill="rgba(255,220,100,0.9)"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Vortex Audio — dark navy, 3D sphere + soundwaves */}
                    {item.id === "vortex-spatial-audio" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#000820 0%,#001040 50%,#000820 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-cyan-900/30">
                          <div className="flex items-center gap-1"><span className="size-2 rounded-full bg-cyan-400" style={{boxShadow:"0 0 5px #22d3ee"}}/><span className="text-[0.5rem] font-black text-white">VORTEX</span></div>
                          <div className="flex gap-2">{["Sound","Studio","Pricing"].map(l=><span key={l} className="text-[0.38rem] text-cyan-300/40">{l}</span>)}<span className="rounded-full bg-cyan-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-black">Try Free</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-cyan-400/60 uppercase tracking-widest">Spatial Audio</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Sound<br/><span className="text-cyan-300">Studio 3D</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">360° waveform visualizer canvas.</p>
                            <span className="mt-1.5 inline-block rounded-full bg-cyan-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-black">Listen Now →</span>
                          </div>
                          {/* 3D sphere with waveform rings */}
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            <div className="absolute size-12 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #67e8f9, #0891b2 55%, #003344)",boxShadow:"3px 4px 16px rgba(0,0,0,0.5), 0 0 20px rgba(6,182,212,0.3)"}}/>
                            {[1,2,3].map(r=><div key={r} className="absolute rounded-full border border-cyan-400/30" style={{width:`${r*24+8}px`,height:`${r*8+4}px`,transform:"rotateX(75deg)",boxShadow:"0 0 4px rgba(6,182,212,0.2)"}}/>)}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. Quantum AI — deep indigo, neural sphere */}
                    {item.id === "quantum-ai-mesh" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#050020 0%,#100050 50%,#050020 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-indigo-900/30">
                          <div className="flex items-center gap-1"><span className="text-[0.5rem] font-black text-indigo-300">QUANTUM</span><span className="text-[0.5rem] font-black text-white">AI</span></div>
                          <div className="flex gap-2">{["Mesh","Nodes","Docs"].map(l=><span key={l} className="text-[0.38rem] text-indigo-300/40">{l}</span>)}<span className="rounded bg-indigo-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-white">Launch App</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-indigo-400/60 uppercase tracking-widest">AI Computing</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Neural<br/><span className="text-indigo-300">Mesh Sphere</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">Synaptic node physics. Real-time vertices.</p>
                            <span className="mt-1.5 inline-block rounded bg-indigo-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-white">Explore →</span>
                          </div>
                          {/* neural mesh sphere */}
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            <div className="absolute size-14 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #818cf8, #4338ca 55%, #1e1060)",boxShadow:"3px 5px 18px rgba(0,0,0,0.5), 0 0 25px rgba(99,102,241,0.35)"}}/>
                            <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 80 80">
                              {[[25,20,55,40],[55,40,40,60],[40,60,25,40],[40,15,40,60],[20,35,60,35]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#818cf8" strokeWidth="0.5"/>)}
                              {[[40,15],[25,40],[55,40],[40,60],[20,28],[60,28]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="2" fill="#a5b4fc"/>)}
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 6. Sphere Architecture — slate/steel, floating 3D geometric blocks */}
                    {item.id === "sphere-architecture" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700/40">
                          <div className="flex items-center gap-1"><span className="size-2 rounded bg-blue-400"/><span className="text-[0.5rem] font-black text-white">SPHERE</span></div>
                          <div className="flex gap-2">{["Design","3D","Studio"].map(l=><span key={l} className="text-[0.38rem] text-slate-400">{l}</span>)}<span className="rounded bg-blue-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-white">View Work</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-blue-400/60 uppercase tracking-widest">Architecture 3D</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">3D Design<br/><span className="text-blue-300">Showcase</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">Isometric CAD wireframes. Material preview.</p>
                            <span className="mt-1.5 inline-block rounded bg-blue-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-white">See Projects →</span>
                          </div>
                          {/* isometric 3D box stack */}
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 70 70" className="w-full h-full">
                              {/* bottom box */}
                              <polygon points="35,45 58,32 35,20 12,32" fill="rgba(96,165,250,0.7)"/>
                              <polygon points="12,32 35,20 35,44 12,56" fill="rgba(37,99,235,0.8)"/>
                              <polygon points="58,32 35,20 35,44 58,56" fill="rgba(59,130,246,0.75)"/>
                              {/* top box */}
                              <polygon points="35,25 50,17 35,9 20,17" fill="rgba(147,197,253,0.8)"/>
                              <polygon points="20,17 35,9 35,25 20,33" fill="rgba(96,165,250,0.7)"/>
                              <polygon points="50,17 35,9 35,25 50,33" fill="rgba(59,130,246,0.75)"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 7. Prism Hologram — rich magenta/pink, 3D chrome sphere */}
                    {item.id === "prism-hologram-studio" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#2d0040 0%,#5a0060 40%,#1a0030 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-pink-900/30">
                          <div className="flex items-center gap-1"><span className="size-2.5 rounded-full" style={{background:"conic-gradient(#ff0080,#ff8c00,#ffd700,#ff0080)"}}/><span className="text-[0.5rem] font-black text-white">PRISM</span></div>
                          <div className="flex gap-2">{["Gallery","Studio","Pricing"].map(l=><span key={l} className="text-[0.38rem] text-pink-300/40">{l}</span>)}<span className="rounded-full bg-pink-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-white">Get Access</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-pink-400/60 uppercase tracking-widest">Hologram Studio</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Prism<br/><span className="text-pink-300">Light Studio</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">Chromatic aberration. Real-time pointer lighting.</p>
                            <span className="mt-1.5 inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-white">Enter Studio →</span>
                          </div>
                          {/* rainbow chrome sphere */}
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            <div className="size-14 rounded-full" style={{background:"conic-gradient(from 120deg, #ff0080 0%, #ff8c00 20%, #ffd700 35%, #00ff88 50%, #00d4ff 65%, #8800ff 80%, #ff0080 100%)",boxShadow:"4px 5px 20px rgba(0,0,0,0.5), 0 0 30px rgba(255,0,128,0.3)"}}/>
                            <div className="absolute size-14 rounded-full" style={{background:"radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 40%, transparent 65%)"}}/>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 8. Astro Chrono — rich dark amber/gold, luxury watch hero */}
                    {item.id === "astro-chrono-watch" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#120800 0%,#221000 50%,#120800 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-amber-900/30">
                          <div className="flex items-center gap-1"><span className="text-[0.5rem] font-black text-amber-400">ASTRO</span><span className="text-[0.5rem] font-black text-white/60">CHRONO</span></div>
                          <div className="flex gap-2">{["Models","Craft","Story"].map(l=><span key={l} className="text-[0.38rem] text-amber-300/40">{l}</span>)}<span className="rounded bg-amber-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-black">Reserve</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-amber-500/60 uppercase tracking-widest">Luxury Timepiece</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Master<br/><span className="text-amber-400">Timepiece</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">Exploded dial view. Strap selector. Night mode.</p>
                            <span className="mt-1.5 inline-block rounded bg-amber-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-black">Discover →</span>
                          </div>
                          {/* 3D watch face */}
                          <div className="relative w-18 h-20 shrink-0 flex items-center justify-center">
                            <div className="relative size-14 rounded-full border-[2.5px] border-amber-500/60 flex items-center justify-center" style={{background:"radial-gradient(circle at 38% 32%, #3d2000, #1a0c00 70%)",boxShadow:"3px 5px 18px rgba(0,0,0,0.7), 0 0 20px rgba(245,158,11,0.25), inset 0 1px 0 rgba(245,158,11,0.2)"}}>
                              {[...Array(12)].map((_,i)=><div key={i} className="absolute" style={{transform:`rotate(${i*30}deg) translateY(-22px)`}}><div className="mx-auto rounded-full bg-amber-400" style={{width:i%3===0?"1.5px":"1px",height:i%3===0?"4px":"2.5px",opacity:i%3===0?0.9:0.35}}/></div>)}
                              <div className="absolute bottom-1/2 left-1/2 h-5 w-px rounded-full bg-amber-300/90 origin-bottom" style={{transform:"translateX(-50%) rotate(-40deg)"}}/>
                              <div className="absolute bottom-1/2 left-1/2 h-6 rounded-full origin-bottom" style={{width:"0.5px",background:"white",transform:"translateX(-50%) rotate(110deg)"}}/>
                              <div className="absolute size-1 rounded-full bg-amber-400" style={{boxShadow:"0 0 3px rgba(245,158,11,0.8)"}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 9. CyberMatrix — dark teal/emerald, warp tunnel portal */}
                    {item.id === "cybermatrix-gateway" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#000f08 0%,#001a10 50%,#000f08 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-emerald-900/30">
                          <div className="flex items-center gap-1"><span className="text-[0.5rem] font-black text-emerald-400">CYBER</span><span className="text-[0.5rem] font-black text-white">MATRIX</span></div>
                          <div className="flex gap-2">{["Chain","Vault","DAO"].map(l=><span key={l} className="text-[0.38rem] text-emerald-300/40">{l}</span>)}<span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-black">Connect</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-2">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-emerald-400/60 uppercase tracking-widest">Web3 Portal</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Web3<br/><span className="text-emerald-300">Gateway</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">Infinite warp tunnel. Scroll velocity physics.</p>
                            <span className="mt-1.5 inline-block rounded bg-emerald-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-black">Enter Portal →</span>
                          </div>
                          {/* warp tunnel portal */}
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            {[6,12,18,24,30].map((r,i)=>(
                              <div key={i} className="absolute rounded-full border border-emerald-400" style={{width:`${r*2+10}px`,height:`${r*2+10}px`,opacity:0.9-i*0.15,boxShadow:`0 0 ${4-i}px rgba(52,211,153,0.4)`}}/>
                            ))}
                            <div className="size-3 rounded-full bg-emerald-400" style={{boxShadow:"0 0 10px rgba(52,211,153,0.8), 0 0 20px rgba(52,211,153,0.4)"}}/>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 10. Flux Fluid — deep magenta/fuchsia, fluid 3D blobs */}
                    {item.id === "flux-fluid-canvas" && (
                      <div className="absolute inset-0 flex flex-col" style={{background:"linear-gradient(135deg,#1a0030 0%,#2d0050 40%,#0d001a 100%)"}}>
                        {/* navbar */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-fuchsia-900/30">
                          <div className="flex items-center gap-1"><span className="size-2 rounded-full bg-fuchsia-400" style={{boxShadow:"0 0 5px #e879f9"}}/><span className="text-[0.5rem] font-black text-white">FLUX</span></div>
                          <div className="flex gap-2">{["Canvas","Labs","Pricing"].map(l=><span key={l} className="text-[0.38rem] text-fuchsia-300/40">{l}</span>)}<span className="rounded-full bg-fuchsia-500 px-1.5 py-0.5 text-[0.38rem] font-bold text-white">Try Free</span></div>
                        </div>
                        {/* hero */}
                        <div className="flex flex-1 items-center px-3 gap-1">
                          <div className="flex-1">
                            <p className="text-[0.42rem] text-fuchsia-400/60 uppercase tracking-widest">Fluid Canvas</p>
                            <p className="text-[0.85rem] font-black text-white leading-tight mt-0.5">Fluid<br/><span className="text-fuchsia-300">Dynamics</span></p>
                            <p className="text-[0.38rem] text-white/40 mt-1">60FPS liquid simulation. Interactive ripple.</p>
                            <span className="mt-1.5 inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-2.5 py-0.5 text-[0.42rem] font-bold text-white">Explore →</span>
                          </div>
                          {/* 3D fluid blobs */}
                          <div className="relative w-20 h-20 shrink-0">
                            <div className="absolute top-0 right-0 size-12 rounded-[40%_60%_55%_45%/45%_55%_60%_40%]" style={{background:"radial-gradient(circle at 35% 30%, #f0abfc, #a21caf 55%, #4a0050)",boxShadow:"3px 4px 16px rgba(0,0,0,0.5), 0 0 20px rgba(232,121,249,0.35)"}}/>
                            <div className="absolute bottom-0 left-0 size-9 rounded-[55%_45%_40%_60%/60%_40%_55%_45%]" style={{background:"radial-gradient(circle at 35% 30%, #67e8f9, #0e7490 55%, #002030)",boxShadow:"2px 3px 12px rgba(0,0,0,0.4)"}}/>
                            <div className="absolute top-6 left-4 size-5 rounded-full" style={{background:"radial-gradient(circle at 35% 30%, #fde68a, #d97706 55%, #451a00)",boxShadow:"2px 2px 8px rgba(0,0,0,0.4)"}}/>
                          </div>
                        </div>
                      </div>
                    )}


    </div>
  );
}

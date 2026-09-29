"use client";

import React, { useState } from "react";
import {
  PageSchema,
  BlockInstance,
  DesignTokens,
  BlockType,
} from "@/lib/builder/types";
import {
  BLOCK_DEFINITIONS,
  DEFAULT_DESIGN_TOKENS,
  TOKEN_PRESETS,
  createBlockInstance,
  createStarterPage,
} from "@/lib/builder/blocks";
import { generatePageCode, generatePageJson } from "@/lib/builder/exporter";
import { BlockRenderer } from "./block-renderer";
import { cn } from "@/lib/cn";
import {
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Code,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Sliders,
  Palette,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
  Eye,
} from "lucide-react";

export function PageBuilder() {
  const [page, setPage] = useState<PageSchema>(() => ({
    id: `page-${Date.now()}`,
    version: "1.0.0",
    title: "SaaS Launchpad Landing Page",
    tokens: { ...DEFAULT_DESIGN_TOKENS },
    blocks: createStarterPage(),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      generator: "DimensionUI Page Builder v1.0.0",
    },
  }));

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(() => page.blocks[0]?.id || null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarTab, setSidebarTab] = useState<"blocks" | "props" | "tokens">("props");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"tsx" | "json">("tsx");
  const [copied, setCopied] = useState(false);

  // Selected block reference
  const selectedBlock = page.blocks.find((b) => b.id === selectedBlockId) || null;
  const selectedBlockDef = selectedBlock ? BLOCK_DEFINITIONS[selectedBlock.type] : null;

  // Block Tree Operations
  const handleSelectBlock = (id: string) => {
    setSelectedBlockId(id);
    setSidebarTab("props");
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock = createBlockInstance(type);
    setPage((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
    setShowAddModal(false);
    setSidebarTab("props");
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setPage((prev) => {
      const nextBlocks = [...prev.blocks];
      const temp = nextBlocks[index];
      nextBlocks[index] = nextBlocks[index - 1];
      nextBlocks[index - 1] = temp;
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= page.blocks.length - 1) return;
    setPage((prev) => {
      const nextBlocks = [...prev.blocks];
      const temp = nextBlocks[index];
      nextBlocks[index] = nextBlocks[index + 1];
      nextBlocks[index + 1] = temp;
      return { ...prev, blocks: nextBlocks };
    });
  };

  const handleDuplicate = (index: number) => {
    const target = page.blocks[index];
    const clone = createBlockInstance(target.type);
    clone.props = JSON.parse(JSON.stringify(target.props));

    setPage((prev) => {
      const nextBlocks = [...prev.blocks];
      nextBlocks.splice(index + 1, 0, clone);
      return { ...prev, blocks: nextBlocks };
    });
    setSelectedBlockId(clone.id);
  };

  const handleDelete = (index: number) => {
    setPage((prev) => {
      const nextBlocks = prev.blocks.filter((_, i) => i !== index);
      return { ...prev, blocks: nextBlocks };
    });
    if (selectedBlockId === page.blocks[index]?.id) {
      setSelectedBlockId(page.blocks[index - 1]?.id || page.blocks[index + 1]?.id || null);
    }
  };

  const handlePropChange = (key: string, value: any) => {
    if (!selectedBlockId) return;
    setPage((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => {
        if (b.id !== selectedBlockId) return b;
        return {
          ...b,
          props: {
            ...b.props,
            [key]: value,
          },
        };
      }),
    }));
  };

  const handleTokenChange = (patch: Partial<DesignTokens>) => {
    setPage((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        ...patch,
      },
    }));
  };

  const handleReset = () => {
    if (confirm("Reset canvas to default starter blocks?")) {
      const starter = createStarterPage();
      setPage((prev) => ({
        ...prev,
        tokens: { ...DEFAULT_DESIGN_TOKENS },
        blocks: starter,
      }));
      setSelectedBlockId(starter[0]?.id || null);
    }
  };

  // Copy exported output
  const exportedCode = exportFormat === "tsx" ? generatePageCode(page) : generatePageJson(page);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportedCode], {
      type: exportFormat === "tsx" ? "text/plain;charset=utf-8" : "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFormat === "tsx" ? "dimensionui-page.tsx" : "dimensionui-page.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#07070d] text-slate-100">
      {/* -------------------- Top Builder Navigation Bar -------------------- */}
      <header className="flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#0e0e1a]/90 px-4 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Layers className="h-4 w-4" />
            </span>
            <span>DimensionUI</span>
            <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-cyan-400">
              POC BUILDER
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Page Title Input */}
          <input
            type="text"
            value={page.title}
            onChange={(e) => setPage((prev) => ({ ...prev, title: e.target.value }))}
            className="w-48 sm:w-64 rounded-md border border-transparent bg-transparent px-2 py-1 text-xs font-medium text-slate-200 hover:border-white/10 focus:border-cyan-400 focus:bg-[#07070d] focus:outline-none"
            placeholder="Untitled Page"
          />
        </div>

        {/* Viewport & Device Toggles */}
        <div className="hidden md:flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          <button
            onClick={() => setViewport("desktop")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              viewport === "desktop"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
            title="Desktop View (100%)"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setViewport("tablet")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              viewport === "tablet"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
            title="Tablet View (768px)"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setViewport("mobile")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              viewport === "mobile"
                ? "bg-purple-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            )}
            title="Mobile View (375px)"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/[0.08] transition-colors"
            title="Reset Starter Page"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Block</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 transition-opacity"
          >
            <Code className="h-3.5 w-3.5" />
            <span>Export Code</span>
          </button>
        </div>
      </header>

      {/* -------------------- Main Workspace -------------------- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Block Tree & Inspector */}
        <aside className="w-80 border-r border-white/[0.08] bg-[#0c0d16] flex flex-col z-20">
          {/* Sidebar Tab Selector */}
          <div className="flex border-b border-white/[0.08] bg-[#0e0e1a]/60 p-1">
            <button
              onClick={() => setSidebarTab("props")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors",
                sidebarTab === "props"
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Inspector</span>
            </button>
            <button
              onClick={() => setSidebarTab("blocks")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors",
                sidebarTab === "blocks"
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Layers ({page.blocks.length})</span>
            </button>
            <button
              onClick={() => setSidebarTab("tokens")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-colors",
                sidebarTab === "tokens"
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Tokens</span>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* TAB 1: PROPERTIES INSPECTOR */}
            {sidebarTab === "props" && (
              <div>
                {selectedBlock && selectedBlockDef ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                          {selectedBlockDef.category}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {selectedBlockDef.name}
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {selectedBlock.id.slice(0, 10)}
                      </span>
                    </div>

                    {/* Dynamic Fields */}
                    {selectedBlockDef.fields.map((field) => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300 block">
                          {field.label}
                        </label>

                        {field.type === "text" && (
                          <input
                            type="text"
                            value={selectedBlock.props[field.key] || ""}
                            onChange={(e) => handlePropChange(field.key, e.target.value)}
                            className="w-full rounded-md border border-white/10 bg-[#07070d] px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                          />
                        )}

                        {field.type === "textarea" && (
                          <textarea
                            rows={3}
                            value={selectedBlock.props[field.key] || ""}
                            onChange={(e) => handlePropChange(field.key, e.target.value)}
                            className="w-full rounded-md border border-white/10 bg-[#07070d] px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
                          />
                        )}

                        {field.type === "select" && (
                          <select
                            value={selectedBlock.props[field.key] || ""}
                            onChange={(e) => handlePropChange(field.key, e.target.value)}
                            className="w-full rounded-md border border-white/10 bg-[#07070d] px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                          >
                            {(field.options || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === "boolean" && (
                          <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={Boolean(selectedBlock.props[field.key])}
                              onChange={(e) => handlePropChange(field.key, e.target.checked)}
                              className="rounded border-white/20 bg-[#07070d] text-cyan-400 focus:ring-0"
                            />
                            <span className="text-xs text-slate-300">Enabled</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    Select a block on the canvas to inspect and edit its properties.
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: BLOCK TREE / LAYERS */}
            {sidebarTab === "blocks" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Canvas Blocks Order
                  </span>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>

                {page.blocks.map((block, idx) => {
                  const def = BLOCK_DEFINITIONS[block.type];
                  const isSelected = block.id === selectedBlockId;

                  return (
                    <div
                      key={block.id}
                      onClick={() => handleSelectBlock(block.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-2 text-xs transition-all cursor-pointer",
                        isSelected
                          ? "border-cyan-400/50 bg-cyan-500/10 text-white shadow-sm"
                          : "border-white/[0.08] bg-[#07070d]/60 text-slate-300 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[10px] font-mono text-slate-500 w-4">
                          {idx + 1}
                        </span>
                        <span className="font-semibold truncate">{def?.name || block.type}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(idx);
                          }}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(idx);
                          }}
                          disabled={idx === page.blocks.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(idx);
                          }}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete Block"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: DESIGN TOKENS */}
            {sidebarTab === "tokens" && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Theme Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TOKEN_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => handleTokenChange(preset)}
                        className={cn(
                          "rounded-lg border p-2 text-left text-xs font-semibold transition-all",
                          page.tokens.preset === key
                            ? "border-cyan-400 bg-cyan-500/10 text-white"
                            : "border-white/10 bg-[#07070d] text-slate-400 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: preset.primaryAccent }}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: preset.secondaryAccent }}
                          />
                        </div>
                        <span className="capitalize">{key}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Primary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={page.tokens.primaryAccent}
                        onChange={(e) => handleTokenChange({ primaryAccent: e.target.value })}
                        className="h-7 w-7 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={page.tokens.primaryAccent}
                        onChange={(e) => handleTokenChange({ primaryAccent: e.target.value })}
                        className="w-full rounded border border-white/10 bg-[#07070d] px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Secondary Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={page.tokens.secondaryAccent}
                        onChange={(e) => handleTokenChange({ secondaryAccent: e.target.value })}
                        className="h-7 w-7 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={page.tokens.secondaryAccent}
                        onChange={(e) => handleTokenChange({ secondaryAccent: e.target.value })}
                        className="w-full rounded border border-white/10 bg-[#07070d] px-2 py-1 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Border Radius
                    </label>
                    <select
                      value={page.tokens.borderRadius}
                      onChange={(e) => handleTokenChange({ borderRadius: e.target.value as any })}
                      className="w-full rounded border border-white/10 bg-[#07070d] px-2 py-1.5 text-xs text-white"
                    >
                      <option value="none">None (0px)</option>
                      <option value="sm">Small (4px)</option>
                      <option value="md">Medium (8px)</option>
                      <option value="lg">Large (12px)</option>
                      <option value="xl">Extra Large (16px)</option>
                      <option value="full">Full Pill</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center: Live Interactive Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#07070d] p-4 sm:p-8 flex justify-center">
          <div
            className={cn(
              "transition-all duration-300 shadow-2xl relative",
              viewport === "desktop" && "w-full max-w-6xl",
              viewport === "tablet" && "w-[768px]",
              viewport === "mobile" && "w-[375px]"
            )}
            style={{
              backgroundColor: page.tokens.bgCanvas,
              color: page.tokens.textColor,
            }}
          >
            {page.blocks.length === 0 ? (
              <div className="py-32 text-center text-slate-500">
                <p className="text-sm mb-3">No blocks on the canvas.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Block
                </button>
              </div>
            ) : (
              page.blocks.map((block, idx) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  tokens={page.tokens}
                  isSelected={block.id === selectedBlockId}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < page.blocks.length - 1}
                  onSelect={() => handleSelectBlock(block.id)}
                  onMoveUp={() => handleMoveUp(idx)}
                  onMoveDown={() => handleMoveDown(idx)}
                  onDuplicate={() => handleDuplicate(idx)}
                  onDelete={() => handleDelete(idx)}
                />
              ))
            )}
          </div>
        </main>
      </div>

      {/* -------------------- Add Block Modal -------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e1a] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-cyan-400" />
                Add DimensionUI Block
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(["hero", "features", "cta", "footer"] as BlockType[]).map((type) => {
                const def = BLOCK_DEFINITIONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => handleAddBlock(type)}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#07070d] p-3 text-left transition-all hover:border-cyan-400/50 hover:bg-white/[0.03]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{def.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono uppercase">
                          {def.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {def.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Export Code Modal -------------------- */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0e0e1a] p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code className="h-4 w-4 text-purple-400" />
                  Export Production Code
                </h3>
                <div className="flex rounded-md border border-white/10 bg-[#07070d] p-0.5">
                  <button
                    onClick={() => setExportFormat("tsx")}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded transition-colors",
                      exportFormat === "tsx"
                        ? "bg-purple-500 text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    Next.js TSX
                  </button>
                  <button
                    onClick={() => setExportFormat("json")}
                    className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded transition-colors",
                      exportFormat === "json"
                        ? "bg-purple-500 text-white"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    JSON Schema
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Code Output Viewer */}
            <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-[#07070d] p-4 font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="whitespace-pre-wrap">{exportedCode}</pre>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 shrink-0">
              <p className="text-xs text-slate-400">
                {exportFormat === "tsx"
                  ? "Self-contained Next.js 15 / React 19 component with Tailwind v4 & Framer Motion."
                  : "DimensionUI Page Schema ready for storage or CLI import."}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download {exportFormat.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

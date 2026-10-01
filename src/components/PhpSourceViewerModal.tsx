import React, { useState } from 'react';
import { PHP_CODE_COLLECTION, PhpFileTemplate } from '../data/phpCodeTemplates';
import { useApp } from '../context/AppContext';
import { 
  FileCode, 
  Copy, 
  Check, 
  X, 
  Download, 
  Server, 
  Database, 
  FolderTree,
  ExternalLink
} from 'lucide-react';

export const PhpSourceViewerModal: React.FC = () => {
  const { showPhpModal, setShowPhpModal } = useApp();
  const [selectedFile, setSelectedFile] = useState<PhpFileTemplate>(PHP_CODE_COLLECTION[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  if (!showPhpModal) return null;

  const categories = ['Semua', 'Database', 'Config', 'Auth', 'Masyarakat', 'Petugas', 'Admin'];

  const filteredFiles = PHP_CODE_COLLECTION.filter(f => 
    activeCategory === 'Semua' ? true : f.category === activeCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.fileName.replace('/', '_');
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllSql = () => {
    const sqlFile = PHP_CODE_COLLECTION.find(f => f.fileName === 'database.sql');
    if (!sqlFile) return;
    const blob = new Blob([sqlFile.code], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db_jalan_palembang.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Source Code PHP Native & MySQL
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                  PHP 8.2 / MySQLi
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Arsitektur kode backend PHP untuk seluruh 13 modul sistem SIPELAJAR Kota Palembang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAllSql}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700"
              title="Download Skema Database MySQL"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Download database.sql
            </button>
            <button
              onClick={() => setShowPhpModal(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Pills & Info Bar */}
        <div className="px-6 py-3 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-neutral-500 font-mono text-[11px]">
            {filteredFiles.length} berkas PHP & SQL siap pakai
          </div>
        </div>

        {/* Content Body: Left File Tree, Right Code Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[380px]">
          
          {/* File Sidebar */}
          <div className="md:col-span-4 border-r border-neutral-200 bg-neutral-50/50 overflow-y-auto p-3 space-y-1">
            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider px-2 py-1 mb-1 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5" />
              Daftar Berkas PHP
            </div>
            {filteredFiles.map(file => (
              <button
                key={file.fileName}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                  selectedFile.fileName === file.fileName
                    ? 'bg-amber-500 text-white shadow-xs font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${selectedFile.fileName === file.fileName ? 'text-white' : 'text-neutral-400'}`} />
                <div className="truncate">
                  <div className="font-mono truncate">{file.fileName}</div>
                  <div className={`text-[10px] truncate ${selectedFile.fileName === file.fileName ? 'text-amber-100' : 'text-neutral-400'}`}>
                    {file.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-8 flex flex-col bg-neutral-950 overflow-hidden text-neutral-200">
            {/* Sub-header */}
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-amber-400 font-bold">{selectedFile.fileName}</span>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                  {selectedFile.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadSingle}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-colors"
                  title="Unduh file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 text-xs font-mono leading-relaxed select-all">
              <pre className="text-neutral-300 font-mono whitespace-pre-wrap break-all">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer Advice */}
        <div className="px-6 py-3 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Kompatibel dengan XAMPP, Laragon, cPanel hosting, Apache, dan MySQL 5.7+ / MariaDB.
            </span>
          </div>
          <button
            onClick={() => setShowPhpModal(false)}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium text-xs transition-colors"
          >
            Tutup & Lanjutkan Demo
          </button>
        </div>
      </div>
    </div>
  );
};

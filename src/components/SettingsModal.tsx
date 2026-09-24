import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Link, HelpCircle, RefreshCw } from 'lucide-react';
import { getSavedGasUrl, saveGasUrl } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndReload: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveAndReload
}) => {
  const [url, setUrl] = useState(getSavedGasUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!url.trim()) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập đường link Google Apps Script Web App!'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const testUrl = new URL(url.trim());
      testUrl.searchParams.set('action', 'getMonths');

      const res = await fetch(testUrl.toString(), { method: 'GET', mode: 'cors' });
      const json = await res.json();

      if (json && json.success) {
        setTestResult({
          success: true,
          message: `Kết nối thành công! Tìm thấy ${json.months?.length || 0} tháng trong Google Sheet.`
        });
      } else {
        setTestResult({
          success: false,
          message: json.message || 'Không thể đọc danh sách tháng từ Sheet. Vui lòng kiểm tra lại quyền triển khai (Anyone)!'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Lỗi kết nối: ${err.message || 'Kiểm tra xem link Web App đã cấp quyền "Anyone" chưa'}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveGasUrl(url);
    onSaveAndReload();
    onClose();
  };

  const handleUseDemo = () => {
    saveGasUrl('');
    setUrl('');
    onSaveAndReload();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cài Đặt Kết Nối Google Sheet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tự động đồng bộ số liệu qua Google Apps Script Web App
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Google Apps Script Web App URL:
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Link này được tạo sau khi dán mã trong thư mục{' '}
            <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400">
              google-apps-script/Code.gs
            </code>{' '}
            vào mục <b>Tiện ích mở rộng → Apps Script</b> trên Google Sheet của bạn.
          </p>

          {/* Test connection result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Quick Instructions Accordion */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/50 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Cách lấy URL chỉ trong 3 bước:</span>
          </div>
          <ol className="list-decimal list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <li>Mở file Google Sheet → <b>Tiện ích mở rộng</b> → <b>Apps Script</b>.</li>
            <li>Dán code từ file <b className="text-emerald-600">Code.gs</b> vào và bấm Lưu.</li>
            <li>Bấm <b>Triển khai</b> → <b>Ứng dụng web</b> → Ai có quyền truy cập: <b>Bất kỳ ai (Anyone)</b>.</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <button
            onClick={handleUseDemo}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
          >
            Dùng dữ liệu Demo (Tháng 9)
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testing || !url.trim()}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Đang thử...' : 'Kiểm tra'}</span>
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95"
            >
              Lưu & Đồng Bộ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

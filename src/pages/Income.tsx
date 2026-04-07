import { useState } from 'react';
import Layout from '../components/Layout';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import ImageModal from '../components/ImageModal';

export default function Income() {
  const { incomes, totalIncome, loading, addTransaction, updateTransaction, deleteTransaction, uploadReceipt } = useTransactions();
  const { categories, addCategory, loading: loadingCats } = useCategories('income');

  // Form State
  const getThaiDate = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const getThaiTime = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    transaction_date: getThaiDate(),
    transaction_time: getThaiTime(),
    amount: '',
    category: '', 
    description: '',
    payment_method: 'transfer' as 'transfer' | 'cash',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'cash' | 'transfer'>('all');

  // Image Upload State
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const filteredIncomes = incomes.filter(item => {
    if (activeTab === 'all') return true;
    return item.payment_method === activeTab;
  });

  const filteredTotal = filteredIncomes.reduce((sum, item) => sum + Number(item.amount), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };
  return (
    <Layout title="Income Management">
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-[1.75rem] font-bold text-blue-900 tracking-tight mb-1">การจัดการรายรับ</h2>
          <p className="text-slate-500 text-[12px] md:text-sm">บันทึกและติดตามรายได้ทั้งหมดของคุณ</p>
        </div>
      </div>

      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12">
        <div className="bg-surface-lowest p-6 rounded-xl border-l-4 border-secondary shadow-sm">
          <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">รายรับเดือนนี้</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-secondary tracking-tight">
              {loading ? '...' : formatCurrency(totalIncome)}
            </h3>
            <span className="text-secondary text-sm font-medium mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> ระบบจริง
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-surface-lowest rounded-2xl p-6 md:p-8 shadow-sm order-2 lg:order-1">
          <div className="mb-6 md:mb-8">
            <h4 className="text-lg md:text-xl font-bold text-blue-900 tracking-tight">{editingId ? 'แก้ไขข้อมูลรายรับ' : 'ระบุข้อมูลรายรับใหม่'}</h4>
            <p className="text-xs md:text-sm text-slate-500 mt-1">กรอกข้อมูลเพื่อบันทึกธุรกรรมลงในสมุดบัญชีของคุณ</p>
          </div>
          <form 
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!formData.amount || !formData.transaction_date) return;
              
              setIsSubmitting(true);
              try {
                let currentImageUrl = formData.image_url;
                if (receiptFile) {
                  currentImageUrl = await uploadReceipt(receiptFile);
                }

                // Determine if timezone is applied or not.
                let isoDate = formData.transaction_date;
                if (formData.transaction_time) {
                    isoDate = `${formData.transaction_date}T${formData.transaction_time}:00+07:00`;
                }

                const payload = {
                  transaction_date: isoDate,
                  amount: Number(formData.amount),
                  description: formData.description,
                  category: formData.category || (categories.length > 0 ? categories[0].name : 'รายได้หลัก'),
                  transaction_type: 'income' as const,
                  payment_method: formData.payment_method,
                  ...(currentImageUrl ? { image_url: currentImageUrl } : {})
                };

                if (editingId) {
                  await updateTransaction(editingId, payload);
                  setEditingId(null);
                } else {
                  await addTransaction(payload);
                }
                
                // Reset form
                setFormData({
                  transaction_date: getThaiDate(),
                  transaction_time: getThaiTime(),
                  amount: '',
                  category: categories.length > 0 ? categories[0].name : '',
                  description: '',
                  payment_method: 'transfer',
                  image_url: ''
                });
                setReceiptFile(null);
                setReceiptPreview(null);
              } catch (error) {
                console.error("Failed to save transaction", error);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">วันที่รับเงิน</label>
                  <input 
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none" 
                    type="date"
                    required
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({...formData, transaction_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">เวลา</label>
                  <div className="flex gap-1 items-center bg-surface-container rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-fixed-dim">
                    <select 
                      className="w-full bg-transparent border-none py-3 pl-4 pr-1 text-sm outline-none appearance-none font-medium text-center"
                      value={formData.transaction_time?.split(':')[0] || '12'}
                      onChange={(e) => setFormData({...formData, transaction_time: `${e.target.value}:${formData.transaction_time?.split(':')[1] || '00'}`})}
                    >
                      {Array.from({length: 24}).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                    </select>
                    <span className="font-bold text-slate-400">:</span>
                    <select 
                      className="w-full bg-transparent border-none py-3 pl-1 pr-1 text-sm outline-none appearance-none font-medium text-center"
                      value={formData.transaction_time?.split(':')[1] || '00'}
                      onChange={(e) => setFormData({...formData, transaction_time: `${formData.transaction_time?.split(':')[0] || '12'}:${e.target.value}`})}
                    >
                      {Array.from({length: 60}).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                    </select>
                    <span className="text-[10px] md:text-xs text-slate-500 font-bold pr-4">น.</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">จำนวนเงิน (บาท)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">฿</span>
                  <input 
                    className="w-full bg-surface-container border-none rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none" 
                    placeholder="0.00" 
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">หมวดหมู่</label>
                <div className="flex flex-col gap-2">
                  <select 
                    className="w-full bg-surface-container border-none rounded-xl py-3 md:py-3.5 px-4 focus:ring-2 focus:ring-primary-fixed-dim font-medium appearance-none outline-none text-sm disabled:opacity-50"
                    value={formData.category || (categories.length > 0 ? categories[0].name : '')}
                    onChange={e => {
                      if (e.target.value === 'add_new') {
                        setIsAddingCategory(true);
                      } else {
                        setFormData({...formData, category: e.target.value});
                      }
                    }}
                    disabled={loadingCats || isAddingCategory}
                  >
                    {!loadingCats && categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="add_new" className="font-bold text-primary">+ เพิ่มหมวดหมู่ใหม่...</option>
                  </select>
                  {isAddingCategory && (
                    <div className="flex gap-2 items-center bg-surface-container-high p-2 rounded-xl mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <input 
                        type="text" 
                        className="flex-1 bg-surface-lowest border-none rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-primary text-sm shadow-inner"
                        placeholder="พิมพ์..."
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        autoFocus
                      />
                      <button 
                        type="button"
                        className="bg-primary text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-sm"
                        onClick={async () => {
                          if (!newCategoryName.trim()) return;
                          try {
                            const newCat = await addCategory(newCategoryName.trim(), 'income');
                            setFormData({...formData, category: newCat.name});
                            setIsAddingCategory(false);
                            setNewCategoryName('');
                          } catch (e) {
                            alert('ไม่สามารถเพิ่มได้');
                          }
                        }}
                      >
                        เพิ่ม
                      </button>
                      <button 
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-surface-lowest rounded-lg transition-colors"
                        onClick={() => {
                          setIsAddingCategory(false);
                          setNewCategoryName('');
                        }}
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">คำอธิบาย</label>
                <input 
                  className="w-full bg-surface-container border-none rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none" 
                  placeholder="ระบุรายละเอียด" 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">รูปใบเสร็จ/สลิปโอนเงิน (ถ้ามี)</label>
              <div className="flex flex-col gap-3">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReceiptFile(e.target.files[0]);
                      setReceiptPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {(receiptPreview || formData.image_url) && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm">
                    <img src={receiptPreview || formData.image_url} alt="Receipt Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        setReceiptFile(null);
                        setReceiptPreview(null);
                        setFormData({...formData, image_url: ''});
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest px-1">รูปแบบการรับเงิน</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer group">
                  <input className="sr-only peer" name="payment_type" type="radio" value="cash" checked={formData.payment_method === 'cash'} onChange={() => setFormData({...formData, payment_method: 'cash'})} />
                  <div className="p-4 bg-surface-container border-2 border-transparent peer-checked:border-primary-container peer-checked:bg-primary/5 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all group-hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-slate-500 group-peer-checked:text-primary">payments</span>
                    <span className="font-medium text-xs md:text-sm text-slate-600 group-peer-checked:text-primary">เงินสด</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input className="sr-only peer" name="payment_type" type="radio" value="transfer" checked={formData.payment_method === 'transfer'} onChange={() => setFormData({...formData, payment_method: 'transfer'})} />
                  <div className="p-4 bg-surface-container border-2 border-transparent peer-checked:border-primary-container peer-checked:bg-primary/5 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all group-hover:bg-surface-container-high">
                    <span className="material-symbols-outlined text-slate-500 group-peer-checked:text-primary">account_balance</span>
                    <span className="font-medium text-xs md:text-sm text-slate-600 group-peer-checked:text-primary">เงินโอน</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              {editingId && (
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      transaction_date: getThaiDate(),
                      transaction_time: getThaiTime(),
                      amount: '',
                      category: categories.length > 0 ? categories[0].name : '',
                      description: '',
                      payment_method: 'transfer',
                      image_url: ''
                    });
                    setReceiptFile(null);
                    setReceiptPreview(null);
                  }}
                  className="w-1/3 py-3 md:py-4 bg-surface-container text-slate-500 font-bold rounded-xl hover:bg-surface-high transition-all" 
                  type="button"
                >
                  <span className="text-sm md:text-base">ยกเลิก</span>
                </button>
              )}
              <button 
                className={`${editingId ? 'w-2/3' : 'w-full'} py-3 md:py-4 ${isSubmitting ? 'bg-slate-300' : 'bg-gradient-to-br from-primary-container to-primary'} text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4 hover:opacity-90 active:scale-[0.98] transition-all`} 
                type="submit"
                disabled={isSubmitting}
              >
                <span className="material-symbols-outlined text-sm md:text-base">{editingId ? 'edit' : 'add_circle'}</span>
                {isSubmitting ? 'กำลังบันทึก...' : (editingId ? 'อัปเดตข้อมูล' : 'บันทึกรายการ')}
              </button>
            </div>
          </form>
        </div>

        {/* Visual Right Column */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <div className="bg-primary-container rounded-2xl p-6 md:p-8 text-white relative overflow-hidden h-48 md:h-64 flex flex-col justify-end">
            <div className="absolute inset-0 z-0 opacity-40">
              <img alt="Finance background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYwWg8FWFyXWSYQpoIe9GsHSHEsNuc2utG_oqDyxmIofvwHn5HaeYuhD6xOsnSN3dxaPfr5npIHyg8cNcZnSBHdu-TxBSAjW7JuhXRknz6HfiV7856tak6Ff6Lxyw2K4Zpsq2O7fuv7-5_4rtoPIBakaMBmWabq7vJJ9XvvRSPRwAPJQan1ZCP_ErpcV8L49HdVJjv5MgyxG-dBKIviY0W71XBD-OcuGY6m9gdDbH0yVe71zb2-skjeBwInY3KRJlwHYzWwSdXWmQr" />
            </div>
            <div className="relative z-10">
              <h4 className="text-xl md:text-2xl font-black mb-2 tracking-tight">วิสัยทัศน์ทางการเงิน</h4>
              <p className="text-on-primary-container text-xs md:text-sm leading-relaxed max-w-xs">การบันทึกรายรับที่แม่นยำคือจุดเริ่มต้นของความมั่งคั่งที่ยั่งยืน</p>
            </div>
          </div>
          <div className="bg-surface-lowest rounded-2xl p-6 shadow-sm">
            <h5 className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">รายการบัญชีล่าสุด</h5>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-sm text-slate-400 py-4">กำลังโหลดข้อมูล...</div>
              ) : incomes.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-4">ไม่มีรายการล่าสุด</div>
              ) : (
                incomes.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-secondary/10 text-secondary`}>
                        <span className="material-symbols-outlined text-sm md:text-base">account_balance_wallet</span>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-bold text-on-surface">{item.description || item.category}</p>
                        <p className="text-[10px] md:text-xs text-slate-400">
                          {new Date(item.transaction_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' })} 
                          {item.transaction_date.includes('T') && ` • ${new Date(item.transaction_date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })} น.`}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-secondary">+{formatCurrency(item.amount)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12 bg-surface-lowest rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 flex flex-col items-start gap-4 border-b border-surface-container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
            <h4 className="text-lg md:text-xl font-bold text-blue-900 tracking-tight">ประวัติรายรับ</h4>
            <div className="text-left md:text-right">
              <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">ยอดรวมตามตัวกรอง</p>
              <h5 className="text-xl md:text-2xl font-black text-secondary">+{formatCurrency(filteredTotal)}</h5>
            </div>
          </div>
          
          <div className="flex flex-row gap-1 bg-surface-container-low p-1.5 rounded-xl mt-2 w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-surface-lowest text-primary shadow-sm' : 'text-slate-500 hover:text-primary'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setActiveTab('cash')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'cash' ? 'bg-surface-lowest text-primary shadow-sm' : 'text-slate-500 hover:text-primary'}`}
            >
              เงินสด
            </button>
            <button 
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'transfer' ? 'bg-surface-lowest text-primary shadow-sm' : 'text-slate-500 hover:text-primary'}`}
            >
              เงินโอน
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">วันที่</th>
                <th className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">คำอธิบาย</th>
                <th className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">ประเภท</th>
                <th className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">จำนวนเงิน</th>
                <th className="px-6 md:px-8 py-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                   <td colSpan={5} className="px-6 py-6 text-center text-slate-400">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : filteredIncomes.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-6 text-center text-slate-400">ไม่มีข้อมูลในหมวดหมู่นี้</td>
                </tr>
              ) : (
                filteredIncomes.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm text-slate-600">
                      <div className="flex flex-col">
                        <span>{new Date(row.transaction_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok' })}</span>
                        {row.transaction_date.includes('T') && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            เวลา {new Date(row.transaction_date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })} น.
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm font-medium text-on-surface">
                      <div className="flex items-center gap-3">
                        {row.image_url && (
                          <div 
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 bg-slate-100"
                            onClick={() => setModalImage(row.image_url!)}
                          >
                            <img src={row.image_url} alt="Receipt" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span>{row.description || row.category}</span>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <span className={`px-2 md:px-3 py-1 bg-primary/10 text-primary text-[8px] md:text-[10px] font-bold rounded-full uppercase tracking-tighter`}>{row.payment_method === 'cash' ? 'เงินสด' : 'เงินโอน'}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm font-bold text-secondary">+{formatCurrency(row.amount)}</td>
                    <td className="px-6 md:px-8 py-4 md:py-5 text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <button 
                          onClick={() => {
                            const dateObj = new Date(row.transaction_date);
                            const hasTime = row.transaction_date.includes('T');
                            
                            setEditingId(row.id);
                            setFormData({
                              transaction_date: hasTime ? dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }) : row.transaction_date.split('T')[0],
                              transaction_time: hasTime ? dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' }) : '12:00',
                              amount: row.amount.toString(),
                              category: row.category || '',
                              description: row.description || '',
                              payment_method: row.payment_method,
                              image_url: row.image_url || ''
                            });
                          }}
                          className="w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm md:text-lg">edit_square</span>
                        </button>
                        <button 
                          onClick={async () => {
                            await deleteTransaction(row.id);
                          }}
                          className="w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-tertiary-container hover:bg-tertiary-container/5 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm md:text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ImageModal isOpen={!!modalImage} imageUrl={modalImage} onClose={() => setModalImage(null)} />
    </Layout>
  );
}

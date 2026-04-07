import Layout from '../components/Layout';
import { useTransactions } from '../hooks/useTransactions';

export default function Dashboard() {
  const { transactions, incomes, expenses, totalIncome, totalExpense, balance, loading } = useTransactions();
  
  // Custom format function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  // Process Category Proportions
  const expenseByCategory = expenses.reduce((acc, t) => {
    const cat = t.category || 'อื่นๆ';
    acc[cat] = (acc[cat] || 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const categoryChartList = Object.entries(expenseByCategory)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 4)
    .map((item, index) => {
        const colors = ['bg-tertiary', 'bg-tertiary-container', 'bg-blue-400', 'bg-slate-300'];
        const percentage = totalExpense > 0 ? Math.round((item[1] / totalExpense) * 100) : 0;
        return { l: item[0], c: colors[index % colors.length], v: `${percentage}%` };
    });

  if (categoryChartList.length === 0) {
    categoryChartList.push({ l: 'ไม่มีข้อมูล', c: 'bg-slate-100', v: '0%' });
  }

  // Process Monthly Chart
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const today = new Date();
  
  const monthlyData = Array.from({length: 6}).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
      const mLabel = monthNames[d.getMonth()];
      const mYear = d.getFullYear();

      const incMonth = incomes
        .filter(t => {
          const tDate = new Date(t.transaction_date);
          return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === mYear;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expMonth = expenses
        .filter(t => {
          const tDate = new Date(t.transaction_date);
          return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === mYear;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return { 
          m: mLabel, 
          incVal: incMonth, 
          expVal: expMonth, 
          active: i === 5 
      };
  });

  const maxChartVal = Math.max(...monthlyData.map(d => Math.max(d.incVal, d.expVal)), 0);
  // Calculate heights (1 to 24 mapping based on maxVal for Tailwind h-1 to h-64 basically, but we'll use inline styles for accurate percentage heights)

  return (
    <Layout title="Dashboard">
      <div className="mb-6 md:mb-10">
        <h2 className="text-2xl md:text-[1.75rem] font-bold text-blue-900 tracking-tight mb-1">แดชบอร์ดภาพรวม</h2>
        <p className="text-slate-500 text-[12px] md:text-sm">
          ยินดีต้อนรับกลับสู่พื้นที่จัดการการเงินของคุณ สรุปข้อมูล ณ วันที่ {today.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-lowest p-8 rounded-[1.5rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl text-secondary">trending_up</span>
          </div>
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">รายรับรวม</p>
          <h3 className="text-3xl font-black text-secondary tracking-tighter mb-4 truncate" title={formatCurrency(totalIncome)}>
            {loading ? '...' : formatCurrency(totalIncome)}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-secondary bg-secondary-container/20 w-fit px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>รายรับทั้งหมด</span>
          </div>
        </div>

        <div className="bg-surface-lowest p-8 rounded-[1.5rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl text-tertiary">trending_down</span>
          </div>
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">รายจ่ายรวม</p>
          <h3 className="text-3xl font-black text-tertiary tracking-tighter mb-4 truncate" title={formatCurrency(totalExpense)}>
            {loading ? '...' : formatCurrency(totalExpense)}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-tertiary bg-tertiary-container/10 w-fit px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            <span>รายจ่ายทั้งหมด</span>
          </div>
        </div>

        <div className="bg-primary p-8 rounded-[1.5rem] shadow-lg shadow-primary/20 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl text-white">account_balance_wallet</span>
          </div>
          <p className="text-xs font-bold text-primary-fixed-dim tracking-widest uppercase mb-2">ยอดคงเหลือสุทธิ</p>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-4 truncate" title={formatCurrency(balance)}>
            {loading ? '...' : formatCurrency(balance)}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm shadow-sm pointer-events-none">
            <span className="material-symbols-outlined text-[14px]">savings</span>
            <span>รายรับ - รายจ่าย</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-surface-lowest p-8 rounded-[1.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-lg font-bold text-blue-900">แนวโน้มรายเดือน</h4>
              <p className="text-xs text-slate-500">การเปรียบเทียบรายรับและรายจ่าย 6 เดือนย้อนหลัง</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">รายรับ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">รายจ่าย</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full relative flex items-end justify-between px-2 pb-6">
            <div className="absolute inset-0 flex flex-col justify-between py-2 border-b border-slate-100 pointer-events-none z-0 mb-6">
              <div className="w-full border-t border-slate-50 h-[1px]"></div>
              <div className="w-full border-t border-slate-50 h-[1px]"></div>
              <div className="w-full border-t border-slate-50 h-[1px]"></div>
              <div className="w-full border-t border-slate-100 h-[1px]"></div>
            </div>
            
            {monthlyData.map((d, i) => {
              const incHeight = maxChartVal > 0 ? (d.incVal / maxChartVal) * 100 : 0;
              const expHeight = maxChartVal > 0 ? (d.expVal / maxChartVal) * 100 : 0;
              
              return (
              <div key={i} className="relative flex-1 flex flex-col items-center gap-1 group z-10 h-full justify-end">
                <div className="flex items-end gap-1 w-full justify-center h-[calc(100%-8px)]">
                  <div 
                    title={`รายรับ ${formatCurrency(d.incVal)}`}
                    style={{ height: `${Math.max(incHeight, 2)}%` }} // min height 2% for visibility if 0
                    className={`w-3 sm:w-4 ${d.active ? 'bg-secondary' : 'bg-secondary/20 transition-all group-hover:bg-secondary/40'} rounded-t-md`}
                  ></div>
                  <div 
                    title={`รายจ่าย ${formatCurrency(d.expVal)}`}
                    style={{ height: `${Math.max(expHeight, 2)}%` }} // min height 2% for visibility if 0
                    className={`w-3 sm:w-4 ${d.active ? 'bg-tertiary' : 'bg-tertiary/20 transition-all group-hover:bg-tertiary/40'} rounded-t-md`}
                  ></div>
                </div>
                <span className={`text-[10px] sm:text-xs ${d.active ? 'text-blue-900 font-bold' : 'text-slate-400 font-medium'} absolute -bottom-6 whitespace-nowrap`}>
                  {d.m}
                </span>
              </div>
            )})}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div>
            <h4 className="text-lg font-bold text-blue-900 mb-6">สัดส่วนค่าใช้จ่าย 4 อันดับแรก</h4>
            <div className="space-y-4 md:space-y-6 relative z-10">
              {categoryChartList.map((s, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-6 md:h-8 ${s.c} rounded-full transition-transform group-hover:scale-110`}></div>
                    <span className="text-xs md:text-sm font-medium text-slate-700 truncate max-w-[120px] sm:max-w-[150px]">{s.l}</span>
                  </div>
                  <span className="text-sm md:text-base font-bold pl-2">{s.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none z-0">
            <span className="material-symbols-outlined text-[150px]">pie_chart</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-lowest rounded-[1.5rem] shadow-sm overflow-hidden mt-6 md:mt-0">
        <div className="px-5 md:px-8 py-4 md:py-6 border-b border-surface-container flex items-center justify-between">
          <h4 className="text-base md:text-lg font-bold text-blue-900">รายการเคลื่อนไหวล่าสุด</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่และเวลา</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">รายการ / คำอธิบาย</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">จำนวนเงิน</th>
                <th className="px-6 md:px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ประเภทการจ่าย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-8 text-center text-slate-400">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-8 text-center text-slate-400">ยังไม่มีข้อมูลเริ่มต้นการใช้งานระบบ</td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm text-slate-600">
                      <div className="flex flex-col">
                        <span>{new Date(t.transaction_date).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric', timeZone: 'Asia/Bangkok' })}</span>
                        {t.transaction_date.includes('T') && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            เวลา {new Date(t.transaction_date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })} น.
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 font-bold text-on-surface text-xs md:text-sm">{t.description || t.category}</td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <span className={`px-3 py-1 text-[9px] md:text-[10px] font-bold rounded-full uppercase ${t.transaction_type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'}`}>{t.category}</span>
                    </td>
                    <td className={`px-6 md:px-8 py-4 md:py-5 text-right font-black text-xs md:text-sm ${t.transaction_type === 'income' ? 'text-secondary' : 'text-tertiary'}`}>
                      {t.transaction_type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5">
                      <div className="flex justify-center">
                        <span className={`px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-bold rounded-full tracking-tighter bg-surface-container-high text-slate-500`}>
                           {t.payment_method === 'cash' ? 'เงินสด' : 'เงินโอน'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

import Layout from '../components/Layout';

export default function Calculator() {
  return (
    <Layout title="Tax Calculator">
      <div className="space-y-6 md:space-y-8">
        <div className="mb-6 md:mb-10 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tighter text-blue-900">คำนวณภาษีเงินได้</h2>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-primary-container to-primary p-6 md:p-8 rounded-[2rem] text-white flex flex-col justify-between min-h-[200px] md:min-h-[240px] shadow-xl shadow-primary/20">
            <div>
              <p className="text-xs md:text-sm font-medium text-on-primary-container tracking-widest uppercase">ภาษีสุทธิที่ต้องชำระ (ESTIMATED)</p>
              <h3 className="text-3xl md:text-5xl font-black mt-2 tracking-tight">฿ 42,500.00</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 md:mt-8 gap-4">
              <div className="flex gap-6 md:gap-8">
                <div>
                  <p className="text-[10px] text-on-primary-container uppercase font-bold tracking-wider">รายได้ทั้งหมด</p>
                  <p className="text-base md:text-lg font-semibold">฿ 1,250,000</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-primary-container uppercase font-bold tracking-wider">ค่าลดหย่อน</p>
                  <p className="text-base md:text-lg font-semibold">฿ 360,000</p>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs md:text-sm w-full md:w-auto">
                <span className="material-symbols-outlined text-base md:text-lg">refresh</span>
                Recalculate
              </button>
            </div>
          </div>

          <div className="bg-surface-lowest p-6 md:p-8 rounded-[2rem] flex flex-col justify-between shadow-sm border border-outline-variant/10">
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">ฐานภาษีปัจจุบัน</p>
              <h4 className="text-2xl md:text-3xl font-bold text-primary mt-1">20%</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">คุณอยู่ในเกณฑ์รายได้สุทธิ <br className="hidden md:block" />750,001 - 1,000,000 บาท</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-end">
                <span className="text-[10px] md:text-xs font-bold text-secondary uppercase">ประหยัดภาษีได้อีก</span>
                <span className="text-lg md:text-xl font-bold text-secondary">฿ 12,400</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-secondary h-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-2">
              <h3 className="text-lg md:text-xl font-bold text-blue-900 tracking-tight">โครงสร้างภาษีแบบขั้นบันได</h3>
              <span className="text-[10px] md:text-xs font-bold text-slate-400">ปีภาษี 2567</span>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-1 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[500px]">
                  <thead className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <tr>
                      <th className="px-4 md:px-6 py-2 md:py-3">ช่วงเงินได้สุทธิ</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 text-center">อัตราภาษี</th>
                      <th className="px-4 md:px-6 py-2 md:py-3 text-right">ภาษีแต่ละขั้น</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs md:text-sm">
                    <tr className="bg-surface-lowest hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-l-2xl font-medium">0 - 150,000</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center text-slate-500">ยกเว้น</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-r-2xl text-right text-slate-400">0</td>
                    </tr>
                    <tr className="bg-surface-lowest hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-l-2xl font-medium">150,001 - 300,000</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">5%</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-r-2xl text-right">7,500</td>
                    </tr>
                    <tr className="bg-surface-lowest hover:bg-slate-50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-l-2xl font-medium">300,001 - 500,000</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">10%</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-r-2xl text-right">20,000</td>
                    </tr>
                    <tr className="bg-surface-lowest hover:bg-slate-50 transition-colors ring-2 ring-primary/10">
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-l-2xl font-bold text-primary">500,001 - 750,000</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center font-bold text-primary">15%</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-r-2xl text-right font-bold text-primary">15,000</td>
                    </tr>
                    <tr className="bg-surface-lowest opacity-40">
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-l-2xl font-medium">750,001 ขึ้นไป</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-center">20%</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 rounded-r-2xl text-right">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-6">
            <h3 className="text-lg md:text-xl font-bold text-blue-900 tracking-tight">รายการลดหย่อนภาษี</h3>
            <div className="space-y-4">
              <div className="p-4 md:p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg md:text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-slate-800">ค่าลดหย่อนส่วนตัว</p>
                    <p className="text-[10px] md:text-xs text-slate-500">สิทธิพื้นฐานทุกคน</p>
                  </div>
                </div>
                <p className="text-sm md:text-base font-bold text-blue-900">฿ 60,000</p>
              </div>

              <div className="p-4 md:p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-lg md:text-xl">trending_up</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-slate-800">SSF / RMF</p>
                    <p className="text-[10px] md:text-xs text-slate-500">กองทุนเพื่อการออม</p>
                  </div>
                </div>
                <p className="text-sm md:text-base font-bold text-blue-900">฿ 200,000</p>
              </div>

              <div className="p-4 md:p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-lg md:text-xl">health_and_safety</span>
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold text-slate-800">เบี้ยประกันชีวิต</p>
                    <p className="text-[10px] md:text-xs text-slate-500">ประกันชีวิตและสุขภาพ</p>
                  </div>
                </div>
                <p className="text-sm md:text-base font-bold text-blue-900">฿ 100,000</p>
              </div>

              <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                เพิ่มรายการลดหย่อน
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h4 className="text-2xl md:text-3xl font-bold leading-tight">วิเคราะห์โครงสร้าง<br className="hidden md:block" />รายได้และภาษีของคุณ</h4>
              <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">สัดส่วนภาษีต่อรายได้ของคุณคิดเป็น 3.4% ซึ่งต่ำกว่าค่าเฉลี่ยในกลุ่มรายได้เดียวกันเนื่องจากคุณใช้สิทธิลดหย่อนได้ค่อนข้างเต็มที่</p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button className="bg-primary-container text-white px-8 py-3 rounded-full font-bold text-xs md:text-sm hover:scale-105 active:scale-95 transition-all">ดูรายงานฉบับเต็ม</button>
                <button className="bg-white/10 text-white px-8 py-3 rounded-full font-bold text-xs md:text-sm hover:bg-white/20 transition-all">แชร์ผลลัพธ์</button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="stroke-slate-800 fill-none" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="stroke-secondary fill-none" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-4xl font-black">75%</span>
                  <span className="text-[8px] md:text-[10px] uppercase text-slate-400 font-bold tracking-widest">Efficiency</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full point-events-none"></div>
        </div>
      </div>
    </Layout>
  );
}

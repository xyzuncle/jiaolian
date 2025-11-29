import { defineComponent } from 'vue';
import { Target, Lightbulb, ShieldCheck } from 'lucide-vue-next';

export default defineComponent({
  name: 'SystemDesign',
  components: { Target, Lightbulb, ShieldCheck },
  setup() {
    return { };
  },
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4 opacity-5">
           <Target :size="120" />
        </div>
        <h2 class="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
          <span class="bg-blue-100 text-blue-700 p-2 rounded-lg"><Target :size="24" /></span>
          1. 系统设计目标
        </h2>
        <p class="text-slate-600 leading-relaxed mb-4 relative z-10 text-lg">
          <strong>健身俱乐部管理系统</strong> 旨在简化现代化健身房的日常运营流程。
          主要目标是高效管理会员信息、教练排班、课程预订以及器材库存。
          该系统旨在减少人工文书工作，防止预订冲突，并为俱乐部的运营绩效提供财务洞察。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <span class="bg-amber-100 text-amber-600 p-1.5 rounded-lg"><Lightbulb :size="20" /></span>
            开发设计思想
          </h3>
          <ul class="space-y-3 text-slate-600">
            <li class="flex gap-3">
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong class="text-slate-800">数据完整性:</strong> 严格的外键约束，确保没有孤立记录（例如，没有有效教练的情况下不能开设课程）。</span>
            </li>
            <li class="flex gap-3">
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong class="text-slate-800">可扩展性:</strong> 采用标准化数据库设计（3NF），以支持未来扩展（如多门店管理）。</span>
            </li>
            <li class="flex gap-3">
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong class="text-slate-800">安全性:</strong> 嵌入表设计的基于角色的访问逻辑。</span>
            </li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <span class="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg"><ShieldCheck :size="20" /></span>
            系统功能分析
          </h3>
          <ul class="space-y-3 text-slate-600">
             <li class="flex gap-3">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>会员管理:</strong> 注册、个人资料更新和会员状态跟踪。</span>
            </li>
            <li class="flex gap-3">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>课程排班:</strong> 指派教练进行授课并管理课程容量。</span>
            </li>
            <li class="flex gap-3">
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
              <span><strong>预订系统:</strong> 处理会员的课程报名与选课。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
});
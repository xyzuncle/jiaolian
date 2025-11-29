import { defineComponent } from 'vue';
import { TABLES } from '../constants';
import { Key, Link, ArrowRightLeft } from 'lucide-vue-next';

export default defineComponent({
  name: 'DatabaseDesign',
  components: { Key, Link, ArrowRightLeft },
  setup() {
    return { TABLES };
  },
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="bg-gradient-to-r from-blue-50 to-white border border-blue-100 p-6 rounded-xl shadow-sm">
        <h2 class="text-2xl font-bold text-slate-800 mb-2">2. 数据库需求分析与逻辑结构</h2>
        <p class="text-slate-600">
          该数据库遵循 <strong>第三范式 (3NF)</strong> 的关系模型设计。
          核心实体是 <strong>会员 (Member)</strong>，他们通过 <strong>选课记录 (Enrollments)</strong> 中间表与 <strong>课程 (Courses)</strong> 进行交互。
          <strong>教练 (Trainers)</strong> 负责授课，<strong>器材 (Equipment)</strong> 作为资产被独立管理。
        </p>
      </div>

      <!-- ER Diagram Representation (Simplified Visual) -->
      <div class="bg-slate-50 border border-slate-200 p-6 rounded-xl overflow-x-auto shadow-inner">
        <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <ArrowRightLeft class="text-blue-600" /> 实体关系图 (ER图)
        </h3>
        <div class="flex flex-wrap gap-8 items-start justify-center min-w-[800px] py-4">
           <!-- Visual Nodes -->
           <div v-for="(table, idx) in TABLES" :key="idx" class="relative group">
              <div class="w-64 bg-white rounded-lg border-2 border-slate-300 shadow-md group-hover:border-blue-500 transition-colors group-hover:shadow-lg group-hover:-translate-y-1 transform duration-300">
                <div class="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-800">
                  {{ table.name.split(' ')[0] }}
                </div>
                <div class="p-4 space-y-2">
                  <div v-for="col in table.columns" :key="col.name" class="flex items-center justify-between text-xs text-slate-600">
                    <span class="flex items-center gap-1">
                      <Key v-if="col.isPK" :size="12" class="text-amber-500" />
                      <Link v-if="col.isFK" :size="12" class="text-blue-500" />
                      <span :class="{'font-bold text-slate-800': col.isPK}">{{ col.name }}</span>
                    </span>
                    <span class="text-slate-400">{{ col.type.split('(')[0] }}</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
        <div class="mt-8 text-center text-sm text-slate-500 bg-white p-2 rounded-lg border border-slate-200 inline-block mx-auto w-full">
          * 关系说明: 教练 (1) ➔ (N) 课程 (1) ⟷ (N) 选课记录 (N) ⟷ (1) 会员
        </div>
      </div>

      <!-- Detailed Schema Table -->
      <div class="grid gap-8">
        <div v-for="table in TABLES" :key="table.name" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div>
              <h3 class="text-lg font-bold text-slate-800">{{ table.name }}</h3>
              <p class="text-sm text-slate-500">{{ table.description }}</p>
            </div>
            <span class="px-3 py-1 bg-white text-xs font-semibold rounded-full text-slate-600 border border-slate-200">
              {{ table.columns.length }} 列
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th class="px-6 py-3 border-b border-slate-200">列名 (Column)</th>
                  <th class="px-6 py-3 border-b border-slate-200">数据类型</th>
                  <th class="px-6 py-3 border-b border-slate-200">约束 (Constraints)</th>
                  <th class="px-6 py-3 border-b border-slate-200">默认值</th>
                  <th class="px-6 py-3 border-b border-slate-200">描述</th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr v-for="(col, idx) in table.columns" :key="idx" class="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                  <td class="px-6 py-3 font-medium text-slate-700 flex items-center gap-2">
                    {{ col.name }}
                    <Key v-if="col.isPK" :size="14" class="text-amber-500" title="Primary Key" />
                    <Link v-if="col.isFK" :size="14" class="text-blue-600" :title="'Foreign Key to ' + col.fkTable" />
                  </td>
                  <td class="px-6 py-3 text-pink-600 font-mono text-xs">{{ col.type }}</td>
                  <td class="px-6 py-3 text-slate-600">
                    <span v-if="col.isPK" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">PK</span>
                    <span v-if="col.isFK" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">FK -> {{ col.fkTable }}</span>
                    <span v-if="col.nullable === false && !col.isPK" class="text-slate-400 text-xs">NOT NULL</span>
                  </td>
                  <td class="px-6 py-3 text-slate-500 font-mono text-xs">{{ col.default || '-' }}</td>
                  <td class="px-6 py-3 text-slate-500">{{ col.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
});
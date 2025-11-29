import { defineComponent, computed } from 'vue';
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Download } from 'lucide-vue-next';
import { MOCK_DATA } from '../constants';
import { ViewMode } from '../types';

export default defineComponent({
  name: 'FunctionalModule',
  components: { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Download },
  props: {
    mode: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const config = computed(() => {
      switch (props.mode) {
        case ViewMode.MEMBER_MGT:
          return {
            title: '会员信息管理',
            subtitle: '管理俱乐部的所有会员档案、状态及余额。',
            data: MOCK_DATA.members,
            columns: [
              { key: 'id', label: 'ID', width: 'w-20' },
              { key: 'name', label: '姓名', width: 'w-32' },
              { key: 'gender', label: '性别', width: 'w-20' },
              { key: 'phone', label: '联系电话', width: 'w-40' },
              { key: 'balance', label: '账户余额', width: 'w-32' },
              { key: 'status', label: '状态', width: 'w-24' },
            ]
          };
        case ViewMode.TRAINER_MGT:
          return {
            title: '教练资源管理',
            subtitle: '管理健身教练的入职信息、专长及课时费。',
            data: MOCK_DATA.trainers,
            columns: [
              { key: 'id', label: '工号', width: 'w-20' },
              { key: 'name', label: '教练姓名', width: 'w-32' },
              { key: 'specialty', label: '专业特长', width: 'w-48' },
              { key: 'rate', label: '课时费', width: 'w-32' },
              { key: 'students', label: '学员数', width: 'w-24' },
            ]
          };
        case ViewMode.COURSE_MGT:
          return {
            title: '课程信息管理',
            subtitle: '发布和维护俱乐部提供的课程列表。',
            data: MOCK_DATA.courses,
            columns: [
              { key: 'id', label: '课程号', width: 'w-20' },
              { key: 'name', label: '课程名称', width: 'w-48' },
              { key: 'trainer', label: '授课教练', width: 'w-32' },
              { key: 'difficulty', label: '难度', width: 'w-24' },
              { key: 'room', label: '教室', width: 'w-24' },
            ]
          };
        case ViewMode.COURSE_MOD:
          return {
            title: '排课与选课模块',
            subtitle: '处理会员选课请求及课程时间安排。',
            data: MOCK_DATA.courses, // Reusing course data for demo
            columns: [
              { key: 'id', label: '排课ID', width: 'w-20' },
              { key: 'time', label: '上课时间', width: 'w-40' },
              { key: 'name', label: '课程', width: 'w-48' },
              { key: 'trainer', label: '教练', width: 'w-32' },
              { key: 'difficulty', label: '难度', width: 'w-24' },
            ]
          };
        default:
          return { title: '模块', subtitle: '', data: [], columns: [] };
      }
    });

    const getStatusClass = (status: string) => {
      if (status === '正常' || status === 'Active') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      if (status === '即将到期') return 'bg-amber-100 text-amber-700 border-amber-200';
      if (status === '冻结') return 'bg-red-100 text-red-700 border-red-200';
      return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return { config, getStatusClass };
  },
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">{{ config.title }}</h2>
          <p class="text-slate-500 mt-1">{{ config.subtitle }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
            <Download :size="16" />
            <span>导出报表</span>
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all">
            <Plus :size="16" />
            <span>新增记录</span>
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="flex gap-4 mb-6">
        <div class="relative flex-1 max-w-md">
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索关键字..." 
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 bg-white"
          />
        </div>
        <button class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <Filter :size="16" />
          <span>筛选</span>
        </button>
      </div>

      <!-- Data Table -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th v-for="col in config.columns" :key="col.key" class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {{ col.label }}
              </th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(row, idx) in config.data" :key="idx" class="hover:bg-blue-50/30 transition-colors group">
              <td v-for="col in config.columns" :key="col.key" class="px-6 py-4 text-sm text-slate-700">
                <span v-if="col.key === 'status'" :class="['px-2.5 py-1 rounded-full text-xs font-medium border', getStatusClass(row[col.key])]">
                  {{ row[col.key] }}
                </span>
                <span v-else :class="{'font-medium text-slate-900': col.key === 'name'}">
                  {{ row[col.key] }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button class="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="编辑">
                    <Edit :size="16" />
                  </button>
                  <button class="p-1.5 text-red-600 hover:bg-red-100 rounded" title="删除">
                    <Trash2 :size="16" />
                  </button>
                  <button class="p-1.5 text-slate-500 hover:bg-slate-100 rounded" title="更多">
                    <MoreHorizontal :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination Mock -->
        <div class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span class="text-sm text-slate-500">显示 1 到 {{ config.data.length }} 条，共 {{ config.data.length }} 条</span>
          <div class="flex gap-1">
            <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-white disabled:opacity-50" disabled>上一页</button>
            <button class="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded text-sm">1</button>
            <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-white">2</button>
            <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-white">下一页</button>
          </div>
        </div>
      </div>
    </div>
  `
});
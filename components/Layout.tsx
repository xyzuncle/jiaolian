
import { defineComponent, ref } from 'vue';
import { APP_NAME, NAV_ITEMS } from '../constants';
import { Dumbbell, ChevronDown, ChevronRight, Menu } from 'lucide-vue-next';

export default defineComponent({
  name: 'Layout',
  components: { Dumbbell, ChevronDown, ChevronRight, Menu },
  props: {
    currentView: {
      type: String,
      required: true
    }
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    // State to track expanded menu items
    const expandedMenus = ref<Record<string, boolean>>({
      'system_functions': true // Default expand system functions
    });

    const toggleMenu = (id: string) => {
      expandedMenus.value[id] = !expandedMenus.value[id];
    };

    const onNavigate = (id: string) => {
      emit('navigate', id);
    };

    const activeLabel = () => {
      // Search top level
      const top = NAV_ITEMS.find(n => n.id === props.currentView);
      if (top) return top.label;
      
      // Search children
      for (const item of NAV_ITEMS) {
        if (item.children) {
          const child = item.children.find(c => c.id === props.currentView);
          if (child) return `${item.label} / ${child.label}`;
        }
      }
      return '系统主页';
    };

    return { APP_NAME, NAV_ITEMS, expandedMenus, toggleMenu, onNavigate, activeLabel };
  },
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 z-10 md:h-screen shadow-sm">
        <div class="p-6 border-b border-slate-100 flex items-center gap-3">
          <div class="bg-blue-600 p-2 rounded-lg shadow-sm">
            <Dumbbell class="text-white" :size="24" />
          </div>
          <span class="font-bold text-lg text-slate-800 tracking-tight">{{ APP_NAME }}</span>
        </div>
        
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <template v-for="item in NAV_ITEMS" :key="item.id">
            <!-- Items with Children (Dropdowns) -->
            <div v-if="item.children">
              <button
                @click="toggleMenu(item.id)"
                class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <component :is="item.icon" :size="18" class="text-slate-500" />
                  {{ item.label }}
                </div>
                <component 
                  :is="expandedMenus[item.id] ? 'ChevronDown' : 'ChevronRight'" 
                  :size="16" 
                  class="text-slate-400" 
                />
              </button>
              
              <!-- Submenu Items -->
              <div v-if="expandedMenus[item.id]" class="ml-9 space-y-1 mt-1 mb-2 border-l-2 border-slate-100 pl-2">
                <button
                  v-for="child in item.children"
                  :key="child.id"
                  @click="onNavigate(child.id)"
                  :class="['w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200', currentView === child.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50']"
                >
                  <span>{{ child.label }}</span>
                </button>
              </div>
            </div>

            <!-- Single Items -->
            <button
              v-else
              @click="onNavigate(item.id)"
              :class="['w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium', currentView === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-700 hover:bg-slate-100']"
            >
              <component :is="item.icon" :size="18" :class="currentView === item.id ? 'text-white' : 'text-slate-500'" />
              {{ item.label }}
            </button>
          </template>
        </nav>
        
        <div class="p-4 border-t border-slate-100 bg-slate-50/50">
           <div class="text-xs text-slate-400 text-center leading-relaxed">
             2025 届毕业设计作品<br/>
             <span class="opacity-75">健身俱乐部管理系统</span>
           </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <header class="bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-5 sticky top-0 z-10 flex justify-between items-center shadow-sm">
           <h1 class="text-xl font-bold text-slate-800 flex items-center gap-2">
             <span class="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
             {{ activeLabel() }}
           </h1>
           <div class="flex items-center gap-3">
             <div class="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
               当前用户: 管理员 (Admin)
             </div>
             <div class="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
               AD
             </div>
           </div>
        </header>
        <div class="p-8 max-w-6xl mx-auto">
          <slot></slot>
        </div>
      </main>
    </div>
  `
});

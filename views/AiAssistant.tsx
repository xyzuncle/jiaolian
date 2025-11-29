import { defineComponent, ref, watch, nextTick } from 'vue';
import { Send, Bot, User } from 'lucide-vue-next';
import { chatWithAi } from '../services/gemini';

export default defineComponent({
  name: 'AiAssistant',
  components: { Send, Bot, User },
  setup() {
    const messages = ref([
      { role: 'model', text: '你好！我是你的 SQL 数据库助手。关于健身俱乐部数据库设计或 SQL 语法，你可以问我任何问题！' }
    ]);
    const input = ref('');
    const isLoading = ref(false);
    const scrollRef = ref<HTMLDivElement | null>(null);

    watch(messages, async () => {
      await nextTick();
      if (scrollRef.value) {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      }
    }, { deep: true });

    const handleSend = async () => {
      if (!input.value.trim() || isLoading.value) return;

      const userMsg = input.value;
      input.value = '';
      messages.value.push({ role: 'user', text: userMsg });
      isLoading.value = true;

      // Get basic history for context
      const history = messages.value.slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`);
      
      const response = await chatWithAi(userMsg, history);
      
      messages.value.push({ role: 'model', text: response });
      isLoading.value = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return { messages, input, isLoading, scrollRef, handleSend, handleKeyDown };
  },
  template: `
    <div class="h-[600px] flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl animate-fade-in">
      <div class="bg-slate-900 p-4 border-b border-slate-700 flex items-center gap-2">
        <Bot class="text-green-400" />
        <h2 class="text-lg font-bold text-white">AI SQL 数据库导师</h2>
      </div>
      
      <div ref="scrollRef" class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
          <div :class="['flex gap-3 max-w-[80%]', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600']">
              <User v-if="msg.role === 'user'" :size="16" />
              <Bot v-else :size="16" />
            </div>
            <div :class="['p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap', msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600']">
              {{ msg.text }}
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-start">
           <div class="bg-slate-700 p-3 rounded-lg ml-11 text-sm text-slate-400 italic">
             思考中...
           </div>
        </div>
      </div>

      <div class="p-4 bg-slate-800 border-t border-slate-700">
        <div class="relative">
          <textarea
            v-model="input"
            @keydown="handleKeyDown"
            placeholder="例如：如何写一个左连接 (Left Join) 查询？"
            class="w-full bg-slate-900 text-white rounded-lg pl-4 pr-12 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none h-14"
          ></textarea>
          <button 
            @click="handleSend"
            :disabled="isLoading || !input.trim()"
            class="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded text-white transition-colors"
          >
            <Send :size="18" />
          </button>
        </div>
      </div>
    </div>
  `
});
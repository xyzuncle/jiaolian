import { defineComponent, ref } from 'vue';
import { Copy, Check } from 'lucide-vue-next';

export default defineComponent({
  name: 'SqlCodeBlock',
  components: { Copy, Check },
  props: {
    code: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'SQL Script'
    }
  },
  setup(props) {
    const copied = ref(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(props.code);
      copied.value = true;
      setTimeout(() => copied.value = false, 2000);
    };

    return { copied, handleCopy };
  },
  template: `
    <div class="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm group">
      <div class="flex items-center justify-between px-4 py-2 bg-slate-100 border-b border-slate-200">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
          {{ label }}
        </span>
        <button
          @click="handleCopy"
          class="text-slate-400 hover:text-blue-600 transition-colors bg-white p-1 rounded border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="复制"
        >
          <Check v-if="copied" :size="14" class="text-green-600" />
          <Copy v-else :size="14" />
        </button>
      </div>
      <div class="p-4 overflow-x-auto bg-white">
        <pre class="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-mono"><code>{{ code }}</code></pre>
      </div>
    </div>
  `
});
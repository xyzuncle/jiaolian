import { defineComponent, ref } from 'vue';
import { TABLES, REQUIRED_QUERIES, VIEW_DEFINITIONS } from '../constants';
import SqlCodeBlock from '../components/SqlCodeBlock';
import { Database, Play, Eye, Sparkles } from 'lucide-vue-next';
import { generateSqlExplanation } from '../services/gemini';

export default defineComponent({
  name: 'SqlLab',
  components: { SqlCodeBlock, Database, Play, Eye, Sparkles },
  setup() {
    const activeTab = ref('create'); // 'create' | 'insert' | 'query' | 'views'
    const explanation = ref<{id: string, text: string} | null>(null);
    const loadingExpl = ref<string | null>(null);

    // --- Logic to Generate Strings ---
    const generateDDL = () => {
      return TABLES.map(table => {
        const cols = table.columns.map(col => {
          let line = `  ${col.name} ${col.type}`;
          if (col.isPK) line += " PRIMARY KEY IDENTITY(1,1)"; 
          else {
             if (col.nullable === false) line += " NOT NULL";
             if (col.default) line += ` DEFAULT ${col.default}`;
          }
          return line;
        }).join(",\n");
        
        const fks = table.columns.filter(c => c.isFK).map(col => 
          `  CONSTRAINT FK_${table.name}_${col.name} FOREIGN KEY (${col.name}) REFERENCES ${col.fkTable}(${col.name})`
        ).join(",\n");

        return `CREATE TABLE ${table.name} (\n${cols}${fks ? ",\n" + fks : ""}\n);`;
      }).join("\n\n");
    };

    const generateDML = () => {
      let script = "-- 1. 省略列名的插入方式 (注意：如果有自增主键，通常需指定列名，此处仅为作业演示)\n";
      script += `INSERT INTO Members VALUES ('Alice Green', 'F', '555-0101', '2023-01-15', 150.00);\n`;
      script += `INSERT INTO Members VALUES ('Bob Brown', 'M', '555-0102', '2023-02-20', 0.00);\n`;
      script += `INSERT INTO Members VALUES ('Charlie Black', 'M', '555-0103', '2023-03-10', 450.50);\n`;
      script += `INSERT INTO Members VALUES ('Diana White', 'F', '555-0104', '2023-04-05', 75.00);\n`;
      script += `INSERT INTO Members VALUES ('Evan Gray', 'M', '555-0105', '2023-05-12', 300.00);\n\n`;

      script += "-- 2. 不省略列名的插入方式 (标准工业级做法)\n";
      script += `INSERT INTO Trainers (TrainerName, Specialty, HourlyRate, HireDate)\nVALUES ('John Doe', 'Yoga', 80.00, '2022-01-01');\n`;
      script += `INSERT INTO Trainers (TrainerName, Specialty, HourlyRate, HireDate)\nVALUES ('Jane Smith', 'HIIT', 120.00, '2022-03-15');\n`;
      script += `INSERT INTO Trainers (TrainerName, Specialty, HourlyRate, HireDate)\nVALUES ('Mike Ross', 'Cardio', 90.00, '2022-06-20');\n`;
      script += `INSERT INTO Trainers (TrainerName, Specialty, HourlyRate, HireDate)\nVALUES ('Sarah Lee', 'Pilates', 110.00, '2022-08-10');\n`;
      script += `INSERT INTO Trainers (TrainerName, Specialty, HourlyRate, HireDate)\nVALUES ('Tom King', 'Strength', 100.00, '2022-11-05');\n`;
      
      return script;
    };

    const handleExplain = async (id: string, sql: string) => {
      loadingExpl.value = id;
      explanation.value = null;
      const text = await generateSqlExplanation(sql, "健身俱乐部数据库系统 (Fitness Club Database)");
      explanation.value = { id, text };
      loadingExpl.value = null;
    };

    const tabs = [
      { id: 'create', label: '3. 创建表 (Create)', icon: 'Database' },
      { id: 'insert', label: '3. 插入数据 (Insert)', icon: 'Database' },
      { id: 'query', label: '4. 查询操作 (Query)', icon: 'Play' },
      { id: 'views', label: '5. 视图 (Views)', icon: 'Eye' }
    ];

    return { 
      activeTab, 
      explanation, 
      loadingExpl, 
      tabs, 
      generateDDL, 
      generateDML, 
      handleExplain,
      REQUIRED_QUERIES,
      VIEW_DEFINITIONS
    };
  },
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Tabs -->
      <div class="flex space-x-1 border-b border-slate-200 pb-0 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all font-medium text-sm whitespace-nowrap border-t border-l border-r border-transparent relative top-[1px]"
          :class="activeTab === tab.id ? 'bg-white text-blue-600 border-slate-200 border-b-white' : 'bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="min-h-[500px] bg-white p-6 rounded-b-xl border border-slate-200 rounded-tr-xl shadow-sm">
        <div v-if="activeTab === 'create'" class="space-y-4">
           <div class="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
             <div class="text-blue-600 mt-1"><Database :size="20"/></div>
             <div>
               <h4 class="font-bold text-blue-800 text-sm">DDL 脚本生成</h4>
               <p class="text-blue-600 text-sm mt-1">
                 生成用于创建所有 5 个必需表（包含主键、外键和数据类型）的 SQL 命令。
               </p>
             </div>
           </div>
           <SqlCodeBlock :code="generateDDL()" label="SQL Server 建表脚本 (DDL)" />
        </div>

        <div v-if="activeTab === 'insert'" class="space-y-4">
           <div class="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex gap-3">
             <div class="text-emerald-600 mt-1"><Database :size="20"/></div>
             <div>
               <h4 class="font-bold text-emerald-800 text-sm">DML 数据录入</h4>
               <p class="text-emerald-600 text-sm mt-1">
                 包含 5 条省略列名的插入记录，以及 5 条指定列名的插入记录。
               </p>
             </div>
           </div>
           <SqlCodeBlock :code="generateDML()" label="SQL 插入数据脚本 (Insert)" />
        </div>

        <div v-if="activeTab === 'query'" class="grid gap-6">
          <div class="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3">
             <div class="text-indigo-600 mt-1"><Play :size="20"/></div>
             <div>
               <h4 class="font-bold text-indigo-800 text-sm">DQL 查询实验</h4>
               <p class="text-indigo-600 text-sm mt-1">
                 包含 10 个不同的查询，涵盖比较、逻辑运算、模糊查询、计算、多表连接、分组汇总、子查询等。
               </p>
             </div>
           </div>
          <div v-for="q in REQUIRED_QUERIES" :key="q.id" class="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 class="font-semibold text-slate-700">{{ q.title }}</h3>
              <span class="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">{{ q.category }}</span>
            </div>
            <div class="p-4">
              <p class="text-slate-600 text-sm mb-3">{{ q.description }}</p>
              <SqlCodeBlock :code="q.sql" class="mb-4" />
              
              <div class="flex justify-end">
                <button 
                  @click="handleExplain(q.id, q.sql)"
                  class="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
                  :disabled="loadingExpl === q.id"
                >
                  <Sparkles :size="12" />
                  {{ loadingExpl === q.id ? "智能分析中..." : "AI 代码解析" }}
                </button>
              </div>
              
              <div v-if="explanation && explanation.id === q.id" class="mt-4 p-4 bg-slate-50 border border-blue-100 rounded-lg text-sm text-slate-700 animate-fade-in relative">
                <div class="absolute -top-2 left-4 w-4 h-4 bg-slate-50 border-t border-l border-blue-100 transform rotate-45"></div>
                <strong class="text-blue-700 block mb-1">AI 助教解释:</strong> 
                {{ explanation.text }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'views'" class="space-y-6">
           <div class="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3">
             <div class="text-amber-600 mt-1"><Eye :size="20"/></div>
             <div>
               <h4 class="font-bold text-amber-800 text-sm">视图设计</h4>
               <p class="text-amber-600 text-sm mt-1">
                 虚拟表 (Views) 用于简化复杂的连接查询和报表访问。
               </p>
             </div>
           </div>
           <div v-for="v in VIEW_DEFINITIONS" :key="v.id" class="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 class="font-semibold text-slate-700">{{ v.title }}</h3>
              </div>
              <div class="p-4">
                <p class="text-slate-600 text-sm mb-3">{{ v.description }}</p>
                <SqlCodeBlock :code="v.sql" />
              </div>
           </div>
        </div>
      </div>
    </div>
  `
});
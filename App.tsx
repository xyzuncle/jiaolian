
import { defineComponent, ref } from 'vue';
import Layout from './components/Layout';
import SystemDesign from './views/SystemDesign';
import DatabaseDesign from './views/DatabaseDesign';
import FunctionalModule from './views/FunctionalModule';
import { ViewMode } from './types';

export default defineComponent({
  name: 'App',
  components: {
    Layout,
    SystemDesign,
    DatabaseDesign,
    FunctionalModule
  },
  setup() {
    const currentView = ref<string>(ViewMode.SYSTEM_DESIGN);

    const handleNavigate = (view: string) => {
      currentView.value = view;
    };

    const isFunctionalView = (view: string) => {
      return [
        ViewMode.MEMBER_MGT, 
        ViewMode.TRAINER_MGT, 
        ViewMode.COURSE_MGT, 
        ViewMode.COURSE_MOD
      ].includes(view as ViewMode);
    };

    return { currentView, handleNavigate, isFunctionalView, ViewMode };
  },
  template: `
    <Layout :currentView="currentView" @navigate="handleNavigate">
      <SystemDesign v-if="currentView === ViewMode.SYSTEM_DESIGN" />
      <DatabaseDesign v-else-if="currentView === ViewMode.DB_DESIGN" />
      <FunctionalModule 
        v-else-if="isFunctionalView(currentView)" 
        :mode="currentView" 
      />
    </Layout>
  `
});

import { App, createApp, h } from 'vue';
import CustomAlert from '../components/CustomAlert.vue';
import { vuetify } from '../vuetify';

const useAlert = (options: { title?: string; message: string }) => {
  return new Promise<void>((resolve) => {
    // Cria uma div para montar o alerta
    const alertContainer = document.createElement('div');
    document.body.appendChild(alertContainer);

    // Cria a instância do alerta com as opções fornecidas
    const app = createApp({
      render() {
        return h(CustomAlert, {
          title: options.title || 'Alert',
          message: options.message,
          onConfirm: () => {
            app.unmount(); // Desmonta o componente
            document.body.removeChild(alertContainer); // Remove o container
            resolve(); // Resolve a promise
          },
        });
      },
    });

    app.use(vuetify)

    app.mount(alertContainer); // Monta o componente no container
  });
};

// Exporta o plugin para uso global
export default {
  install(app: App) {
    app.config.globalProperties.$alert = useAlert;
  },
};

export { useAlert };

import store from '../store';
import router from '@/router';
import Swal from 'sweetalert2';
class Session {
    async expiredSession() {
        const time_day = new Date().getTime();
        const current_login = new Date(store.getters.usuario.hora_login);
        const current_login_sig = current_login;
        current_login_sig.setDate(current_login_sig.getDate() + 1);
        //2023-05-12:12:00:00
        if (time_day >= current_login_sig.getTime()) {
            this.clearDataStore();
            await Swal.fire({
                icon: 'info',
                title: 'Sesión expirada',
                text: 'Tú sesión expiró, vuelve a iniciar sesión',
                showConfirmButton: false,
                allowEscapeKey: false,
                allowOutsideClick: false,
                timer: 1770
            });
            router.push('/');
            return true;
        }
        return false;
    }

    clearDataStore() {
        store.commit('setusuario', { usuario: null, hora_login: null });
    }
}
export default new Session();
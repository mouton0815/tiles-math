import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  resolve: {
    preserveSymlinks: true // Otherwise, `npm link` does not work
  }
}

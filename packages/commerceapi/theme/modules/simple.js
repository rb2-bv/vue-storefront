export default function SimpleModule (moduleOptions) {
    const projectLocalThemeDir = this.options.buildDir.replace('.nuxt', '.theme');
    
    this.extendRoutes((routes, resolve) => {
        routes.unshift({
          name: 'default',
          path: '/:slug*',
          component: resolve(projectLocalThemeDir, 'pages/NotFound.vue')
        });
    });
    
}
  
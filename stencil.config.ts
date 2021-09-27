import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'nopaper-componentes',
  plugins: [
    sass(),
  ],
  outputTargets: [
    {
      type: 'dist',
      // esmLoaderPath: '../loader',
      copy: [
        { src: 'assets/', warn: true }
      ]
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ],
  // copy: [
  //   { src: '../node_modules/@mdi/font', dest: 'externals/@mdi/font' },
  //   { src: '../node_modules/bootstrap/dist', dest: 'externals/bootstrap/dist' },
  //   { src: '../node_modules/@betha-plataforma/theme-bootstrap4', dest: 'externals/@betha-plataforma/theme-bootstrap4' }
  // ],
  preamble: '(C) Betha Sistemas - Plataforma | https://plataforma.betha.cloud - MIT License'
};

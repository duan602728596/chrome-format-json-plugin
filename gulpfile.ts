import * as process from 'process';
import * as gulp from 'gulp';
import { Gulp } from "gulp";
import * as changed from 'gulp-changed';
import * as plumber from 'gulp-plumber';
import * as terser from 'gulp-terser';
import * as yaml from 'gulp-yaml';
import * as pug from 'gulp-pug';
import * as sass from 'gulp-sass';
import * as typescript from 'gulp-typescript';

const isDev: boolean = process.env.NODE_ENV === 'development';
const pathFile: {
  pug: string,
  sass: string,
  typescript: string,
  yaml: string,
  html: string,
  css: string,
  js: string,
  json: string,
  build: string
} = {
  pug: 'src/**/*.pug',
  sass: 'src/**/*.sass',
  typescript: 'src/**/*.ts',
  yaml: 'src/**/*.yml',
  html: 'build/**/*.html',
  css: 'build/**/*.css',
  js: 'build/**/*.js',
  json: 'build/**/*.json',
  build: 'build'
};
const typescriptConfig: {
  alwaysStrict: boolean,
  locale: string,
  target: string,
  newLine: string
} = {
  alwaysStrict: true,
  locale: 'zh-CN',
  target: 'ES2018',
  newLine: 'LF'
};

/* 开发环境编译 */
// pug
function devPugProject(): Gulp{
  return gulp.src(pathFile.pug)
    .pipe(changed(pathFile.html))
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(pathFile.build))
}

// sass
function devSassProject(): Gulp{
  return gulp.src(pathFile.sass)
    .pipe(changed(pathFile.css))
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compact' }).on('error', sass.logError))
    .pipe(gulp.dest(pathFile.build));
}

// typescript
function devTypescriptProject(): Gulp{
  const result = gulp.src(pathFile.typescript)
    .pipe(changed(pathFile.js))
    .pipe(plumber())
    .pipe(typescript(typescriptConfig));

  return result.js.pipe(gulp.dest(pathFile.build));
}

// yaml
function devYamlProject(): Gulp{
  return gulp.src(pathFile.yaml)
    .pipe(changed(pathFile.json))
    .pipe(plumber())
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest(pathFile.build));
}

// watch
function devWatch(): void{
  gulp.watch(pathFile.pug, devPugProject);
  gulp.watch(pathFile.sass, devSassProject);
  gulp.watch(pathFile.typescript, devTypescriptProject);
  gulp.watch(pathFile.yaml, devYamlProject);

  console.log('Start watching...');
}

/* 生产环境编译 */
// pug
function proPugProject(): Gulp{
  return gulp.src(pathFile.pug)
    .pipe(changed(pathFile.html))
    .pipe(pug())
    .pipe(gulp.dest(pathFile.build));
}

// sass
function proSassProject(): Gulp{
  return gulp.src(pathFile.sass)
    .pipe(changed(pathFile.css))
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(pathFile.build));
}

// typescript
function proTypescriptProject(): Gulp{
  const result = gulp.src(pathFile.typescript)
    .pipe(changed(pathFile.js))
    .pipe(typescript(typescriptConfig));

  return result.js
    .pipe(terser())
    .pipe(gulp.dest(pathFile.build));
}

// yaml
function proYamlProject(): Gulp{
  return gulp.src(pathFile.yaml)
    .pipe(changed(pathFile.json))
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest(pathFile.build));
}

export default isDev
  ? gulp.series(gulp.parallel(devPugProject, devSassProject, devTypescriptProject, devYamlProject), devWatch)
  : gulp.parallel(proPugProject, proSassProject, proTypescriptProject, proYamlProject);
import * as process from 'process';
import * as gulp from 'gulp';
import * as changed from 'gulp-changed';
import * as plumber from 'gulp-plumber';
import * as terser from 'gulp-terser';
import * as yaml from 'gulp-yaml';
import * as pug from 'gulp-pug';
import * as sass from 'gulp-sass';
import * as typescript from 'gulp-typescript';
import { ICompileStream } from 'gulp-typescript/release/project';
import { Stream } from 'stream';
import * as tsconfig from './tsconfig.json';

const isDev: boolean = process.env.NODE_ENV === 'development';
const pathFile: {
  pug: string,
  sass: string,
  typescript: string,
  yaml: string,
  dependencies: string,
  html: string,
  css: string,
  js: string,
  json: string,
  dependenciesFile: string,
  dependenciesBuild: string,
  build: string
} = {
  pug: 'src/**/*.pug',
  sass: 'src/**/*.sass',
  typescript: 'src/**/*.ts',
  yaml: 'src/**/*.yml',
  dependencies: 'src/dependencies/**/*.*',
  html: 'build/**/*.html',
  css: 'build/**/*.css',
  js: 'build/**/*.js',
  json: 'build/**/*.json',
  dependenciesFile: 'build/dependencies/**/*.*',
  dependenciesBuild: 'build/dependencies',
  build: 'build'
};

/* 开发环境编译 */
// pug
function devPugProject(): Stream{
  return gulp.src(pathFile.pug)
    .pipe(changed(pathFile.html))
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(pathFile.build))
}

// sass
function devSassProject(): Stream{
  return gulp.src(pathFile.sass)
    .pipe(changed(pathFile.css))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(pathFile.build));
}

// typescript
function devTypescriptProject(): Stream{
  const result: ICompileStream = gulp.src(pathFile.typescript)
    .pipe(changed(pathFile.js))
    .pipe(plumber())
    .pipe(typescript(tsconfig.compilerOptions));

  return result.js.pipe(gulp.dest(pathFile.build));
}

// yaml
function devYamlProject(): Stream{
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
function proPugProject(): Stream{
  return gulp.src(pathFile.pug)
    .pipe(pug())
    .pipe(gulp.dest(pathFile.build));
}

// sass
function proSassProject(): Stream{
  return gulp.src(pathFile.sass)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(pathFile.build));
}

// typescript
function proTypescriptProject(): Stream{
  const result: ICompileStream = gulp.src(pathFile.typescript)
    .pipe(typescript(tsconfig.compilerOptions));

  return result.js
    .pipe(terser())
    .pipe(gulp.dest(pathFile.build));
}

// yaml
function proYamlProject(): Stream{
  return gulp.src(pathFile.yaml)
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest(pathFile.build));
}

/* 拷贝文件 */
function copyDependencies(): Stream{
  return gulp.src(pathFile.dependencies)
    .pipe(changed(pathFile.dependenciesFile))
    .pipe(gulp.dest(pathFile.dependenciesBuild));
}

export default isDev
  ? gulp.series(gulp.parallel(devPugProject, devSassProject, devTypescriptProject, devYamlProject, copyDependencies), devWatch)
  : gulp.parallel(proPugProject, proSassProject, proTypescriptProject, proYamlProject, copyDependencies);
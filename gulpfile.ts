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
  pug: string;
  sass: string;
  typescript: string;
  image: string;
  yaml: string;
  dependencies: string;
  html: string;
  css: string;
  js: string;
  imageFile: string;
  json: string;
  dependenciesFile: string;
  build: string;
  pugBuild: string;
  sassBuild: string;
  typescriptBuild: string;
  imageBuild: string;
  dependenciesBuild: string;
} = {
  pug: 'src/template/**/*.pug',
  sass: 'src/style/**/*.sass',
  typescript: 'src/script/**/*.ts',
  image: 'src/image/**/*.*',
  yaml: 'src/**/*.yml',
  dependencies: 'src/dependencies/**/*.*',
  html: 'build/template/**/*.html',
  css: 'build/style/**/*.css',
  js: 'build/script/**/*.js',
  imageFile: 'build/script/**/*.*',
  json: 'build/**/*.json',
  dependenciesFile: 'build/dependencies/**/*.*',
  build: 'build',
  pugBuild: 'build/template',
  sassBuild: 'build/style',
  typescriptBuild: 'build/script',
  imageBuild: 'build/image',
  dependenciesBuild: 'build/dependencies'

};

/* 开发环境编译 */
// pug
function devPugProject(): Stream {
  return gulp.src(pathFile.pug)
    .pipe(changed(pathFile.html))
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(pathFile.pugBuild));
}

// sass
function devSassProject(): Stream {
  return gulp.src(pathFile.sass)
    .pipe(changed(pathFile.css))
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(pathFile.sassBuild));
}

// typescript
function devTypescriptProject(): Stream {
  const result: ICompileStream = gulp.src(pathFile.typescript)
    .pipe(changed(pathFile.js))
    .pipe(plumber())
    .pipe(typescript(tsconfig.compilerOptions));

  return result.js.pipe(gulp.dest(pathFile.typescriptBuild));
}

// yaml
function devYamlProject(): Stream {
  return gulp.src(pathFile.yaml)
    .pipe(changed(pathFile.json))
    .pipe(plumber())
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest(pathFile.build));
}

// watch
function devWatch(): void {
  gulp.watch(pathFile.pug, devPugProject);
  gulp.watch(pathFile.sass, devSassProject);
  gulp.watch(pathFile.typescript, devTypescriptProject);
  gulp.watch(pathFile.yaml, devYamlProject);

  console.log('Start watching...');
}

/* 生产环境编译 */
// pug
function proPugProject(): Stream {
  return gulp.src(pathFile.pug)
    .pipe(pug())
    .pipe(gulp.dest(pathFile.pugBuild));
}

// sass
function proSassProject(): Stream {
  return gulp.src(pathFile.sass)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(pathFile.sassBuild));
}

// typescript
function proTypescriptProject(): Stream {
  const result: ICompileStream = gulp.src(pathFile.typescript)
    .pipe(typescript(tsconfig.compilerOptions));

  return result.js
    .pipe(terser())
    .pipe(gulp.dest(pathFile.typescriptBuild));
}

// yaml
function proYamlProject(): Stream {
  return gulp.src(pathFile.yaml)
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest(pathFile.build));
}

/* 拷贝图片 */
function copyImage(): Stream {
  return gulp.src(pathFile.image)
    .pipe(changed(pathFile.imageFile))
    .pipe(gulp.dest(pathFile.imageBuild));
}

/* 拷贝依赖文件 */
function copyDependencies(): Stream {
  return gulp.src(pathFile.dependencies)
    .pipe(changed(pathFile.dependenciesFile))
    .pipe(gulp.dest(pathFile.dependenciesBuild));
}

export default isDev
  ? gulp.series(gulp.parallel(devPugProject, devSassProject, devTypescriptProject, devYamlProject, copyImage, copyDependencies), devWatch)
  : gulp.parallel(proPugProject, proSassProject, proTypescriptProject, proYamlProject, copyImage, copyDependencies);
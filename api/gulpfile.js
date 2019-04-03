'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

gulp.task('clean', () =>
  gulp.src('build', { read: false, allowEmpty: true }).pipe(
    clean({
      force: true,
    })
  )
);

gulp.task('transpile-src', () =>
  gulp
    .src(['src/**/*.js', '!src/**/__mocks__/**/*'])
    .pipe(babel())
    .pipe(gulp.dest('build/src'))
);

gulp.task('copy-config', () => gulp.src('src/config/*.json').pipe(gulp.dest('build/src/config')));

gulp.task('copy-node-config', () =>
  gulp.src(['package.json', 'package-lock.json']).pipe(gulp.dest('build'))
);

gulp.task('copy-public', () => gulp.src('public/**').pipe(gulp.dest('build/public')));

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('transpile-src', 'copy-config', 'copy-node-config', 'copy-public')
  )
);

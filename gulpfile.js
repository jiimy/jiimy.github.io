var gulp = require("gulp");

var sourcemaps = require("gulp-sourcemaps"),
  scss = require("gulp-sass"),
  livereload = require("gulp-livereload"),
  fileinclude = require('gulp-file-include');

/*
 * ==============================+
 * 경로들을 담을 객체 생성
 * ==============================+
*/
var src = "resume/src";
var dist = "resume/dist";
var paths = {
  //js : src + '/js/**/*.js',
  scss: src + "/sass/**/*.scss"
};

/*
 * ==============================+
 * @CSSS : HTML livereload 반영
 * ==============================+
*/
gulp.task('html', function () {
  return gulp
    /*
     * html 파일을 읽어오기 위해 경로 지정
    */
    .src('./**/*.html')

    /*
     * html파일을 읽어온 후 livereload 호출하여 브라우저에 반영
    */
    .pipe(livereload());
});


/*
 * ==============================+
 * @파일 인크루드
 * ==============================+
*/
gulp.task('fileinclude',function(){
  gulp.src(['./resume/src/index.html','./resume/src/sub/*.html'], {base : './'})
  .pipe(fileinclude({
    prefix:'@@',
    basePath:'@file'
  }))
  .pipe(gulp.dest('./'));
})




/*
 * ==============================+
 * @CSSS : SCSS Config(환경설정)
 * ==============================+
*/
var scssOptions = {
  /*
   * outputStyle (Type : String , Default : nested)
   * CSS의 컴파일 결과 코드스타일 지정
   * Values : nested ,expanded, compact, compressed
  */
  outputStyle: "expanded",

  /*
   * indentType (>= v3.0.0, Type : String, Default : space)
   * 컴파일된 CSS의 "들여쓰기"의 타입
   * Values : space, tab
  */
  indentType: "tab",

  /*
   * indentWidth (>= v3.0.0, Type : Integer , Default : 2) 
   * 컴파일 된 CSS의 "들여쓰기" 의 갯수 
  */
  indentWidth: 1, // outputStyle 이 nested, expanded 인 경우에 사용

  /*
   * precision (Type : Integer , Default : 5) 
   * 컴파일 된 CSS 의 소수점 자리수. 
   */
  precision: 2,

  /*
   * sourceComments (Type : Boolean , Default : false) 
   * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시. 
   */
  sourceComments: true
};

gulp.task("scss:compile", function () {
  return gulp
    // SCSS 파일을 읽어온다.
    .src(paths.scss)

    // 소스맵 초기화(소스맵을 생성)
    .pipe(sourcemaps.init())

    // SCSs 함수에 옵션값을 설정, sCSS 작성시 watch가 멈추지 않도록 logError를 설정
    .pipe(scss(scssOptions).on("error", scss.logError))

    // 위에서 생성한 소스맵을 사용한다.
    .pipe(sourcemaps.write())

    // 목적지(destination)을 설정
    .pipe(gulp.dest(dist + "/css"))

    /*
     * SCSS 컴파일을 수행한 후 livereload 호출하여 브라우저에 반영
     */
    .pipe(livereload());
});

gulp.task('live', ['html', 'scss:compile'], function () {
  // livereload.listen() 옵션값으로 기본경로를 지정
  livereload.listen(
    { basePath: dist }
  );
});

gulp.task("watch", function () {
  gulp.watch('./**/*.html', ['html']); // html task를 watch에 등록
  gulp.watch(paths.scss, ["scss:compile"]);
});

// gulp.task("default", ["scss:compile", "watch"]);
gulp.task("default", ["live", "watch"]);


//http://webclub.tistory.com/468
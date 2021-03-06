module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var globalConfig = {};

  grunt.initConfig({
    globalConfig: globalConfig,
    pages: {
      posts: {
        src: 'test/fixtures/posts/',
        dest: 'dev',
        layout: 'test/fixtures/ejs/layouts/post.ejs',
        url: 'blog/posts/:title',
        options: {
          formatPostUrl: function (urlSegment) {
            return urlSegment.replace(/[^a-zA-Z0-9]/g, '_');
          },
          pageSrc: 'test/fixtures/ejs/pages',
          templateEngine: 'ejs',
          data: 'test/fixtures/data/data.json'
        }
      },
      paginated: {
        src: 'test/fixtures/posts/',
        dest: 'dev',
        layout: 'test/fixtures/jade/layouts/post.jade',
        url: 'blog/posts/:title',
        options: {
          sortFunction: function (a, b) {
            return a.date - b.date;
          },
          data: {
            test: 1
          },
          pagination: {
            postsPerPage: 1,
            listPage: 'test/fixtures/jade/pages/blog/index.jade',
            url: 'list/:index/index.html'
          }
        }
      }
    },
    clean: ['dev'],
    copy: {
      styles: {
        files: [{
          expand: true,
          flatten: true,
          src: ['test/fixtures/styles/*'],
          dest: 'dev/styles/'
        }]
      }
    },
    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 10000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: {
        src: ['test/*.js']
      },
      spec: {
        src: ['test/<%= globalConfig.file %>.js']
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dev',
          keepalive: true
        }
      }
    },
    concurrent: {
      tasks: ['connect:server', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    watch: {
      options: {
        livereload: true
      },
      src: {
        files: ['tasks/*.js', 'test/fixtures/**'],
        tasks: ['jshint', 'build']
      },
      tests: {
        files: ['test/*.js']
      }
    },
    jshint: {
      options: {
        camelcase: true,
        bitwise: true,
        indent: 2,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        quotmark: 'single',
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        trailing: true,
        eqnull: true,
        node: true,
        expr: true,
        evil: true,
        globals: {
          describe: true,
          it: true,
          before: true
        }
      },
      files: {
        src:  ['*.js', 'test/*.js', 'tasks/*.js']
      }
    }
  });

  grunt.loadTasks('./tasks');
  grunt.registerTask('build', ['clean', 'copy', 'pages:paginated']);
  grunt.registerTask('test', ['clean', 'jshint', 'simplemocha:all']);
  grunt.registerTask('default', ['concurrent']);

  grunt.registerTask('spec', 'Runs a task on a specified file', function (fileName) {
    globalConfig.file = fileName;
    grunt.task.run('simplemocha:spec');
  });
};

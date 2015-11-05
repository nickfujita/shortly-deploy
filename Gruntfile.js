module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    env : {
      dev : {
        NODE_ENV : 'development'
      },
      prod : {
        NODE_ENV : 'production'
      }
    },

    concat: {
      lib: {
        src: [
          'public/lib/underscore.js', 'public/lib/jquery.js', 'public/lib/backbone.js', 'public/lib/handlebars.js'
        ],
        dest: 'public/dist/buildLib.js'
      },
      client: {
        src: ['/public/client/*.js'],
        dest: 'public/dist/buildClient.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {

      build: {
        files: {
          'public/deploy/buildLib.min.js': ['public/dist/buildLib.js'],
          'public/deploy/buildClient.min.js': ['public/dist/buildClient.js']
        }
      }

    },

    jshint: {
      files: [
        'Gruntfile.js','server.js','server-config.js','app/**/*.js','public/client/*.js','test/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      
      build: {
        src: 'public/style.css',
        dest: 'public/deploy/style.min.css'
      }

    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push azure master'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('server-dev', function (target) {
    
    grunt.task.run([ 'env:dev' ]);

    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  grunt.registerTask('server-prod', [
    'shell', 'env:prod'
  ]);

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint','mochaTest'
  ]);

  grunt.registerTask('build', [
    'concat', 'uglify', 'cssmin'
  ]);


  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['server-prod']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      'test', 'build', 'upload'
  ]);


};

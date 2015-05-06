// Generated by CoffeeScript 1.9.2
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  module.exports = function(BasePlugin) {
    var NodesassPlugin, TaskGroup, bourbon, fs, neat, sass;
    fs = require('fs');
    TaskGroup = require('taskgroup').TaskGroup;
    sass = require('node-sass');
    bourbon = require('node-bourbon').includePaths;
    neat = require('node-neat').includePaths;
    return NodesassPlugin = (function(superClass) {
      extend(NodesassPlugin, superClass);

      function NodesassPlugin() {
        return NodesassPlugin.__super__.constructor.apply(this, arguments);
      }

      NodesassPlugin.prototype.name = 'nodesass';

      NodesassPlugin.prototype.config = {
        bourbon: false,
        debugInfo: false,
        neat: false,
        renderUnderscoreStylesheets: false,
        sourceMap: false
      };

      NodesassPlugin.prototype.generateBefore = function(opts, next) {
        var config, tasks;
        config = this.config;
        tasks = new TaskGroup().setConfig({
          concurrency: 0
        }).once('complete', next);
        return tasks.run();
      };

      NodesassPlugin.prototype.extendCollections = function(opts) {
        var config, docpad;
        config = this.config;
        docpad = this.docpad;
        if (config.renderUnderscoreStylesheets === false) {
          this.underscoreStylesheets = docpad.getDatabase().findAllLive({
            filename: /^_(.*?)\.(?:scss|sass)/
          });
          return this.underscoreStylesheets.on('add', function(model) {
            return model.set({
              render: false,
              write: false
            });
          });
        }
      };

      NodesassPlugin.prototype.render = function(opts, next) {
        var cmdOpts, config, css, file, fullDirPath, getSourcesContent, inExtension, j, k, len, len1, outExtension, path, paths, prop, result, sourceMap;
        config = this.config;
        paths = [];
        inExtension = opts.inExtension, outExtension = opts.outExtension, file = opts.file;
        if ((inExtension === 'sass' || inExtension === 'scss') && (outExtension === 'css' || outExtension === null)) {
          fullDirPath = file.get('fullDirPath');
          getSourcesContent = function(sources) {
            var i, source, sourcesContent;
            sourcesContent = [];
            i = 0;
            while (i < sources.length) {
              source = fullDirPath + '/' + sources[i];
              sourcesContent[i] = fs.readFileSync(source, {
                encoding: 'utf8'
              });
              i++;
            }
            return sourcesContent;
          };
          cmdOpts = {};
          for (prop in config.options) {
            cmdOpts[prop] = config.options[prop];
          }
          if (fullDirPath) {
            paths.push(fullDirPath);
            if (config.bourbon) {
              for (j = 0, len = bourbon.length; j < len; j++) {
                path = bourbon[j];
                paths.push(path);
              }
            }
            if (config.neat) {
              for (k = 0, len1 = neat.length; k < len1; k++) {
                path = neat[k];
                paths.push(path);
              }
            }
          }
          cmdOpts.includePaths = cmdOpts.includePaths ? cmdOpts.includePaths.concat(paths) : paths;
          if (config.debugInfo && config.debugInfo !== 'none') {
            cmdOpts.sourceComments = config.debugInfo;
            cmdOpts.file = file.attributes.fullPath;
          } else {
            cmdOpts.data = opts.content;
          }
          result = sass.renderSync(cmdOpts);
          css = result.css;
          if (result.map && result.map.sources) {
            console.log(result.map);
            map.sourcesContent = getSourcesContent(map.sources);
            sourceMap = new Buffer(JSON.stringify(map)).toString('base64');
            css = css.replace(/\/\*# sourceMappingURL=.*\*\//, '/*# sourceMappingURL=data:application/json;base64,' + sourceMap + '*/');
          }
          opts.content = css;
          return next();
        } else {
          return next();
        }
      };

      return NodesassPlugin;

    })(BasePlugin);
  };

}).call(this);

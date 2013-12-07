// Generated by CoffeeScript 1.6.3
(function() {
  var Fretboard, FretboardCanvas, chord_notes, full_c, get_full_chord, main, trans;

  full_c = [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

  trans = {
    "C": 0,
    "C#": 1,
    "Db": 1,
    "D": 2,
    "D#": 3,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "Gb": 6,
    "G": 7,
    "G#": 8,
    "Ab": 8,
    "A": 9,
    "A#": 10,
    "Bb": 10,
    "B": 11
  };

  chord_notes = {
    "maj": [0, 4, 7],
    "maj7": [0, 4, 7, 11],
    "min": [0, 3, 7]
  };

  get_full_chord = function(note, chord) {
    var a, cns, concatenated, full_chords, n, tcn, tcns, tn;
    tn = trans[note];
    cns = chord_notes[chord];
    tcns = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = cns.length; _i < _len; _i++) {
        n = cns[_i];
        _results.push((n + tn) % 12);
      }
      return _results;
    })();
    full_chords = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = full_c.length; _i < _len; _i++) {
        n = full_c[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = tcns.length; _j < _len1; _j++) {
            tcn = tcns[_j];
            _results1.push(n + tcn);
          }
          return _results1;
        })());
      }
      return _results;
    })();
    a = new Array;
    concatenated = full_chords.concat.apply(a, full_chords);
    return concatenated;
  };

  FretboardCanvas = (function() {
    function FretboardCanvas(fretboard) {
      var fretwidth, wherex;
      this.fretboard = fretboard;
      this.canvas = document.createElement("canvas");
      window.canvas = this.canvas;
      this.canvas.width = this.width = document.body.clientWidth;
      this.canvas.height = this.height = document.body.clientHeight;
      this.ctx = this.canvas.getContext("2d");
      this.fretwidth = this.width / 8;
      this.border = this.fretwidth / 2;
      this.maxx = this.width - this.border;
      this.maxy = this.height - this.border;
      this.num_strings = this.fretboard.length;
      this.xs = [];
      this.ratio = 1 / Math.pow(2, 1 / 12);
      fretwidth = this.fretwidth;
      wherex = this.maxx;
      while (wherex > 0) {
        this.xs.push(wherex);
        wherex = wherex - fretwidth;
        fretwidth = fretwidth * this.ratio;
      }
    }

    FretboardCanvas.prototype.draw_fretboard = function() {
      var x, _i, _len, _ref;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "red";
      _ref = this.xs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        x = _ref[_i];
        this.ctx.moveTo(x, this.border);
        this.ctx.lineTo(x, this.height - this.border);
      }
      return this.ctx.stroke();
    };

    FretboardCanvas.prototype.draw_strings = function() {
      var wherey;
      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.apart = (this.height - this.border * 2) / this.num_strings;
      this.gutter = this.border + this.apart / 2;
      wherey = this.gutter;
      while (wherey < this.height) {
        this.ctx.moveTo(0, wherey);
        this.ctx.lineTo(this.maxx, wherey);
        wherey += this.apart;
      }
      return this.ctx.stroke();
    };

    FretboardCanvas.prototype.draw_notes = function() {
      var centery, diff, pos, radius, string, _i, _j, _len, _len1, _ref;
      this.ctx.strokeStyle = "blue";
      radius = this.border / 2;
      centery = this.gutter;
      _ref = this.fretboard;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        string = _ref[_i];
        for (_j = 0, _len1 = string.length; _j < _len1; _j++) {
          pos = string[_j];
          this.ctx.beginPath();
          if (pos === 0) {
            diff = this.border / 2;
          } else {
            diff = Math.pow(this.ratio, pos) * this.fretwidth / 2;
          }
          this.ctx.arc(this.xs[pos] + diff, centery, radius, 0, 2 * Math.PI);
          this.ctx.fillStyle = 'green';
          this.ctx.fill();
          this.ctx.stroke();
        }
        centery += this.apart;
      }
      return console.log("notes!");
    };

    FretboardCanvas.prototype.draw = function() {
      this.draw_fretboard();
      this.draw_strings();
      return this.draw_notes();
    };

    return FretboardCanvas;

  })();

  Fretboard = (function() {
    function Fretboard(strings) {
      this.strings = strings;
    }

    Fretboard.prototype.get = function(note, chord) {
      /*
      Returns the full fretboard, string by string.
      So, a C major on the ukelele would be:
      [
        [0, 5, 9, 12, ...]  # G string (7)
        [0, 4, 7, 12, ...]  # C string (0)
        [0, 3, 8, 12, ...]  # E string (4)
        [0, 3, 7, 12, ...]  # A string (9)
      ]
      */

      var full_chord, n, ret, s, sret, _i, _j, _len, _ref;
      full_chord = get_full_chord(note, chord);
      ret = [];
      _ref = this.strings;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        sret = [];
        for (n = _j = 0; _j <= 17; n = ++_j) {
          if (full_chord.indexOf(s + n) > -1) {
            sret.push(n);
          }
        }
        ret.push(sret);
      }
      return ret;
    };

    return Fretboard;

  })();

  main = function() {
    var fb, fbc, strings;
    strings = [67, 60, 64, 69];
    fb = new Fretboard(strings);
    fbc = new FretboardCanvas(fb.get("F", "maj"));
    fbc = new FretboardCanvas(fb.get("G", "maj"));
    document.body.appendChild(fbc.canvas);
    fbc.canvas.className = "full";
    return fbc.draw();
  };

  window.onload = main;

}).call(this);

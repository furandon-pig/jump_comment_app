var vm = new Vue({
  el: '#app',
  data: {
    w1: null,
    w2: null,
    h1: null,
    h2: null,
    author_img_url: null,
    author_img: null,
    diary_img: null,
    diary_ctx: null,
    text_ctx: null,
    img: null,
    name: null,
    text: null,
    author_img_pos: {
      'x': 0,
      'y': 0,
      'wmax': 0,
      'hmax': 0,
    },
    name_pos: {
      'x': 0,
      'y': 0,
      'size': 20,
    },
    text_pos: {
      'x': 0,
      'y': 0,
      'size': 10,
      'gap': 3,
    }
  },
  created: function() {
    this.w1 = 768;
    this.h1 = 1568;
    this.w2 = ~~(this.w1 / 2)
    this.h2 = ~~(this.h1 / 2);

    this.author_img_pos.x = 0;
    this.author_img_pos.x = 0;

    this.author_img_url = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Bouillon_de_volaille.jpg';
    this.name = 'ブ イ ヨ ン';
    this.text = "こんにちは！ブイヨンです！\n\n澄んだスープを作る完璧な手順を\n\n考えながら執筆しています！\n\n応援よろしくね！";
  },
  mounted: function() {
    this.diary_ctx = document.getElementById('diary').getContext("2d");
    this.text_ctx = document.getElementById('text_canvas').getContext("2d");

    this.diary_img = new Image();
    this.diary_img.src = "template.png";
    this.diary_img.onload = function() {
      vm.diary_ctx.drawImage(vm.diary_img, 0, 0, vm.w1, vm.h1, 0, 0, vm.w2, vm.h2);
    }

    this.author_img_pos.x = 150;
    this.author_img_pos.y = 220;

    this.name_pos.x = 115;
    this.name_pos.y = 325;
    this.name_pos.size = 30;

    this.text_pos.x = 105;
    this.text_pos.y = 360;
    this.text_pos.size = 20;
    this.text_pos.gap = 3;

    this.download_img();
  },
  methods: {
    update: function() {
      this.diary_ctx.drawImage(
        this.diary_img,
        0, 0,
        this.w1, this.h1,
        0, 0,
        this.w2, this.h2
      );

      this.update_img();
      this.update_name();
      this.update_text();
    },
    download_img: function() {
      if (this.author_img_url == null) { return; }

      this.author_img = new Image();

      this.author_img.src = this.author_img_url;
      this.author_img.onerror = function() {
        alert(`エラー：指定されたURLの画像を取得できませんでした(T_T)\n${vm.author_img_url}`);
        vm.author_img = null;
      };
      this.author_img.onload = function() {
        // update_img()の値を参照。
        vm.author_img_pos.wmax = vm.author_img.width - 262;
        vm.author_img_pos.hmax = vm.author_img.height - 261;
        setTimeout(function() {
          vm.update();
        }, 500);
      };
    },
    update_img: function() {
      if (this.author_img != null) {
        // author_img.onloadで262,261の値を参照している。
        this.diary_ctx.drawImage(
          this.author_img,
          this.author_img_pos.x,
          this.author_img_pos.y,
          262, 261, 62, 25, 262, 261
        );
      }
    },
    update_name: function() {
      if (this.name == null) { return; }

      this.diary_ctx.font = "bold " + this.name_pos.size + "px 'ＭＳ ゴシック'";
      this.diary_ctx.fillText(this.name, this.name_pos.x, this.name_pos.y);
    },
    update_text: function() {
      if (this.text == null) { return; }

      this.text_ctx.font = "bold " + this.text_pos.size + "px 'ＭＳ ゴシック'";
      this.text_ctx.fillStyle = "rgb(255, 255, 255";
      this.text_ctx.fillRect(0, 0, 600, 600);

      this.text_ctx.fillStyle = "rgb(0, 0, 0";
      this.text_ctx.font = "bold " + this.text_pos.size + "px 'ＭＳ ゴシック'";

      let v = this.text_ctx.measureText(this.text);

      let render_info = this.parse_text();
      var vx = render_info.cw;
      for (var x = (render_info.vstr.length - 1); 0 <= x; x--) {
        var vy = render_info.cw;
        for (var y in render_info.vstr[x]) {
          for (var z in render_info.vstr[x][y]) {
            this.text_ctx.fillText(render_info.vstr[x][y][z], vx, vy);
            vy += render_info.cw;
          }
        }
        vx += render_info.cw;
      }

      let vtext = document.getElementById('text_canvas');
      let vw = vx;
      let vh = 420;

      this.diary_ctx.drawImage(vtext, 0, 0, vw, vh, this.text_pos.x, this.text_pos.y, vw, vh);

      if (this.author_img != null) {
        this.diary_ctx.drawImage(
          this.author_img,
          this.author_img_pos.x, this.author_img_pos.y,
          262, 261,
          62, 25,
          262, 261
        );
      }
    },
    parse_text: function() {
      let w = this.text_ctx.measureText(this.text).width;
      let str = this.text.split('\n');
      var max = 0;

      var vstr = [];
      for (var i in str) {
        if (max < str[i].length) {
          max = str[i].length;
        }

        if (vstr[i] == undefined) {
          vstr[i] = [];
        }
        vstr[i].push(str[i].split(''));
      }

      obj = {
        'max': max,
        'cw': 20,
        'vstr': vstr
      }

      return obj;
    },
    download_image: function() {
      var link = document.createElement("a");
      let image = document.getElementById('diary');
      try {
        if (image.msToBlob) {
          blob = image.msToBlob();
          window.navigator.msSaveBlob(blob, 'jump_comment.png');
        } else {
          link.href = image.toDataURL("image/png");
          link.download = "jump_comment.png";
          link.click();
        }
      } catch(e) {
        console.log(e);
        alert('(T_T) ダウンロード時にエラーが発生しました。');
      }
    },
  }
})


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

class Token {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.width = 70;
        this.height = 70;
        this.num = 0;
        this.isOut = 0;
    };
    draw(context) {
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.font = "30px serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.strokeText(this.num, this.x + this.width / 2, this.y + this.height / 2, this.width);
    };
};

class Tokens {
    constructor() {
        this.TOKEN_NUM = 8;
        this.xs =   [140, 210, 280, 350, 280, 210, 140,  70];
        this.ys =   [210, 210, 210, 140,  70,  70,  70, 140];
        this.outs = [  0,   0,   0,   1,   0,    0,   0,  1];
        this.tokens = Array(this.TOKEN_NUM);
        for (let i = 0; i < this.TOKEN_NUM; i++) {
            this.tokens[i] = new Token();
            this.tokens[i].x = this.xs[i];
            this.tokens[i].y = this.ys[i];
            this.tokens[i].isOut = this.outs[i];
            if (this.tokens[i].isOut === 0) {
                this.tokens[i].num = 3;
            }
            else {
                this.tokens[i].num = 0;
            }
        }
    };
    update(numString) {
        let nums = numString.split(',');
        let sumNum = 0;
        console.log(numString);
        console.log(nums);
        for (let i = 0; i < nums.length; i++) {
            this.tokens[i].num = parseInt(nums[i], 10);
            sumNum += this.tokens[i].num;
        }
        if (sumNum != 18 || nums.length != 8) {
            alert('Sorry Server Error!');
        }
    };
    move(pos) {
        if (!(pos >= 0 && pos <= 2) || this.tokens[pos].num == 0) {
            alert('Invalid Move');
            return false;
        }
        let rem = this.tokens[pos].num;
        for (let i = pos + 1; i < pos + 1 + rem; i++) {
            this.tokens[i % this.TOKEN_NUM].num += 1;
        }
        this.tokens[pos].num = 0;
        if (pos + rem == 3 || pos + rem == 7) {
            alert('Your turn again / Move(' + pos + ')');
            return false;
        }
        return true;
    };
    draw(context) {
        context.strokeText("Mancala", 490 / 2, 35, 490);
        for (let i = 0; i < this.TOKEN_NUM; i++) {
            this.tokens[i].draw(context);
        }
    };
    getStr() {
        let ret = "";
        for (let i = 0; i < this.TOKEN_NUM; i++) {
            ret += this.tokens[i].num;
            if (i != this.TOKEN_NUM - 1) {
                ret += ",";
            }
        }
        return ret;
    }
    judge() {
        if (this.tokens[0].num == 0 && this.tokens[1].num == 0 && this.tokens[2].num == 0) {
            return 'You Win!';
        }
        if (this.tokens[4].num == 0 && this.tokens[5].num == 0 && this.tokens[6].num == 0) {
            return 'You Lose!';
        }
        return 'None';
    }
    reset() {
        for (let i = 0; i < this.TOKEN_NUM; i++) {
            if (this.tokens[i].isOut === 0) {
                this.tokens[i].num = 3;
            }
            else {
                this.tokens[i].num = 0;
            }
        }
    }
};

var tokens = new Tokens();
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tokens.draw(ctx);
}
function judge() {
    ret = tokens.judge();
    if (ret !== 'None') {
        alert(ret);
        tokens.reset();
    }
}
setInterval(draw, 10);
setInterval(judge, 10);

var reqAjax = function(query) {
    console.log(query);
    $.ajax({
        url: 'https://pj5k8nk5ma.execute-api.us-east-1.amazonaws.com/default/test?state=' + query,
        type: 'POST',
        dataType: 'text',
        timeout: 5000,
    }).done(function(data) {
        tokens.update(data);
        alert("Enemy turn end");
        // alert(data);
        // $('#done').html("enemy turn end");
    }).fail(function(data) {
        // $('#error').html("失敗");
        alert('Server Error\n' + data);
    }).always(function(data) {
        // $('#complete').html("Ajax終了時に呼ばれるメソッド");
    })
};
var moveLeft = function() {
    if (tokens.move(0)) reqAjax(tokens.getStr() + ",1");
};
var moveMid = function() {
    if (tokens.move(1)) reqAjax(tokens.getStr() + ",1");
};
var moveRight = function() {
    if (tokens.move(2)) reqAjax(tokens.getStr() + ",1");
};
var reset = function() {
    tokens.reset();
}

$(function() {
    $('#button-left').click(moveLeft);
    $('#button-mid').click(moveMid);
    $('#button-right').click(moveRight);
    $('#button-reset').click(reset);
});

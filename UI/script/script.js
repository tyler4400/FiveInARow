/**
 * Created by Tyler on 2018/12/26 18:23.
 */
(function ($, defaultSettings){
    let _this = this;

    this.settings = defaultSettings;
    this.instance = null;
    this.board = null;
    this.ctx = null;

    /*region Game API*/
    function Instance(){
        let _this = this;
        let data = {};
        _this.getData = function (){
            return data;
        };
        _this.setData = function (val = {}){
            data = val;
        }
    }
    /**
     * 初始化棋盘
     */
    function initGameBoard(){
        let size = _this.settings.margin * 2 + (_this.settings.size - 1) * _this.settings.cellSize;
        _this.board.width = size;
        _this.board.height = size;
        _this.ctx = board.getContext('2d');
        ctx.strokeStyle = '#BFBFBF';

        let logo = new Image();
        logo.src = _this.settings.logo;
        logo.onload = function (){
            //画背景logo
            let w = logo.width;
            let h = logo.height;
            _this.ctx.drawImage(logo, size - w - _this.settings.margin, size - h - _this.settings.margin, w, h);
            //画栅格
            for(let i = 0; i < _this.settings.size; i++){
                _this.ctx.moveTo(_this.settings.margin + i * _this.settings.cellSize, _this.settings.margin);
                _this.ctx.lineTo(_this.settings.margin + i * _this.settings.cellSize, size - _this.settings.margin);
                _this.ctx.stroke();
                _this.ctx.moveTo(_this.settings.margin, _this.settings.margin + i * _this.settings.cellSize);
                _this.ctx.lineTo(size - _this.settings.margin, _this.settings.margin + i * _this.settings.cellSize);
                _this.ctx.stroke();
            }
        };


    }

    /**
     * 更新棋子
     */
    function updatePawn(){

    }

    /**
     * 绘制棋子
     */
    function drawPawn(role, x, y){


    }

    /**
     * 保存进度
     */
    let saveProgress = function(){
        if(!window.localStorage){
            console.warn("浏览器不支持本地存储,存储进度失败");
            saveProgress = loadProgress = function (){
                return false;
            };
            return false;
        }
        if(!_this.instance){
            console.warn('保存失败！');
            return;
        }
        let data = JSON.stringify(_this.instance.getData());
        localStorage.setItem('chessSave', data);

    };

    /**
     * 加载进度
     */
    let loadProgress = function(){
        if(!window.localStorage){
            console.warn("浏览器不支持本地存储,加载进度失败");
            saveProgress = loadProgress = function (){
                return false;
            };
            return false;
        }
        let temp = localStorage.getItem('chessSave');
        if(temp === '' || temp === '{}') return false;
        let data = JSON.parse(temp);
        if($.isEmptyObject(data)) return false;
        let instance = new Instance();
        instance.setData(data);
        return instance;
    };

    /**
     * 删除进度
     */
    function deleteProgress(){

    }

    /**
     * 更新游戏状态，判断输赢
     */
    function updateGameStatus(){

    }

    /**
     * 更新游戏数据
     */
    function updateInstace(){

    }

    /**
     * 重新开始游戏
     */
    function newGame(){

    }

    /**
     * 游戏结束
     */
    function endGame(){

    }
    /*endregion*/

    init();


    /**
     * 游戏初始化
     */
    function init(){
        //0. 获取canvas，判断是否支持canvas
        _this.board = document.getElementById(_this.settings.canvas);
        if(!_this.board.getContext) {
            alert('您的浏览器不支持canvas！！');
            return;
        }

        //1. 获取设置，覆盖默认设置
        let dataSettings = $(_this.board).attr('data-settings');
        dataSettings = dataSettings ? $.parseJSON(dataSettings) : {};
        $.extend(_this.settings, dataSettings);
        console.log(_this.settings);

        //2. 获取存档，如果有,加载存档，没有，初始instance
        _this.instance = loadProgress();
        if(!_this.instance) _this.instance = new Instance();

        //3. 画棋盘
        initGameBoard();

        //4. 画棋子
        updatePawn();

        //5. 更新游戏状态
        updateGameStatus();
    }
})(jQuery, {
    canvas: 'chess',
    margin: 15,
    logo: 'img/PingAn.png',
    size: 15,
    cellSize: 30
});

/**
 * Created by Tyler on 2018/12/26 18:23.
 */
(function ($, defaultSettings){
    let _this = this;

    this.settings = defaultSettings;
    this.instance = null;
    this.board = null;
    this.ctx = null;

    /*region <Game API>*/
    function Instance(){
        let data = {};
        data.role = _this.settings.role; //该谁出手了
        data.pawns = [];//记录二维棋盘的棋子，0为空，-1为黑，0为白
        for(let i = 0; i < _this.settings.size; i++){
            data.pawns[i] = [];
            for(let j = 0; j < _this.settings.size; j++){
                data.pawns[i][j] = 0;
            }
        }
        data.playedTime = 0;

        this.getData = function (){
            return data;
        };
        this.setData = function (val = {}){
            data = val;
        }
    }
    /**
     * 初始化棋盘
     */
    function initGameBoard(func){
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
            //
            // if(typeof(func) === 'Function')
                func();
        };


    }

    /**
     * 绘制棋子
     * @param role true: 黑色， false：白色
     * @param x 棋盘坐标
     * @param y 棋盘坐标
     */
    function drawPawn(role = 0, x, y){
        if(role === 0) return;
        _this.ctx.beginPath();
        _this.ctx.arc(_this.settings.margin + _this.settings.cellSize * x, _this.settings.margin + _this.settings.cellSize * y, 13, 0, 2 * Math.PI);
        _this.ctx.closePath();
        let gradient = _this.ctx.createRadialGradient(_this.settings.margin + _this.settings.cellSize * x + 2,
            _this.settings.margin + _this.settings.cellSize * y - 2, 13,
            _this.settings.margin + _this.settings.cellSize * x + 2, _this.settings.margin + _this.settings.cellSize * y - 2, 0);
        if(role < 0) {
            gradient.addColorStop(0, '#0A0A0A');
            gradient.addColorStop(1, '#636766');
        }else{
            gradient.addColorStop(0, '#D1D1D1');
            gradient.addColorStop(1, '#F9F9F9');
        }
        _this.ctx.fillStyle = gradient;
        _this.ctx.fill();


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
     * 判断输赢
     */
    function updateGameStatus(){
    }

    /**
     * 更新游戏，包括ui，状态，
     * @param x
     * @param y
     */
    function updateGame(x, y){
        let data = _this.instance.getData();
        if(data.pawns[x][y] === 0){
            drawPawn(data.role, x, y);
            data.pawns[x][y] = data.role;
            data.role *= -1;
            _this.instance.setData(data);
        }
        saveProgress();
        updateGameStatus();
    }

    /**
     * ai的回合
     */
    function takeTurnByAI(){

    }

    /**
     * 重新开始游戏
     */
    function newGame(){

    }

    /**
     * 开始游戏
     */
    function startGame(){

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

        //2. 画棋盘
        initGameBoard(function (){
            //3. 获取存档，如果有,加载存档，没有，初始instance
            _this.instance = loadProgress();
            if(!!_this.instance && confirm('是否继续之前的进度？')){
                //4. 加载存档
                let data = _this.instance.getData();
                for(let i = 0; i < _this.settings.size; i++){
                    for(let j = 0; j < _this.settings.size; j++){
                        drawPawn(data.pawns[i][j], i, j);
                    }
                }
            }else{
                _this.instance = new Instance();
            }
        });


        //5. 棋盘绑定点击事件
        $(_this.board).on('click', function (e){
            //将点击坐标转化棋盘坐标
            let clickX = e.offsetX;
            let clickY = e.offsetY;
            let x = Math.floor((clickX - _this.settings.margin + _this.settings.cellSize / 2) / _this.settings.cellSize);
            let y = Math.floor((clickY - _this.settings.margin + _this.settings.cellSize / 2) / _this.settings.cellSize);
            console.log(x + ':' + y);

            //更新棋盘
            updateGame(x, y);
            //AI的回合
            takeTurnByAI();
        });

        //6, 游戏开始
        startGame();
    }
})(jQuery, {
    canvas: 'chess',//canvas dom
    margin: 15, // 边距
    logo: 'img/PingAn.png',//logo的src
    size: 15, //栅格数量，
    cellSize: 30,//每一个格子大小
    role: -1 //-1为黑色先手
});

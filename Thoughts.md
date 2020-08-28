#### 架构

+ **MVC**
  + Model：游戏数据 放在主逻辑中
  + Controller：游戏主逻辑-JS/JQuery (main.js)
  + View：UI-HTML/CSS (index.html+2048.css)
  + 使用JS/JQuery控制动画效果逻辑 (showmotion2048.js)
  + 使用JS写支持逻辑 (support2048.js)



#### 数据

+ `board[][]`存放棋盘格每个格子里的数字的值，用于渲染对应的board view
+ `score`用于存放分数
+ `hasConflicted[][]`存放棋盘格每个格子是否发生了碰撞。在一次移动中，若已经发生了碰撞，则不能再发生碰撞
+ `startx`,`starty`,`endx`,`endy`触控坐标



#### 主逻辑

+ `$(document).ready()`初始化页面，调用`prepareForMobile()`兼容移动端，`newgame()`初始化游戏

+ `newgame() `初始化游戏，调用`init()`初始化4*4的棋盘格子，调用两次`generateOneNumber()`生成两个随机2/4的数字格
+ `$(document).keydown()`用于响应玩家的上下左右操作。调用`moveLeft()`(right, up,down)更新board（落脚位置为空/落脚位置=待判断位置&中间没有障碍物调用`noBlockHorizontal(row, col1, col2, board)`），调用`            updateScore(score)`更新分数，调用`setTimeout("updateBoardView()", 200)`更新board view
+ `isgameover()`调用`nospace(board)`和` nomove(board)`判断是否结束
+ `updateBoardView()`根据board状态渲染数字格
+ `generateOneNumber()`在棋盘格上随机生成一个2/4的数字格，位置也是随机的



####支持逻辑

+ `getNumberBackgroundColor(number)`根据传入数字，返回对应数字格的颜色
+ `getNumberColor(number)`根据传入数字，返回对应数字的颜色
+ `nospace(board)`根据传入的board状态，返回是否还有移动空间（=0）
+ `getPosTop(i, j)`根据传入坐标，返回坐标的top值
+ `getPosLeft(i, j)`根据传入坐标，返回坐标的left值
+ `canMoveLeft(board)`（right，up，down）根据传入的board状态，返回是否可以向左移动（左侧有=0的格子或左侧有与右侧相等的格子）
+ `noBlockHorizontal(row, col1, col2, board)`根据传入行坐标，开始列坐标和结束列坐标，以及board状态，返回在行坐标上，从开始列到结束列是否有数字格
+ `noBlockVertical(row1, row2, col, board)`同理
+ `nomove(board)`根据board状态，判断是否还能移动
+ `updateScore(score)`根据传入的分数，渲染分数的值



#### 动画效果

+ `showNumberWithAnimation(i, j, randNumber)`通过传入的坐标和数字，动态渲染数字
+ `showMoveAnimation(fromx, fromy, tox, toy)`通过传入的from坐标和to坐标，移动数字格



#### 支持移动端（自适应）

+ viewport元信息

  ```html
  <meta
        name="viewport"
        content="width=device-width,height=device-height,initial-scale=1.0,minimum-scale=1.0,user-scalable=no"
      />
  ```

+ CSS

  + header `width：100%；`

+ JS

  + 通过`documentWidth = window.screen.availWidth;`获取屏幕宽度
  + 通过使用百分比确定格子的大小



#### 支持移动端（触控操作）

+ 监听`touchstart`和`touchend`事件，获得坐标，判断滑动方向，执行对应更新

```javascript
document.addEventListener("touchstart", function (event) {
  startx = event.touches[0].pageX;
  starty = event.touches[0].pageY;
});
document.addEventListener("touchend", function (event) {
  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;

  let deltax = endx - startx;
  let deltay = endy - starty;

  if (
    Math.abs(deltax) < 0.3 * documentWidth &&
    Math.abs(deltay) < 0.3 * documentWidth
  )
    return;
  if (Math.abs(deltax) > Math.abs(deltay)) {
    if (deltax > 0) {
      if (moveRight()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      if (moveLeft()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  } else {
    if (deltay > 0) {
      if (moveDown()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    } else {
      if (moveUp()) {
        setTimeout("generateOneNumber()", 210);
        setTimeout("isgameover()", 300);
      }
    }
  }
});
```


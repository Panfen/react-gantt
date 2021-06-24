import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Input, Button } from 'antd';
import './App.css';
 
export default function Step({ text, color }) {

  const totalWidth = 700;
  const totalStep = 10;

  const stepNums = new Array(totalStep + 1).fill(0).map((item, index) => index * (totalWidth / totalStep)); 

  const [style, setStyle] = useState({
    left: 0,
    top: 20,
    width: 140,
    background: color
  });

  // 初始数据， 因为不需要重新render 所以用 useRef
  const oriPos = useRef({
    top: 0, // 元素的坐标
    left: 0,
    width: 140,
    cX: 0, // 鼠标的坐标
    cY: 0
  });

  const isDown = useRef(false);

  const direction = useRef('move');

  /**
   * 鼠标被按下，保存数据：方向，是否按下，鼠标坐标
   */ 
  function onMouseDown(dir, e) {
     // 阻止事件冒泡
    e.stopPropagation();
    direction.current = dir
    isDown.current = true;
    // 鼠标坐标
    const cY = e.clientY; // clientX 相对于可视化区域
    const cX = e.clientX;
    oriPos.current = {
      ...style,
      cX, cY
    }
  }

  /**
   * 鼠标移动
   */ 
  function onMouseMove(e) {
    // 判断鼠标是否按住
    if (!isDown.current) return;
    const newStyle = transform(direction, oriPos, e);
    setStyle(newStyle);
  }

  /**
   * 变形：移动，拉伸
   */ 
  function transform(direction, oriPos, e) {
    const style = { ...oriPos.current }
    const offsetX = e.clientX - oriPos.current.cX;
    switch(direction.current) {
      // 拖拽移动
      case 'move':
        const left = oriPos.current.left + offsetX;
        style.left = borderCheck(left, style.width);
        break;
      // 左侧拉伸
      case 'left':
      	style.left += offsetX;
      	if (style.left >= 0) {
      		style.width -= offsetX;
      	} else {
      		style.left = 0;
      		style.width = oriPos.current.width + oriPos.current.left
      	}
        
        break;
      // 右侧拉伸
      case 'right':
        style.width += offsetX;
        if (style.left + style.width >= stepNums[stepNums.length - 1]) {
        	style.width = stepNums[stepNums.length - 1] - style.left;
        };
        break;
      default:
        break;
    }
    return style;
  }


  /**
   * 边界判断，返回新的left位置
   */ 
  function borderCheck(left, width) {
    let newLeft = left <= 0 ? 0 : left;
    newLeft = newLeft + width >= stepNums[stepNums.length - 1] ? stepNums[stepNums.length - 1] - width : newLeft;
    return newLeft;
  }

  /**
   * 鼠标被抬起
   */ 
  function onMouseUp(e) {
    if (!isDown.current) return;
    // 拖拽移动判断左边界落在哪个区间范围，确定位置
    if (direction.current === 'move') {
      const left = oriPos.current.left + (e.clientX - oriPos.current.cX);
      // left 有可能是负值
      const leftIndex = stepNums.findIndex((item, index) => left >= item && left < stepNums[index+1]);
      let newLeft = left - stepNums[leftIndex] > stepNums[leftIndex+1] - left ? stepNums[leftIndex+1] : stepNums[leftIndex];
      newLeft = borderCheck(newLeft || 0, style.width);
      setStyle({
        ...style,
        top: 20,
        left: newLeft,
      });
    }
    // 右侧拉伸判断右边界落在哪个范围，确定宽度
    if (direction.current === 'right') {
      const right = style.left + style.width;
      const rightIndex = stepNums.findIndex((item, index) => right >= item && right < stepNums[index+1]);
      if (rightIndex === -1) {
      	return;
      }
      let newWidth = right - stepNums[rightIndex] > stepNums[rightIndex+1] - right ? stepNums[rightIndex+1] - style.left : stepNums[rightIndex] - style.left;
      setStyle({
        ...style,
        top: 20,
        width: newWidth,
      });
    }
    // 左侧拉伸判断左边界在哪个范围，确定宽度
    if (direction.current === 'left') {
      const leftIndex = stepNums.findIndex((item, index) => style.left >= item && style.left < stepNums[index+1]);
      if (leftIndex === -1) {
      	return;
      }
      const newLeft = style.left - stepNums[leftIndex] > stepNums[leftIndex+1] - style.left ? stepNums[leftIndex+1] : stepNums[leftIndex];
      let newWidth = style.left - stepNums[leftIndex] > stepNums[leftIndex+1] - style.left ? style.width - (stepNums[leftIndex+1] - style.left) : style.width + (style.left - stepNums[leftIndex]);
      setStyle({
        ...style,
        top: 20,
        left: newLeft,
        width: newWidth,
      });
    }
    
    isDown.current = false;
  }
    
  return <div className="step-wrap">
	  <div className="step" 
	  	onMouseDown={onMouseDown.bind(this, 'move')} 
	  	onMouseMove={onMouseMove} 
	  	onMouseUp={onMouseUp} 
	  	onMouseLeave={onMouseUp} 
	  	style={style}
	  >
	    <div className="left" onMouseDown={onMouseDown.bind(this, 'left')} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}></div>
	    <div className="right" onMouseDown={onMouseDown.bind(this, 'right')} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}></div>
	    {text}
	  </div>
	</div>
}

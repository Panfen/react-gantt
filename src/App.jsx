import React, { useState, useCallback, useRef } from 'react';
import { Input, Button } from 'antd';
import Step from './Step';
import './App.css';
 
export default function App() {
  // step 列表
  const [steps, setSteps] = useState([]);
  // 单个step信息
  const [step, setStep] = useState({});

  const onInputChange = (type, value) => {
    console.log(type, value)
    setStep({
      ...step,
      [type]: value
    })
  }

  function onAddStep() {
    setSteps(pre => ([...steps, {color: '#b8eaf6', ...step}]));
  }
    
  return <div className="gantt-container">
    {console.log(steps)}
    <div className="add-wrap">
      <Input className="step-text" onChange={e => onInputChange('text', e.target.value)} />
      <Input defaultValue="#b8eaf6" type="color" className="step-color" onChange={e => onInputChange('color', e.target.value )} />
      <Button type="primary" onClick={onAddStep.bind(this)}>添加</Button>
    </div>
    <div className="gantt-box">
      {steps.map((step, index) => <Step key={index} text={step.text} color={step.color} />)}
    </div>
  </div>
}

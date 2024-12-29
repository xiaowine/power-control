import{d as t,o as e,c as a,w as l,T as s,a as n,b as o,t as u,r as i,e as r,f as c,g as d,m as v,h as p,i as g,j as m,n as f,k as E,u as C,F as V,l as y,p as b,q as O,s as k}from"./vendor-cboEby5r.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const a of t)if("childList"===a.type)for(const t of a.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();const w={class:"dialog-header"},R={class:"dialog-content"},T={key:0,class:"dialog-footer"},_=t({__name:"Dialog",props:{modelValue:{type:Boolean,default:!1},title:{default:"提示"},closeOnClickOverlay:{type:Boolean,default:!0},content:{default:void 0},footer:{default:void 0}},emits:["update:modelValue"],setup(t,{emit:d}){const v=d,p=()=>{v("update:modelValue",!1)};let g=null;const m=t=>{g={x:t.clientX,y:t.clientY}},f=t=>{if(g){const e=document.querySelector(".dialog-container"),a=null==e?void 0:e.getBoundingClientRect();if(a){const e=g.x>=a.left&&g.x<=a.right&&g.y>=a.top&&g.y<=a.bottom,l=t.clientX>=a.left&&t.clientX<=a.right&&t.clientY>=a.top&&t.clientY<=a.bottom;e||l||p()}}g=null};return(t,d)=>(e(),a(s,{name:"dialog-fade"},{default:l((()=>[t.modelValue?(e(),n("div",{key:0,class:"dialog-overlay",onMousedown:m,onMouseup:f},[o("div",{class:"dialog-container",onClick:d[1]||(d[1]=r((()=>{}),["stop"]))},[o("div",w,[o("h3",null,u(t.title),1),o("button",{class:"close-btn",onClick:p},"×")]),o("div",R,[(e(),a(i(t.content),{onClick:d[0]||(d[0]=r((()=>{}),["stop"]))}))]),t.footer?(e(),n("div",T,[(e(),a(i(t.footer)))])):c("",!0)])],32)):c("",!0)])),_:1}))}});function h(t){const{title:e="提示",content:a={},closeOnClickOverlay:l=!0,footer:s=null,onClose:n=()=>{},onOpen:o=()=>{},className:u=""}=t,i=document.createElement("div");u&&i.classList.add(u),document.body.appendChild(i);const r={visible:d(!0),title:d(e),content:d(v(a))},c=()=>{f.unmount(),i.remove(),n(),r.currentDialog=void 0},f=p({setup:()=>(g((()=>o())),()=>m(_,{modelValue:r.visible.value??!1,"onUpdate:modelValue":t=>{r.visible.value=t,t||c()},title:r.title.value??"",closeOnClickOverlay:l,class:u,content:r.content.value,footer:s}))});f.mount(i);const E={close:()=>{r.visible.value=!1,c()},updateContent:t=>{r.content.value=t},updateTitle:t=>{r.title.value=t}};return r.currentDialog=E,E}function U(t,e={}){const a=h({title:"警告",content:{setup:()=>()=>m("h3",{class:"data-detail"},t)},footer:{setup:()=>()=>m("div",{class:"dialog-footer"},[m("button",{onClick:()=>a.close(),style:{backgroundColor:"var(--error-color)",color:"white"}},"确定")])},className:"alert-dialog",...e});return a}const D=(t,e,a)=>{const l=h({title:t,content:{setup:()=>()=>m("div",{class:"dialog-content"},[m("p",null,e)])},footer:{setup:()=>()=>m("div",{class:"dialog-footer"},[m("button",{onClick:()=>l.close(),class:"cancel-btn"},"取消"),m("button",{onClick:()=>{a(),l.close()},class:"confirm-btn"},"确定")])}})},M=(t,e)=>t.toFixed(e).padStart(5,"0"),I=t=>{let e=0;for(let a=0;a<4;a++)e+=t[a];return e&=65535,e},N=t=>({FunctionCode:t[1]<<8|t[0],Value:t[3]<<8|t[2],CheckValue:t[5]<<8|t[4]}),A=(t,e)=>"efficiency"===t||"power"===t?e.toFixed(1):M(e,2);var S=(t=>(t[t.EN=0]="EN",t[t.VREF=1]="VREF",t[t.IREF=2]="IREF",t[t.OUT_MODE=3]="OUT_MODE",t[t.CLEAR_ERROR=4]="CLEAR_ERROR",t))(S||{}),x=(t=>(t[t.VIN=0]="VIN",t[t.IIN=1]="IIN",t[t.VOUT=2]="VOUT",t[t.IOUT=3]="IOUT",t[t.RUN_ERROR_TYPE=4]="RUN_ERROR_TYPE",t[t.RUN_MODE=5]="RUN_MODE",t[t.OUT_MODE=6]="OUT_MODE",t[t.EN=7]="EN",t[t.TargetV=8]="TargetV",t[t.TargetI=9]="TargetI",t))(x||{});const L=4096,F=.025458984375,$=3.3/1269.76,P=L/104.28,B=1269.76/3.3,H={class:"section status-section"},Y={class:"port-config"},X={class:"connection-status"},q={class:"input-parameters"},W={class:"card-grid"},j={class:"card"},G={class:"value-container"},K={class:"value-display"},z={class:"value-display value-animation",ref:"inputVoltageAnimation"},J={class:"card"},Q={class:"value-container"},Z={class:"value-display"},tt={class:"value-display value-animation",ref:"inputCurrentAnimation"},et=t({__name:"Device",props:{inputVoltage:{},inputCurrent:{}},setup(t,{expose:a,emit:l}){const s=l,i=d(24),r=d(5),c=d(),v=d(!1);let p,g=[],m=0;const V=async()=>{"serial"in navigator?v.value?await b():await y():U("浏览器不支持串口通信")},y=async()=>{try{c.value=await navigator.serial.requestPort(),await c.value.open({baudRate:115200}),v.value=!0,O()}catch(t){U("未选择设备或者串口连接失败"),await b()}},b=async()=>{try{p&&(await p.cancel(),p.releaseLock()),c.value&&await c.value.close()}catch(t){}finally{c.value=void 0,v.value=!1,clearTimeout(m),g=[]}},O=async()=>{var t;if((null==(t=c.value)?void 0:t.readable)&&(p=c.value.readable.getReader(),p))try{for(;v.value;){const{value:t,done:e}=await p.read();if(e)break;t&&(g.push(...Array.from(t)),0===m&&(m=window.setTimeout(k,50)))}}catch(e){U("数据读取错误，连接已断开"),b()}finally{null==p||p.releaseLock()}},k=()=>{var t;if(clearTimeout(m),m=0,6===g.length){const e=new Uint8Array(g),a=N(e);if(I(e)!==a.CheckValue)return void(g=[]);const l=a.Value,n={[x.VIN]:()=>{s("updateInputVoltageEvent",l*F)},[x.IIN]:()=>{s("updateInputCurrentEvent",l*$)},[x.VOUT]:()=>{s("updateOutputVoltageEvent",l*F)},[x.IOUT]:()=>{s("updateOutputCurrentEvent",l*$)},[x.RUN_ERROR_TYPE]:()=>{s("updateRunErrorTypeEvent",l)},[x.RUN_MODE]:()=>{s("updateRunModeEvent",l)},[x.OUT_MODE]:()=>{s("updateOutModeEvent",l)},[x.EN]:()=>{s("updateEnEvent",l)},[x.TargetV]:()=>{s("updateTargetVEvent",l*F)},[x.TargetI]:()=>{s("updateTargetIEvent",l*$)}};null==(t=n[a.FunctionCode])||t.call(n),s("addDataHistoryEvent",e,"received")}g=[]};return a({disconnectDevice:b,sendData:(t,e,a="未知")=>{var l;if(!(null==(l=c.value)?void 0:l.writable))return U("请先连接设备"),!1;const s=c.value.writable.getWriter();return s.write(t),s.releaseLock(),!0}}),(t,a)=>(e(),n("div",H,[a[6]||(a[6]=o("h3",null,"设备状态",-1)),o("div",Y,[o("div",X,[o("i",{class:f(["status-icon",{connected:v.value}])},null,2),o("span",null,u(void 0===c.value?"未连接":"已连接"),1)]),o("button",{class:"connect-btn",onClick:V},u(v.value?"断开连接":"选择设备"),1)]),o("div",q,[o("div",W,[o("div",j,[a[2]||(a[2]=o("span",{class:"output-label"},"电压",-1)),o("div",G,[o("span",K,[E(u(C(M)(t.inputVoltage,2))+" ",1),a[0]||(a[0]=o("small",null,"V",-1))]),o("span",z,[E(u(C(M)(i.value,2))+" ",1),a[1]||(a[1]=o("small",null,"V",-1))],512)])]),o("div",J,[a[5]||(a[5]=o("span",{class:"output-label"},"电流",-1)),o("div",Q,[o("span",Z,[E(u(C(M)(t.inputCurrent,2))+" ",1),a[3]||(a[3]=o("small",null,"A",-1))]),o("span",tt,[E(u(C(M)(r.value,2))+" ",1),a[4]||(a[4]=o("small",null,"A",-1))],512)])])])])]))}}),at={class:"section output-section"},lt={class:"card-grid"},st={class:"card"},nt={class:"value-container"},ot={class:"value-display"},ut={class:"card"},it={class:"value-container"},rt={class:"value-display"},ct={class:"card"},dt={class:"value-container"},vt={class:"value-display"},pt={class:"card"},gt={class:"value-container"},mt={class:"value-display"},ft=t({__name:"Output",props:{inputVoltage:{},inputCurrent:{},outputVoltage:{},outputCurrent:{}},setup(t,{expose:a}){const l=d(24),s=d(5),i=d(0),r=d(0),c=d(),v=d(),p=t,g=()=>{r.value=p.outputVoltage*p.outputCurrent;const t=p.inputVoltage*p.inputCurrent;t>0&&(i.value=Math.min(r.value/t*100,100))},m=t=>{const e="voltage"===t?c:v;(null==e?void 0:e.value)&&(e.value.classList.remove("fade-in"),e.value.offsetWidth,e.value.classList.add("fade-in"))};return a({updateOutputVoltage:t=>{const e=l;e.value!==t&&(e.value=t,g(),m("voltage"))},updateOutputCurrent:t=>{const e=s;e.value!==t&&(e.value=t,g(),m("current"))}}),(t,a)=>(e(),n("div",at,[a[10]||(a[10]=o("h3",null,"输出参数",-1)),o("div",lt,[o("div",st,[a[2]||(a[2]=o("span",{class:"output-label"},"电压",-1)),o("div",nt,[o("span",ot,[E(u(C(M)(t.outputVoltage,2))+" ",1),a[0]||(a[0]=o("small",null,"V",-1))]),o("span",{class:"value-display value-animation",ref_key:"voltageAnimation",ref:c},[E(u(C(M)(l.value,2))+" ",1),a[1]||(a[1]=o("small",null,"V",-1))],512)])]),o("div",ut,[a[5]||(a[5]=o("span",{class:"output-label"},"电流",-1)),o("div",it,[o("span",rt,[E(u(C(M)(t.outputCurrent,2))+" ",1),a[3]||(a[3]=o("small",null,"A",-1))]),o("span",{class:"value-display value-animation",ref_key:"currentAnimation",ref:v},[E(u(C(M)(s.value,2))+" ",1),a[4]||(a[4]=o("small",null,"A",-1))],512)])]),o("div",ct,[a[7]||(a[7]=o("span",{class:"output-label"},"效率",-1)),o("div",dt,[o("span",vt,[E(u(C(A)("efficiency",i.value))+" ",1),a[6]||(a[6]=o("small",null,"%",-1))])])]),o("div",pt,[a[9]||(a[9]=o("span",{class:"output-label"},"功耗",-1)),o("div",gt,[o("span",mt,[E(u(C(A)("power",r.value))+" ",1),a[8]||(a[8]=o("small",null,"W",-1))])])])])]))}}),Et={class:"section target-settings"},Ct={class:"target-controls"},Vt={class:"target-group"},yt={class:"target-value"},bt={class:"target-value"},Ot={class:"control-group"},kt={class:"power-controls"},wt={class:"mode-controls"},Rt=t({__name:"TargetSet",props:{workStatus:{},outMode:{},targetVoltage:{},targetCurrent:{}},setup(t,{emit:a}){const l=t,s=a,i=t=>{t?D("电源开关",`确定要${t?"开启":"关闭"}电源吗？`,(()=>{l.workStatus&&t||s("sendDataEvent",S.EN,!l.workStatus)})):s("sendDataEvent",S.EN,0)},r=t=>{D("切换模式",`确定要切换到${0===t?"CV":"CC"}模式吗？`,(()=>{l.outMode!==t&&s("sendDataEvent",S.OUT_MODE,l.outMode)}))},c=t=>{const e="voltage"===t,a=d(e?l.targetVoltage:l.targetCurrent),n=M(a.value,2),o=e?80:5,u=e?"V":"A",i=d(!0),r=h({title:"设置"+(e?"电压":"电流"),content:{setup:()=>()=>m("div",{class:"dialog-input-container"},[m("input",{type:"number",value:n,class:"dialog-input",placeholder:`请输入${e?"电压":"电流"}值`,onInput:t=>{const e=t.target.value,l=parseFloat(e);a.value=l}}),m("span",{class:"dialog-unit"},u)])},footer:{setup:()=>()=>m("div",{class:"dialog-footer"},[m("button",{onClick:()=>r.close(),class:"cancel-btn"},"取消"),m("button",{onClick:()=>{i.value?a.value>o||a.value<0?alert(`请输入有效的${e?"电压":"电流"}值！`):i.value=!1:(e?s("sendDataEvent",S.VREF,a.value*P):s("sendDataEvent",S.IREF,a.value*B),r.close())},class:"confirm-btn"},i.value?"检查":"确定")])}})};return(t,a)=>(e(),n("div",Et,[a[9]||(a[9]=o("h3",null,"目标设定",-1)),o("div",Ct,[o("div",Vt,[o("div",{class:"target-card",onClick:a[0]||(a[0]=t=>c("voltage"))},[o("div",yt,u(C(M)(t.targetVoltage,2))+"V",1),a[6]||(a[6]=o("div",{class:"target-label"},"设置电压",-1))]),o("div",{class:"target-card",onClick:a[1]||(a[1]=t=>c("current"))},[o("div",bt,u(C(M)(t.targetCurrent,2))+"A",1),a[7]||(a[7]=o("div",{class:"target-label"},"设置电流",-1))])]),o("div",Ot,[o("div",kt,[o("button",{class:f(["power-btn",{active:t.workStatus}]),onClick:a[2]||(a[2]=t=>i(1))},a[8]||(a[8]=[o("img",{src:"data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20t='1733847952494'%20class='icon'%20viewBox='0%200%201024%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20p-id='4318'%20data-darkreader-inline-fill=''%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='256'%20height='256'%3e%3cpath%20d='M561.312102%2068.191078l-98.624205%200%200%20493.121024%2098.624205%200L561.312102%2068.191078zM799.735283%20174.951591l-69.77618%2069.77618c77.420277%2063.36619%20127.225613%20159.27761%20127.225613%20267.271206%200%20190.590779-154.592914%20345.184717-345.184717%20345.184717S166.815283%20702.590779%20166.815283%20512c0-107.993596%2049.805336-203.905016%20127.225613-267.271206l-69.77618-69.77618C129.0911%20256.316713%2068.191078%20376.884696%2068.191078%20512c0%20245.080811%20198.72811%20443.808922%20443.808922%20443.808922s443.808922-198.72811%20443.808922-443.808922C955.808922%20376.884696%20894.907876%20256.316713%20799.735283%20174.951591z'%20p-id='4319'%3e%3c/path%3e%3c/svg%3e",alt:"power",class:"power-icon"},null,-1),E(" 开机 ")]),2),o("button",{class:"power-btn off",onClick:a[3]||(a[3]=t=>i(0))},"关机")]),o("div",wt,[o("button",{class:f({active:!t.outMode}),onClick:a[4]||(a[4]=t=>r(0))},"CV",2),o("button",{class:f({active:t.outMode}),onClick:a[5]||(a[5]=t=>r(1))},"CC",2)])])])]))}}),Tt={class:"section power-status"},_t={class:"status-tabs"},ht={class:"status-tab"},Ut={class:"status-options"},Dt={class:"status-tab"},Mt={class:"status-options"},It={class:"status-options error-options"},Nt=t({__name:"PowerStatus",props:{runMode:{},faultType:{},workStatus:{}},setup(t,{emit:a}){const l=a,s=["未工作","工作中"],i=["BUCK","BOOST","MIXED"],r=new Map([[1,"输入欠压"],[2,"输入过压"],[3,"输出欠压"],[4,"输出过压"],[5,"输入过流"],[6,"输出过流"],[7,"输出短路"],[8,"温度过高"],[0,"正常"]]),c=()=>{D("消除故障","确定要消除故障吗？",(()=>{l("sendDataEvent",S.CLEAR_ERROR,0)}))};return(t,a)=>(e(),n("div",Tt,[a[3]||(a[3]=o("h3",null,"电源状态",-1)),o("div",_t,[o("div",ht,[a[0]||(a[0]=o("div",{class:"status-label"},"工作状态",-1)),o("div",Ut,[(e(),n(V,null,y(s,(e=>o("span",{key:e,class:f(["status-option",{active:t.workStatus===s.indexOf(e)}])},u(e),3))),64))])]),o("div",Dt,[a[1]||(a[1]=o("div",{class:"status-label"},"工作模式",-1)),o("div",Mt,[(e(),n(V,null,y(i,(e=>o("span",{key:e,class:f(["status-option",{active:t.runMode===i.indexOf(e)}])},u(e),3))),64))])]),o("div",{class:"status-tab",onClick:c},[a[2]||(a[2]=o("div",{class:"status-label"},"故障类型",-1)),o("div",It,[(e(!0),n(V,null,y(Array.from(C(r).values()),((a,l)=>(e(),n("span",{key:l,class:f(["status-option",{active:a===C(r).get(t.faultType)}])},u(a),3)))),128))])])])]))}}),At={class:"section"},St={class:"info-container"},xt={class:"info"},Lt=["onClick"],Ft={class:"type"},$t={class:"message"},Pt=t({__name:"Historical",props:{dataHistory:{}},setup(t,{emit:a}){const l=a;function s(t,e){try{const a=new Uint8Array(t.split(" ").map((t=>parseInt(t,16)))),l=N(a),s={[S.VREF]:`设置电压: ${M(l.Value*P,2)} V`,[S.IREF]:`设置电流: ${M(l.Value*B,2)} A`,[S.EN]:""+(l.Value?"开机":"关机"),[S.OUT_MODE]:"设置模式: "+(l.Value?"CC":"CV"),[S.CLEAR_ERROR]:"清楚故障"},n={[x.VIN]:`输入电压: ${M(l.Value*F,2)} V`,[x.IIN]:`输入电流: ${M(l.Value*$,2)} A`,[x.VOUT]:`输出电压: ${M(l.Value*F,2)} V`,[x.IOUT]:`输出电流: ${M(l.Value*$,2)} A`,[x.RUN_ERROR_TYPE]:"错误类型: ",[x.RUN_MODE]:"运行模式:"+(2==l.Value?"MIX":l.Value?"BOOST":"BUCK"),[x.OUT_MODE]:"输出模式: "+(l.Value?"CC":"CV"),[x.EN]:"工作状态: "+(l.Value?"工作中":"未工作"),[x.TargetV]:`设定电压: ${M(l.Value*F,2)}`,[x.TargetI]:`设定电流: ${M(l.Value*$,2)}`};return e?s[l.FunctionCode]:n[l.FunctionCode]}catch(a){return"数据解析错误"}}const i=()=>{l("clearDataHistoryEvent")};return(t,a)=>(e(),n("div",At,[a[0]||(a[0]=o("h3",null,"发送/接收数据",-1)),o("div",St,[o("ul",xt,[(e(!0),n(V,null,y(t.dataHistory,((t,a)=>(e(),n("li",{key:a,class:f([t.type,"clickable"]),onClick:e=>(t=>{const e=h({title:"数据详情",content:{setup:()=>()=>m("div",{class:"data-detail"},[m("div",{class:"detail-item"},[m("span",{class:"detail-label"},"类型:"),m("span",{class:"detail-value"},"sent"===t.type?"发送":"接收")]),m("div",{class:"detail-item"},[m("span",{class:"detail-label"},"时间:"),m("span",{class:"detail-value"},t.timestamp)]),m("div",{class:"detail-item"},[m("span",{class:"detail-label"},"数据:"),m("span",{class:"detail-value"},t.message)]),m("div",{class:"detail-item"},[m("span",{class:"detail-label"},"解释:"),m("span",{class:"detail-value"},s(t.message,"sent"===t.type))])])},footer:{setup:()=>()=>m("button",{onClick:()=>e.close()},"关闭")}})})(t)},[o("span",Ft,u("sent"===t.type?"发送":"接收")+":",1),o("span",$t,u(t.message),1)],10,Lt)))),128))]),o("button",{class:"clear-btn",onClick:i,title:"清除历史记录"})])]))}}),Bt={class:"section about"};const Ht=((t,e)=>{const a=t.__vccOpts||t;for(const[l,s]of e)a[l]=s;return a})({},[["render",function(t,a){return e(),n("div",Bt,a[0]||(a[0]=[b('<div class="avatar-container"><div class="avatar-image"></div></div><a href="https://github.com/xiaowine" target="_blank"><div class="github-icon"></div></a><div class="author-name">xiao_wine</div>',3)]))}]]),Yt={class:"power-control-system"};p(t({__name:"App",setup(t){const a=d(),l=d(),s=d(24),o=d(5),u=d(24),i=d(5),r=d(20),c=d(4),v=d(0),p=d(0),m=d(0),f=d(0),E=d([]);g((()=>{})),O((()=>{a.value.disconnectDevice()}));const C=()=>{E.value=[]},V=(t,e)=>{const l=new Uint8Array([255&t,t>>8&255,255&e,e>>8&255,0,0]),s=I(l);l[4]=255&s,l[5]=s>>8&255,a.value.sendData(l,e)&&y(l,"sent")},y=(t,e="received")=>{const a=Array.from(t).map((t=>t.toString(16).padStart(2,"0"))).join(" "),l=(new Date).toLocaleString();E.value.length>=100&&E.value.pop(),E.value.unshift({message:a,type:e,timestamp:l})},b=t=>{u.value=t,l.value.updateOutputVoltage(t)},w=t=>{i.value=t,l.value.updateOutputCurrent(t)},R=t=>{s.value=t},T=t=>{o.value=t},_=t=>{f.value=t},h=t=>{p.value=t},U=t=>{m.value=t},D=t=>{v.value=t},M=t=>{r.value=t},N=t=>{c.value=t};return(t,d)=>(e(),n("div",Yt,[k(et,{ref_key:"device",ref:a,inputCurrent:o.value,inputVoltage:s.value,onUpdateOutputVoltageEvent:b,onUpdateOutputCurrentEvent:w,onUpdateInputVoltageEvent:R,onUpdateInputCurrentEvent:T,onAddDataHistoryEvent:y,onUpdateRunErrorTypeEvent:_,onUpdateRunModeEvent:h,onUpdateOutModeEvent:U,onUpdateEnEvent:D,onUpdateTargetVEvent:M,onUpdateTargetIEvent:N},null,8,["inputCurrent","inputVoltage"]),k(ft,{ref_key:"output",ref:l,inputCurrent:o.value,inputVoltage:s.value,outputVoltage:u.value,outputCurrent:i.value},null,8,["inputCurrent","inputVoltage","outputVoltage","outputCurrent"]),k(Rt,{outMode:m.value,workStatus:v.value,onSendDataEvent:V,targetVoltage:r.value,targetCurrent:c.value},null,8,["outMode","workStatus","targetVoltage","targetCurrent"]),k(Nt,{workStatus:v.value,runMode:p.value,outMode:m.value,faultType:f.value,onSendDataEvent:V},null,8,["workStatus","runMode","outMode","faultType"]),k(Pt,{dataHistory:E.value,onClearDataHistoryEvent:C},null,8,["dataHistory"]),k(Ht)]))}})).mount("#app");

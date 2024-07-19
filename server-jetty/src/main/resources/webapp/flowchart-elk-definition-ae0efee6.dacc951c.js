var n=globalThis,t=n.parcelRequire3bab,e=t.register;e("4jHLn",function(n,e){Object.defineProperty(n.exports,"diagram",{get:()=>S,set:void 0,enumerable:!0,configurable:!0});var i=t("gZQEu"),r=t("2YFJl"),a=t("hl1Sc"),c=t("4jcZX"),o=t("aOnO8");t("eJNXH"),t("gngdn"),t("2ujND"),t("i8Fxz");let u=(n,t,e)=>{let{parentById:i}=e,r=new Set,a=n;for(;a;){if(r.add(a),a===t)return a;a=i[a]}for(a=t;a;){if(r.has(a))return a;a=i[a]}return"root"},s=new(o&&o.__esModule?o.default:o),h={},f={},l={},b=async function(n,t,e,i,r,o,u){let s=e.select(`[id="${t}"]`).insert("g").attr("class","nodes"),h=Object.keys(n);return await Promise.all(h.map(async function(t){let e,u;let h=n[t],f="default";h.classes.length>0&&(f=h.classes.join(" ")),f+=" flowchart-label";let b=(0,c.k)(h.styles),w=void 0!==h.text?h.text:h.id,d={width:0,height:0},g=[{id:h.id+"-west",layoutOptions:{"port.side":"WEST"}},{id:h.id+"-east",layoutOptions:{"port.side":"EAST"}},{id:h.id+"-south",layoutOptions:{"port.side":"SOUTH"}},{id:h.id+"-north",layoutOptions:{"port.side":"NORTH"}}],p=0,m="",v={};switch(h.type){case"round":p=5,m="rect";break;case"square":case"group":default:m="rect";break;case"diamond":m="question",v={portConstraints:"FIXED_SIDE"};break;case"hexagon":m="hexagon";break;case"odd":case"odd_right":m="rect_left_inv_arrow";break;case"lean_right":m="lean_right";break;case"lean_left":m="lean_left";break;case"trapezoid":m="trapezoid";break;case"inv_trapezoid":m="inv_trapezoid";break;case"circle":m="circle";break;case"ellipse":m="ellipse";break;case"stadium":m="stadium";break;case"subroutine":m="subroutine";break;case"cylinder":m="cylinder";break;case"doublecircle":m="doublecircle"}let k={labelStyle:b.labelStyle,shape:m,labelText:w,labelType:h.labelType,rx:p,ry:p,class:f,style:b.style,id:h.id,link:h.link,linkTarget:h.linkTarget,tooltip:r.db.getTooltip(h.id)||"",domId:r.db.lookUpDomId(h.id),haveCallback:h.haveCallback,width:"group"===h.type?500:void 0,dir:h.dir,type:h.type,props:h.props,padding:(0,c.F)().flowchart.padding};if("group"!==k.type)e=(u=await (0,a.e)(s,k,h.dir)).node().getBBox();else{i.createElementNS("http://www.w3.org/2000/svg","text");let{shapeSvg:n,bbox:t}=await (0,a.l)(s,k,void 0,!0);d.width=t.width,d.wrappingWidth=(0,c.F)().flowchart.wrappingWidth,d.height=t.height,d.labelNode=n.node(),k.labelData=d}let y={id:h.id,ports:"diamond"===h.type?g:[],layoutOptions:v,labelText:w,labelData:d,domId:r.db.lookUpDomId(h.id),width:null==e?void 0:e.width,height:null==e?void 0:e.height,type:h.type,el:u,parent:o.parentById[h.id]};l[k.id]=y})),u},w=(n,t,e)=>{let i={TB:{in:{north:"north"},out:{south:"west",west:"east",east:"south"}},LR:{in:{west:"west"},out:{east:"south",south:"north",north:"east"}},RL:{in:{east:"east"},out:{west:"north",north:"south",south:"west"}},BT:{in:{south:"south"},out:{north:"east",east:"west",west:"north"}}};return i.TD=i.TB,i[e][t][n]},d=(n,t,e)=>{if((0,c.l).info("getNextPort",{node:n,edgeDirection:t,graphDirection:e}),!h[n])switch(e){case"TB":case"TD":h[n]={inPosition:"north",outPosition:"south"};break;case"BT":h[n]={inPosition:"south",outPosition:"north"};break;case"RL":h[n]={inPosition:"east",outPosition:"west"};break;case"LR":h[n]={inPosition:"west",outPosition:"east"}}let i="in"===t?h[n].inPosition:h[n].outPosition;return"in"===t?h[n].inPosition=w(h[n].inPosition,t,e):h[n].outPosition=w(h[n].outPosition,t,e),i},g=(n,t)=>{let e=n.start,i=n.end,r=e,a=i,c=l[e],o=l[i];return c&&o?("diamond"===c.type&&(e=`${e}-${d(e,"out",t)}`),"diamond"===o.type&&(i=`${i}-${d(i,"in",t)}`),{source:e,target:i,sourceId:r,targetId:a}):{source:e,target:i}},p=function(n,t,e,i){let o,u;(0,c.l).info("abc78 edges = ",n);let s=i.insert("g").attr("class","edgeLabels"),h={},l=t.db.getDirection();if(void 0!==n.defaultStyle){let t=(0,c.k)(n.defaultStyle);o=t.style,u=t.labelStyle}return n.forEach(function(t){let i="L-"+t.start+"-"+t.end;void 0===h[i]?h[i]=0:h[i]++,(0,c.l).info("abc78 new entry",i,h[i]);let b=i+"-"+h[i];(0,c.l).info("abc78 new link id to be used is",i,b,h[i]);let w="LS-"+t.start,d="LE-"+t.end,p={style:"",labelStyle:""};switch(p.minlen=t.length||1,"arrow_open"===t.type?p.arrowhead="none":p.arrowhead="normal",p.arrowTypeStart="arrow_open",p.arrowTypeEnd="arrow_open",t.type){case"double_arrow_cross":p.arrowTypeStart="arrow_cross";case"arrow_cross":p.arrowTypeEnd="arrow_cross";break;case"double_arrow_point":p.arrowTypeStart="arrow_point";case"arrow_point":p.arrowTypeEnd="arrow_point";break;case"double_arrow_circle":p.arrowTypeStart="arrow_circle";case"arrow_circle":p.arrowTypeEnd="arrow_circle"}let m="",v="";switch(t.stroke){case"normal":m="fill:none;",void 0!==o&&(m=o),void 0!==u&&(v=u),p.thickness="normal",p.pattern="solid";break;case"dotted":p.thickness="normal",p.pattern="dotted",p.style="fill:none;stroke-width:2px;stroke-dasharray:3;";break;case"thick":p.thickness="thick",p.pattern="solid",p.style="stroke-width: 3.5px;fill:none;"}if(void 0!==t.style){let n=(0,c.k)(t.style);m=n.style,v=n.labelStyle}p.style=p.style+=m,p.labelStyle=p.labelStyle+=v,void 0!==t.interpolate?p.curve=(0,c.n)(t.interpolate,r.curveLinear):void 0!==n.defaultInterpolate?p.curve=(0,c.n)(n.defaultInterpolate,r.curveLinear):p.curve=(0,c.n)(f.curve,r.curveLinear),void 0===t.text?void 0!==t.style&&(p.arrowheadStyle="fill: #333"):(p.arrowheadStyle="fill: #333",p.labelpos="c"),p.labelType=t.labelType,p.label=t.text.replace(c.e.lineBreakRegex,"\n"),void 0===t.style&&(p.style=p.style||"stroke: #333; stroke-width: 1.5px;fill:none;"),p.labelStyle=p.labelStyle.replace("color:","fill:"),p.id=b,p.classes="flowchart-link "+w+" "+d;let k=(0,a.f)(s,p),{source:y,target:M,sourceId:T,targetId:j}=g(t,l);(0,c.l).debug("abc78 source and target",y,M),e.edges.push({id:"e"+t.start+t.end,sources:[y],targets:[M],sourceId:T,targetId:j,labelEl:k,labels:[{width:p.width,height:p.height,orgWidth:p.width,orgHeight:p.height,text:p.label,layoutOptions:{"edgeLabels.inline":"true","edgeLabels.placement":"CENTER"}}],edgeData:p})}),e},m=function(n,t,e,i,r){let c="";i&&(c=(c=(c=window.location.protocol+"//"+window.location.host+window.location.pathname+window.location.search).replace(/\(/g,"\\(")).replace(/\)/g,"\\)")),(0,a.m)(n,t,c,r,e)},v=function(n){let t={parentById:{},childrenById:{}},e=n.getSubGraphs();return(0,c.l).info("Subgraphs - ",e),e.forEach(function(n){n.nodes.forEach(function(e){t.parentById[e]=n.id,void 0===t.childrenById[n.id]&&(t.childrenById[n.id]=[]),t.childrenById[n.id].push(e)})}),e.forEach(function(n){n.id,void 0!==t.parentById[n.id]&&t.parentById[n.id]}),t},k=function(n,t,e){let i=u(n,t,e);if(void 0===i||"root"===i)return{x:0,y:0};let r=l[i].offset;return{x:r.posX,y:r.posY}},y=function(n,t,e,i,c,o){let u=k(t.sourceId,t.targetId,c),s=t.sections[0].startPoint,h=t.sections[0].endPoint,f=(t.sections[0].bendPoints?t.sections[0].bendPoints:[]).map(n=>[n.x+u.x,n.y+u.y]),l=[[s.x+u.x,s.y+u.y],...f,[h.x+u.x,h.y+u.y]],{x:b,y:w}=(0,a.k)(t.edgeData),d=(0,r.line)().x(b).y(w).curve(r.curveLinear),g=n.insert("path").attr("d",d(l)).attr("class","path "+e.classes).attr("fill","none"),p=n.insert("g").attr("class","edgeLabel"),v=(0,r.select)(p.node().appendChild(t.labelEl)),y=v.node().firstChild.getBoundingClientRect();v.attr("width",y.width),v.attr("height",y.height),p.attr("transform",`translate(${t.labels[0].x+u.x}, ${t.labels[0].y+u.y})`),m(g,e,i.type,i.arrowMarkerAbsolute,o)},M=(n,t)=>{n.forEach(n=>{n.children||(n.children=[]);let e=t.childrenById[n.id];e&&e.forEach(t=>{n.children.push(l[t])}),M(n.children,t)})},T=async function(n,t,e,i){var o;let u,f;i.db.clear(),l={},h={},i.db.setGen("gen-2"),i.parser.parse(n);let w=(0,r.select)("body").append("div").attr("style","height:400px").attr("id","cy"),d={id:"root",layoutOptions:{"elk.hierarchyHandling":"INCLUDE_CHILDREN","org.eclipse.elk.padding":"[top=100, left=100, bottom=110, right=110]","elk.layered.spacing.edgeNodeBetweenLayers":"30","elk.direction":"DOWN"},children:[],edges:[]};switch((0,c.l).info("Drawing flowchart using v3 renderer",s),i.db.getDirection()){case"BT":d.layoutOptions["elk.direction"]="UP";break;case"TB":d.layoutOptions["elk.direction"]="DOWN";break;case"LR":d.layoutOptions["elk.direction"]="RIGHT";break;case"RL":d.layoutOptions["elk.direction"]="LEFT"}let{securityLevel:g,flowchart:m}=(0,c.F)();"sandbox"===g&&(u=(0,r.select)("#i"+t));let k="sandbox"===g?(0,r.select)(u.nodes()[0].contentDocument.body):(0,r.select)("body"),T="sandbox"===g?u.nodes()[0].contentDocument:document,E=k.select(`[id="${t}"]`);(0,a.a)(E,["point","circle","cross"],i.type,t);let S=i.db.getVertices(),P=i.db.getSubGraphs();(0,c.l).info("Subgraphs - ",P);for(let n=P.length-1;n>=0;n--)f=P[n],i.db.addVertex(f.id,{text:f.title,type:f.labelType},"group",void 0,f.classes,f.dir);let C=E.insert("g").attr("class","subgraphs"),I=v(i.db);d=await b(S,t,k,T,i,I,d);let O=E.insert("g").attr("class","edges edgePath");d=p(i.db.getEdges(),i,d,E),Object.keys(l).forEach(n=>{let t=l[n];t.parent||d.children.push(t),void 0!==I.childrenById[n]&&(t.labels=[{text:t.labelText,layoutOptions:{"nodeLabels.placement":"[H_CENTER, V_TOP, INSIDE]"},width:t.labelData.width,height:t.labelData.height}],delete t.x,delete t.y,delete t.width,delete t.height)}),M(d.children,I),(0,c.l).info("after layout",JSON.stringify(d,null,2));let A=await s.layout(d);j(0,0,A.children,E,C,i,0),(0,c.l).info("after layout",A),null==(o=A.edges)||o.map(n=>{y(O,n,n.edgeData,i,I,t)}),(0,c.o)({},E,m.diagramPadding,m.useMaxWidth),w.remove()},j=(n,t,e,i,r,a,o)=>{e.forEach(function(e){if(e){if(l[e.id].offset={posX:e.x+n,posY:e.y+t,x:n,y:t,depth:o,width:e.width,height:e.height},"group"===e.type){let i=r.insert("g").attr("class","subgraph");i.insert("rect").attr("class","subgraph subgraph-lvl-"+o%5+" node").attr("x",e.x+n).attr("y",e.y+t).attr("width",e.width).attr("height",e.height);let a=i.insert("g").attr("class","label"),u=(0,c.F)().flowchart.htmlLabels?e.labelData.width/2:0;a.attr("transform",`translate(${e.labels[0].x+n+e.x+u}, ${e.labels[0].y+t+e.y+3})`),a.node().appendChild(e.labelData.labelNode),(0,c.l).info("Id (UGH)= ",e.type,e.labels)}else(0,c.l).info("Id (UGH)= ",e.id),e.el.attr("transform",`translate(${e.x+n+e.width/2}, ${e.y+t+e.height/2})`)}}),e.forEach(function(e){e&&"group"===e.type&&j(n+e.x,t+e.y,e.children,i,r,a,o+1)})},E=n=>{let t="";for(let e=0;e<5;e++)t+=`
      .subgraph-lvl-${e} {
        fill: ${n[`surface${e}`]};
        stroke: ${n[`surfacePeer${e}`]};
      }
    `;return t},S={db:i.d,renderer:{getClasses:function(n,t){return(0,c.l).info("Extracting classes"),t.db.getClasses()},draw:T},parser:i.p,styles:n=>`.label {
    font-family: ${n.fontFamily};
    color: ${n.nodeTextColor||n.textColor};
  }
  .cluster-label text {
    fill: ${n.titleColor};
  }
  .cluster-label span {
    color: ${n.titleColor};
  }

  .label text,span {
    fill: ${n.nodeTextColor||n.textColor};
    color: ${n.nodeTextColor||n.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${n.mainBkg};
    stroke: ${n.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${n.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${n.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${n.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${n.edgeLabelBackground};
    rect {
      opacity: 0.85;
      background-color: ${n.edgeLabelBackground};
      fill: ${n.edgeLabelBackground};
    }
    text-align: center;
  }

  .cluster rect {
    fill: ${n.clusterBkg};
    stroke: ${n.clusterBorder};
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${n.titleColor};
  }

  .cluster span {
    color: ${n.titleColor};
  }
  /* .cluster div {
    color: ${n.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${n.fontFamily};
    font-size: 12px;
    background: ${n.tertiaryColor};
    border: 1px solid ${n.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${n.textColor};
  }
  .subgraph {
    stroke-width:2;
    rx:3;
  }
  // .subgraph-lvl-1 {
  //   fill:#ccc;
  //   // stroke:black;
  // }

  .flowchart-label text {
    text-anchor: middle;
  }

  ${E(n)}
//# sourceMappingURL=flowchart-elk-definition-ae0efee6.dacc951c.js.map